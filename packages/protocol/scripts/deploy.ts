/* eslint-disable no-console */
const env = require('@nomiclabs/buidler');
const chalk = require('chalk');

const deployMockCollateralVaultProxy = async () => {
    const { ethers } = env

    process.stdout.write(`Deploying ${chalk.cyan('MockCollateralVaultProxy')}...\r`);
    const MockCollateralVaultProxy = await ethers.getContractFactory('MockAaveCollateralVaultProxy');
    const mockCollateralVaultProxy = await MockCollateralVaultProxy.deploy();
    await mockCollateralVaultProxy.deployed();

    console.log(
        `Deployed ${chalk.cyan('MockCollateralVaultProxy')} to ${chalk.yellow(mockCollateralVaultProxy.address)}`
    );

    return mockCollateralVaultProxy
}

const deployWithdrawalVaultFactory = async (aaveCollateralVaultProxy:string, maticRootChainManager: string, layer1: boolean) => {
    const { ethers } = env

    process.stdout.write(`Deploying ${chalk.cyan('WithdrawalVaultFactory')}...\r`);
    const Factory = await ethers.getContractFactory('WithdrawalVaultFactory');
    const factory = await Factory.deploy(
        aaveCollateralVaultProxy,
        maticRootChainManager,
        layer1
    );
    await factory.deployed();

    console.log(
        `Deployed ${chalk.cyan('WithdrawalVaultFactory')} to ${chalk.yellow(factory.address)}`
    );

    return factory
}

async function main() {
    console.log();
    const mockCollateralVaultProxy = await deployMockCollateralVaultProxy()

    const mumbaiRootChainManagerProxy = "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74";
    await deployWithdrawalVaultFactory(mockCollateralVaultProxy.address, mumbaiRootChainManagerProxy, env.network.name === "goerli" )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });