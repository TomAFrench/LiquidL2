// SPDX-License-Identifier: MIT

pragma solidity 0.7.1;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Create2 } from "@openzeppelin/contracts/utils/Create2.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IAToken } from "./IAToken.sol";
import { IChildERC20 } from "./IChildERC20.sol";

import { IAaveCollateralVaultProxy } from "./IAaveCollateralVaultProxy.sol";
import { IRootChainManager } from "./IRootChainManager.sol";

interface IWithdrawalVaultFactory {
    event GiveLoan(address indexed vault, address indexed token, uint256 amount);
    event Borrow(address indexed vault, address indexed token, uint256 amount);
    event RepayLoan(address indexed vault, address indexed token, uint256 withdrawalAmount, uint256 loanRepayment);
    event Withdrawal(address indexed vault, address indexed token, uint256 amount);

    /**
     * @notice Deposit funds into a collateralVault to be used to back loans.
     * @param asset the asset which is to be deposited
     * @param amount the amount of this asset to be deposited
     */
    function exitFunds(IChildERC20 asset, uint256 amount) external;

    function exitFundsWithAuthorization(
        IChildERC20 asset,
        uint256 amount,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /**
     * @notice Deposit funds into a collateralVault to be used to back loans.
     * @param asset the asset which is to be deposited
     * @param amount the amount of this asset to be deposited
     */
    function depositCollateral(IAToken asset, uint256 amount) external;

    /**
     * @notice Withdraw funds from a collateralVault.
     * @param asset the address of the aToken asset which is to be withdrawn
     * @param amount the amount of this asset to be withdrawn
     */
    function withdrawCollateral(IAToken asset, uint256 amount) external;

    /**
     * @notice Increase the credit limit of the supplied address by given amount
     * @param vaultAddress the address of the vault to be given an increased credit limit
     * @param asset the asset in which the loan is denominated
     * @param amount the size of the loan
     */
    function giveLoan(
        address vaultAddress,
        address asset,
        uint256 amount
    ) external;

    /**
     * @notice Draw funds against a vaults credit limit
     * @param asset the asset of which to borrow
     * @param amount the size of the loan
     */
    function borrow(IERC20 asset, uint256 amount) external;

    /**
     * @notice Finalise a withdrawal from L2 and use funds to repay the vaults loan
     * @dev This must be able to be called by anyone such that lenders' funds can't be locked.
     * @param borrower the address of borrower who's loan is to be repaid
     * @param asset the asset in which the loan is denominated
     * @param withdrawalProof the proof to withdraw funds from layer 2 to the vault
     */
    function repayLoan(
        address borrower,
        IERC20 asset,
        bytes calldata withdrawalProof
    ) external;
}
