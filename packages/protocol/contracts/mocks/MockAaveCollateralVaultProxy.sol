// SPDX-License-Identifier: MIT

pragma solidity 0.7.1;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IAaveCollateralVaultProxy } from "../interfaces/IAaveCollateralVaultProxy.sol";

contract MockAaveCollateralVaultProxy is IAaveCollateralVaultProxy {
    function deployVault(
        address /* _asset */
    ) external override view returns (address) {
        return address(this);
    }

    function deposit(
        address, /* vault */
        address aToken,
        uint256 amount
    ) external override {
        IERC20(aToken).transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(
        address, /* vault */
        address aToken,
        uint256 amount
    ) external override {
        IERC20(aToken).transfer(msg.sender, amount);
    }

    function borrow(
        address, /* vault */
        address reserve,
        uint256 amount
    ) external override {
        IERC20(reserve).transfer(msg.sender, amount);
    }

    function repay(
        address, /* vault */
        address reserve,
        uint256 amount
    ) external override {
        IERC20(reserve).transferFrom(msg.sender, address(this), amount);
    }

    function increaseLimit(
        address, /* vault */
        address, /*spender*/
        uint256 /*addedValue*/
    ) external override {}

    function decreaseLimit(
        address, /* vault */
        address, /*spender*/
        uint256 /*subtractedValue*/
    ) external override {}
}
