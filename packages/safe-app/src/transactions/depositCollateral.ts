import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import { Transaction } from "@gnosis.pm/safe-apps-sdk";

import erc20Abi from "../abis/erc20";
import factoryAbi from "../abis/IWithdrawalVaultFactory";

const WITHDRAWAL_VAULT_FACTORY_ADDRESS = AddressZero;

const depositCollateralTxs = (aTokenAddress: string, depositAmount: BigNumberish): Transaction[] => {
  const erc20Interface: Interface = new Interface(erc20Abi);
  const WithdrawalVaultFactoryInterface: Interface = new Interface(factoryAbi);

  const approvalTx = {
    data: erc20Interface.encodeFunctionData("approve", [WITHDRAWAL_VAULT_FACTORY_ADDRESS, depositAmount]),
    to: aTokenAddress,
    value: "0",
  };

  const depositTx = {
    data: WithdrawalVaultFactoryInterface.encodeFunctionData("depositCollateral", [aTokenAddress, depositAmount]),
    to: WITHDRAWAL_VAULT_FACTORY_ADDRESS,
    value: "0",
  };

  return [approvalTx, depositTx];
};

export default depositCollateralTxs;
