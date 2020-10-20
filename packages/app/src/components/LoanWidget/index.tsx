import React, { useCallback, useEffect, useState } from "react";
import { JsonRpcProvider, Network, Web3Provider } from "@ethersproject/providers";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { TextField } from "@material-ui/core";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { Zero } from "@ethersproject/constants";
import { Border, Button } from "../common";
import IWithdrawalVaultFactory from "../../abis/IWithdrawalVaultFactory.json";
import {
  MAINNET_CHAIN_ID,
  MAINNET_RPC_URL,
  MAINNET_USDC_ADDRESS,
  WITHDRAWAL_VAULT_FACTORY_ADDRESS,
} from "../../utils/constants";
import { calculateVaultAddress } from "../../utils/vaults";
import { getLoan } from "../../graphql/loans";
import { Loan } from "../../types";
import usePendingWithdrawals from "../../hooks/usePendingWithdrawals";
import IERC20 from "../../abis/IERC20.json";

interface Props {
  userAddress: string | undefined;
  provider: Web3Provider | undefined;
  network: Network | undefined;
}

const useUSDCBalance = (userAddress: string | undefined): [BigNumber, () => void] => {
  const [balance, setBalance] = useState<BigNumber>(Zero);

  const refreshBalance = useCallback(async (): Promise<void> => {
    if (!userAddress) {
      setBalance(Zero);
      return;
    }

    const provider = new JsonRpcProvider(MAINNET_RPC_URL);
    const usdcContract = new Contract(MAINNET_USDC_ADDRESS, IERC20.abi, provider);
    const userBalance = await usdcContract.balanceOf(userAddress);
    setBalance(userBalance);
  }, [userAddress]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  return [balance, refreshBalance];
};

const useUSDCLoan = (userAddress: string | undefined): Loan | undefined => {
  const [usdcLoan, setUsdcLoan] = useState<Loan>();

  useEffect(() => {
    const getUsdcLoan = async () => {
      if (!userAddress) return Zero;
      const vaultAddress = calculateVaultAddress(userAddress);
      const loan = await getLoan(vaultAddress, MAINNET_USDC_ADDRESS);

      setUsdcLoan(loan);
    };
    getUsdcLoan();
  }, [userAddress]);

  return usdcLoan;
};

const LoanWidget: React.FC<Props> = ({ userAddress, provider, network }) => {
  const [amount, setAmount] = useState<string>("0");
  const [balance] = useUSDCBalance(userAddress);
  const pendingWithdrawals = usePendingWithdrawals(userAddress);
  const pendingBalance = pendingWithdrawals.reduce((acc, withdrawal) => acc.add(withdrawal.amount), Zero);

  const loan = useUSDCLoan(userAddress);

  const handleBorrow = async (borrowAmount: BigNumber): Promise<void> => {
    if (!provider) return;

    const withdrawalVaultFactory = new Contract(
      WITHDRAWAL_VAULT_FACTORY_ADDRESS,
      IWithdrawalVaultFactory.abi,
      provider.getSigner(),
    );
    withdrawalVaultFactory.borrow(MAINNET_USDC_ADDRESS, borrowAmount);
  };

  return (
    <Border style={{ opacity: network?.chainId === MAINNET_CHAIN_ID ? 1 : 0.1 }}>
      <h2>Borrow</h2>
      <p> Mainnet USDC Balance: {`${formatUnits(balance, 6)} USDC`}</p>
      <p> Pending Withdrawals: {`${formatUnits(pendingBalance, 6)} USDC`}</p>
      <p> Credit Limit: {`${formatUnits(loan?.creditLimit || 0, 6)} USDC`}</p>
      <p> Amount Borrowed: {`${formatUnits(loan?.amountBorrowed || 0, 6)} USDC`}</p>
      <TextField type="number" value={amount} onChange={(event): void => setAmount(event.target.value)} />
      <Button onClick={(): Promise<void> => handleBorrow(parseUnits(amount, 6))}>Borrow</Button>
    </Border>
  );
};

export default LoanWidget;
