import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import { Transaction } from "@gnosis.pm/safe-apps-sdk";

import factoryAbi from "../abis/IWithdrawalVaultFactory";

const WITHDRAWAL_VAULT_FACTORY_ADDRESS = AddressZero;

const giveLoanTxs = (vaultAddress: string, aTokenAddress: string, creditAmount: BigNumberish): Transaction[] => {
  const WithdrawalVaultFactoryInterface: Interface = new Interface(factoryAbi);

  const loanTx = {
    data: WithdrawalVaultFactoryInterface.encodeFunctionData("giveLoan", [vaultAddress, aTokenAddress, creditAmount]),
    to: WITHDRAWAL_VAULT_FACTORY_ADDRESS,
    value: "0",
  };

  return [loanTx];
};

export default giveLoanTxs;
