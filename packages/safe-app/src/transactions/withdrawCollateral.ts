import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import { Transaction } from "@gnosis.pm/safe-apps-sdk";

import factoryAbi from "../abis/IWithdrawalVaultFactory";

const WITHDRAWAL_VAULT_FACTORY_ADDRESS = AddressZero;

const withdrawCollateralTxs = (aTokenAddress: string, depositAmount: BigNumberish): Transaction[] => {
  const WithdrawalVaultFactoryInterface: Interface = new Interface(factoryAbi);

  const withdrawTx = {
    data: WithdrawalVaultFactoryInterface.encodeFunctionData("withdrawCollateral", [aTokenAddress, depositAmount]),
    to: WITHDRAWAL_VAULT_FACTORY_ADDRESS,
    value: "0",
  };

  return [withdrawTx];
};

export default withdrawCollateralTxs;
