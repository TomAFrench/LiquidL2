// SPDX-License-Identifier: MIT

pragma solidity 0.7.1;

interface IAaveCollateralVaultProxy {
    event IncreaseLimit(address indexed vault, address indexed owner, address indexed spender, uint256 limit);
    event DecreaseLimit(address indexed vault, address indexed owner, address indexed spender, uint256 limit);
    event SetModel(address indexed vault, address indexed owner, uint256 model);
    event SetBorrow(address indexed vault, address indexed owner, address indexed reserve);
    event Deposit(address indexed vault, address indexed owner, address indexed reserve, uint256 amount);
    event Withdraw(address indexed vault, address indexed owner, address indexed reserve, uint256 amount);
    event Borrow(address indexed vault, address indexed owner, address indexed reserve, uint256 amount);
    event Repay(address indexed vault, address indexed owner, address indexed reserve, uint256 amount);
    event DeployVault(address indexed vault, address indexed owner, address indexed asset);

    function increaseLimit(
        address vault,
        address spender,
        uint256 addedValue
    ) external;

    function decreaseLimit(
        address vault,
        address spender,
        uint256 subtractedValue
    ) external;

    function deposit(
        address vault,
        address aToken,
        uint256 amount
    ) external;

    function withdraw(
        address vault,
        address aToken,
        uint256 amount
    ) external;

    function borrow(
        address vault,
        address reserve,
        uint256 amount
    ) external;

    function repay(
        address vault,
        address reserve,
        uint256 amount
    ) external;

    function deployVault(address _asset) external returns (address);
}
