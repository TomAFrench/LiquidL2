pragma solidity 0.7.1;

import { SafeMath } from '@openzeppelin/contracts/math/SafeMath.sol';
import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';

import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { IChildERC20 } from './interfaces/IChildERC20.sol';
import { IAaveCollateralVaultProxy } from './interfaces/IAaveCollateralVaultProxy.sol';
import { IRootChainManager } from "./interfaces/IRootChainManager.sol";
import { IWithdrawalVaultFactory } from './interfaces/IWithdrawalVaultFactory.sol';

contract WithdrawalVault is Ownable {
  using SafeMath for uint256;

  address public immutable borrower;
  mapping(address => uint256) public loans;

  constructor (address _borrower) {
    borrower = _borrower;
  }

  /**
    * @notice Collects funds from borrower and burns them to initiate a withdrawal to Ethereum.
    * @param asset - the asset which is to be burnt
    * @param amount - the amount of this asset to be burnt
    */
  function exitFunds(IChildERC20 asset, uint256 amount) external onlyOwner { 
    require(asset.transferFrom(borrower, address(this), amount), "Transfer of tokens failed");
    asset.withdraw(amount);
  }

  /**
    * @param asset - the asset which is to be borrowed
    * @param collateralVault - the address which has given this vault the loan
    * @param amount - the amount of asset which the loan is going to borrow
    */
  function borrow(IERC20 asset, IAaveCollateralVaultProxy aaveCollateralVaultProxy, address collateralVault, uint256 amount) external onlyOwner {  
    aaveCollateralVaultProxy.borrow(collateralVault, address(asset), amount);
    loans[address(asset)] = loans[address(asset)].add(amount);

    // send funds to the borrower
    require(asset.transfer(borrower, amount), "Transfer of tokens failed");
  }

  /**
    * @param asset - the asset which denominates the loan which is to be repaid
    * @param collateralVault - the address which has given this vault the loan
    * @param amount - the amount of asset which the loan is going to use to repay the loan
    */
  function repayLoan(IERC20 asset, IAaveCollateralVaultProxy aaveCollateralVaultProxy, address collateralVault, uint256 amount) external onlyOwner returns (uint256 repaymentAmount){
    // Only repay up to the amount borrowed
    repaymentAmount = amount < loans[address(asset)] ? amount : loans[address(asset)];
    
    // pay off borrowed balance from collateralVault
    aaveCollateralVaultProxy.repay(collateralVault, address(asset), repaymentAmount);
    loans[address(asset)] = loans[address(asset)].sub(repaymentAmount);

    // send any remaining funds to the borrower
    require(asset.transfer(borrower, asset.balanceOf(address(this))), "Transfer of remaining tokens failed");
  }

  /**
    * @param asset - the asset which is to be claimed from the rootChainManager
    * @param withdrawalProof - the proof object which allows the WithdrawalVault to claim funds from the rootChainManager
    * @return withdrawalAmount - the amount of asset which the vault has gained through the withdrawal
    */
  function claimFunds (IERC20 asset, IRootChainManager maticRootChainManager, bytes calldata withdrawalProof) external onlyOwner returns (uint256 withdrawalAmount) {
    uint256 balanceBefore = asset.balanceOf(address(this));
    
    // claim funds from RootChainManager to be sent to this address
    maticRootChainManager.exit(withdrawalProof);
    
    withdrawalAmount = asset.balanceOf(address(this)).sub(balanceBefore);
    require(withdrawalAmount > 0, "Withdrawal is of incorrect asset.");
  }
}