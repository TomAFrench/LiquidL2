import { useEffect, useState } from "react";

import { calculateVaultAddress } from "../utils/vaults";
import { getWithdrawals } from "../graphql/withdrawals";

import { Withdrawal } from "../types";

const usePendingWithdrawals = (userAddress: string | undefined): Withdrawal[] => {
  const [pendingWithdrawals, setPendingWithdrawals] = useState<Withdrawal[]>([]);

  useEffect(() => {
    const getPendingWithdrawals = async () => {
      if (!userAddress) return [];
      const withdrawals = await getWithdrawals(calculateVaultAddress(userAddress));
      setPendingWithdrawals(withdrawals);
    };
    getPendingWithdrawals();
  }, [userAddress]);

  return pendingWithdrawals;
};

export default usePendingWithdrawals;
