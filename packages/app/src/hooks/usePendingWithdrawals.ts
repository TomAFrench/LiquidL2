import { useEffect, useState } from "react";

import { JsonRpcProvider, Log } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { Interface } from "@ethersproject/abi";
import { calculateVaultAddress } from "../utils/vaults";
// import { getWithdrawals } from "../graphql/withdrawals";

import { Withdrawal } from "../types";
import { MATIC_RPC_URL, WITHDRAWAL_VAULT_FACTORY_ADDRESS } from "../utils/constants";
import IWithdrawalVaultFactory from "../abis/IWithdrawalVaultFactory.json";

// const usePendingWithdrawals = (userAddress: string | undefined): Withdrawal[] => {
//   const [pendingWithdrawals, setPendingWithdrawals] = useState<Withdrawal[]>([]);

//   useEffect(() => {
//     const getPendingWithdrawals = async () => {
//       if (!userAddress) return [];
//       const withdrawals = await getWithdrawals(calculateVaultAddress(userAddress));
//       setPendingWithdrawals(withdrawals);
//     };
//     getPendingWithdrawals();
//   }, [userAddress]);

//   return pendingWithdrawals;
// };

const usePendingWithdrawalsEvents = (userAddress: string | undefined): Withdrawal[] => {
  const [pendingWithdrawals, setPendingWithdrawals] = useState<Withdrawal[]>([]);

  useEffect(() => {
    const getPendingWithdrawals = async () => {
      if (!userAddress) return [];
      const vaultAddress = calculateVaultAddress(userAddress);
      const provider = new JsonRpcProvider(MATIC_RPC_URL);
      const withdrawalVaultFactory = new Contract(
        WITHDRAWAL_VAULT_FACTORY_ADDRESS,
        IWithdrawalVaultFactory.abi,
        await provider.getSigner(),
      );

      const filter = {
        address: WITHDRAWAL_VAULT_FACTORY_ADDRESS,
        fromBlock: 5813836,
        toBlock: "latest",
        ...withdrawalVaultFactory.filters.Withdrawal(vaultAddress, null, null),
      };

      const logs = await provider.getLogs(filter);
      const iface = new Interface(IWithdrawalVaultFactory.abi);

      const withdrawals = logs.map((log: Log) => {
        const values = iface.parseLog(log).args;
        return {
          id: log.transactionHash,
          user: values.vault,
          amount: values.amount,
          childToken: values.token,
        };
      });
      setPendingWithdrawals(withdrawals);
    };
    getPendingWithdrawals();
  }, [userAddress]);

  return pendingWithdrawals;
};

export default usePendingWithdrawalsEvents;
