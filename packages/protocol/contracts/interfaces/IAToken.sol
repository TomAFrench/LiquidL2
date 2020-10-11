// SPDX-License-Identifier: MIT

pragma solidity 0.7.1;

interface IAToken {
    function approve(address spender, uint256 amount) external returns (bool);

    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function underlyingAssetAddress() external returns (address);
}
