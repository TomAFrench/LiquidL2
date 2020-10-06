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

    function setModel(address vault, uint256 model) external;

    function getBorrow(address vault) external view returns (address);

    function isVaultOwner(address vault, address owner) external view returns (bool);

    function isVault(address vault) external view returns (bool);

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

    function getVaults(address owner) external view returns (address[] memory);

    function deployVault(address _asset) external returns (address);

    function getVaultAccountData(address _vault)
        external
        view
        returns (
            uint256 totalLiquidityUSD,
            uint256 totalCollateralUSD,
            uint256 totalBorrowsUSD,
            uint256 totalFeesUSD,
            uint256 availableBorrowsUSD,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        );

    function getAaveOracle() external view returns (address);

    function getReservePriceETH(address reserve) external view returns (uint256);

    function getReservePriceUSD(address reserve) external view returns (uint256);

    function getETHPriceUSD() external view returns (uint256);

    function getAave() external view returns (address);
}
