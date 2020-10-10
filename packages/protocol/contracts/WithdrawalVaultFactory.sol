pragma solidity 0.7.1;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { Create2 } from "@openzeppelin/contracts/utils/Create2.sol";
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { IAToken } from './interfaces/IAToken.sol';
import { IChildERC20 } from './interfaces/IChildERC20.sol';

import { IAaveCollateralVaultProxy } from './interfaces/IAaveCollateralVaultProxy.sol';
import { IRootChainManager } from "./interfaces/IRootChainManager.sol";
import { IWithdrawalVaultFactory } from "./interfaces/IWithdrawalVaultFactory.sol";

import { WithdrawalVault } from './WithdrawalVault.sol';

contract WithdrawalVaultFactory is Ownable, IWithdrawalVaultFactory {

  IAaveCollateralVaultProxy public immutable aaveCollateralVaultProxy;
  IRootChainManager public immutable maticRootChainManager;
  
  // collateralVaults are indexed by the asset which they lend. i.e. USDC rather than aUSDC
  mapping(address => address) public collateralVaults;

  // WithdrawalVaultFactory will be deployed on both layers 1 and 2.
  // We then have a flag to prevent functions being called on the wrong chain
  bool public immutable layer1;
  modifier onLayer1 {
    require(layer1, "Function not available on layer 2");
    _;
  }

  modifier onLayer2 {
    require(!layer1, "Function not available on layer 1");
    _;
  }

  /**
    * @param _aaveCollateralVaultProxy - the address of the proxy for Aave Collateral Vaults
    * @param _maticRootChainManager -  the address of the Matic RootChainManager proxy contract
    * @param _layer1 whether this contract is deployed on Ethereum mainnet
    */
  constructor (IAaveCollateralVaultProxy _aaveCollateralVaultProxy, IRootChainManager _maticRootChainManager, bool _layer1) {
    aaveCollateralVaultProxy = _aaveCollateralVaultProxy;
    maticRootChainManager = _maticRootChainManager;
    layer1 = _layer1;
  }

  /**
    * @notice Deposit funds into a collateralVault to be used to back loans.
    * @param asset the asset which is to be deposited
    * @param amount the amount of this asset to be deposited
    */
  function exitFunds(IChildERC20 asset, uint amount) external onLayer2 override {
    // create2 a vault from msg.sender if doesn't exist already
    WithdrawalVault vault = WithdrawalVault(maybeMakeVault(msg.sender));
    vault.exitFunds(asset, amount);
    emit Withdrawal(address(vault), address(asset), amount);
  }

  /**
    * @notice Deposit funds into a collateralVault to be used to back loans.
    * @param asset the address of the aToken asset which is to be deposited
    * @param amount the amount of this asset to be deposited
    */
  function depositCollateral(IAToken asset, uint amount) onlyOwner onLayer1 external override {
    address underlying = asset.underlyingAssetAddress();
    address collateralVault = collateralVaults[underlying];
    if (collateralVault == address(0)){
      collateralVaults[underlying] = aaveCollateralVaultProxy.deployVault(underlying);
    }

    asset.transferFrom(msg.sender, address(this), amount);
    asset.approve(collateralVault, amount);
    aaveCollateralVaultProxy.deposit(collateralVault, address(asset), amount);
  }

  /**
  * @notice Withdraw funds from a collateralVault.
  * @param asset the address of the aToken asset which is to be withdrawn
  * @param amount the amount of this asset to be withdrawn
  */
  function withdrawCollateral(IAToken asset, uint amount) onlyOwner onLayer1 external override {
    address collateralVault = collateralVaults[asset.underlyingAssetAddress()];
    require(collateralVault != address(0), "No collateral vault exists for this asset");
    aaveCollateralVaultProxy.withdraw(collateralVault, address(asset), amount);
    asset.transfer(msg.sender, amount);
  }

  /**
    * @notice Increase the credit limit of the supplied address by given amount
    * @param vaultAddress the address of the vault to be given an increased credit limit
    * @param asset the asset in which the loan is denominated
    * @param amount the size of the loan 
    */
  function giveLoan(address vaultAddress, address asset, uint256 amount) onlyOwner onLayer1 external override {
    aaveCollateralVaultProxy.increaseLimit(collateralVaults[asset], vaultAddress, amount);
    emit GiveLoan(vaultAddress, asset, amount);
  }

  /**
    * @notice Draw funds against a vaults credit limit
    * @param asset the asset of which to borrow
    * @param amount the size of the loan 
    */
  function borrow(IERC20 asset, uint256 amount) onLayer1 external override {
    address collateralVault = collateralVaults[address(asset)];
    require(collateralVault != address(0), "No collateral vault exists for this asset");

    // Calculate the address of the borrower's vault
    WithdrawalVault vault = maybeMakeVault(msg.sender);
    vault.borrow(asset, aaveCollateralVaultProxy, collateralVault, amount);
  }

  /**
    * @notice Finalise a withdrawal from L2 and use funds to repay the vaults loan
    * @dev This must be able to be called by anyone such that lenders' funds can't be locked.
    * @param borrower the address of borrower who's loan is to be repaid
    * @param asset the asset in which the loan is denominated
    * @param withdrawalProof the proof to withdraw funds from layer 2 to the vault
    */
  function repayLoan(address borrower, IERC20 asset, bytes calldata withdrawalProof) onLayer1 external override {
    // create2 a vault from borrower if doesn't exist
    WithdrawalVault vault = maybeMakeVault(borrower);

    // submit withdrawalProof so that funds get credited to vault
    uint256 amount = vault.claimFunds(asset, maticRootChainManager, withdrawalProof);
    
    // repay any debt and refund any remaining funds to borrower
    address lendingCollateralVault = collateralVaults[address(asset)];
    uint256 loanRepayment = vault.repayLoan(asset, aaveCollateralVaultProxy, lendingCollateralVault, amount);

    // reduce the credit limit for the vault
    aaveCollateralVaultProxy.decreaseLimit(lendingCollateralVault, address(vault), amount);
    emit RepayLoan(address(vault), address(asset), amount, loanRepayment);
  }

  /**
    * @dev Checks if there already exists a withdrawalVault for the provided borrower, if not then create one.
    *
    * @param borrowerAddress - address of borrower whose vault we are looking for
    * @return vaultAddress - the address of the borrower's vault
    */
  function maybeMakeVault(address borrowerAddress) internal returns (WithdrawalVault) {
    bytes32 vaultSalt = keccak256(abi.encode(borrowerAddress));
    address vaultAddress = Create2.computeAddress(vaultSalt, keccak256(abi.encodePacked(type(WithdrawalVault).creationCode, abi.encode(borrowerAddress))));
    
    // Check if there exists a contract at the expected address
    // If not then deploy a vault to there.
    uint256 sz;
    assembly {
      sz := extcodesize(vaultAddress)
    }
    if (sz == 0) {
      return new WithdrawalVault{salt: vaultSalt}(borrowerAddress);
    }
    return WithdrawalVault(vaultAddress);
  }
}