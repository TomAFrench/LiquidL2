import React, { useState } from "react";
import { Network, Web3Provider } from "@ethersproject/providers";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { TextField } from "@material-ui/core";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { Border, Button } from "../common";
import IWithdrawalVaultFactory from "../../abis/IWithdrawalVaultFactory.json";
import { MAINNET_CHAIN_ID, MAINNET_USDC_ADDRESS, WITHDRAWAL_VAULT_FACTORY_ADDRESS } from "../../utils/constants";

interface Props {
  provider: Web3Provider | undefined;
  network: Network | undefined;
}

const LoanWidget: React.FC<Props> = ({ provider, network }) => {
  const [amount, setAmount] = useState<string>("0");

  const handleBorrow = async (borrowAmount: BigNumber): Promise<void> => {
    if (!provider) return;

    const withdrawalVaultFactory = new Contract(
      WITHDRAWAL_VAULT_FACTORY_ADDRESS,
      IWithdrawalVaultFactory.abi,
      provider.getSigner(),
    );
    withdrawalVaultFactory.exitFundsWithAuthorization(MAINNET_USDC_ADDRESS, borrowAmount);
  };

  return (
    <Border style={{ opacity: network?.chainId === MAINNET_CHAIN_ID ? 1 : 0.1 }}>
      <p> Pending Withdrawals: {`${formatUnits(100000000, 6)} USDC`}</p>
      <p> Credit Limit: {`${formatUnits(100000000, 6)} USDC`}</p>
      <p> Amount Borrowed: {`${formatUnits(50000000, 6)} USDC`}</p>
      <TextField type="number" value={amount} onChange={(event): void => setAmount(event.target.value)} />
      <Button onClick={(): Promise<void> => handleBorrow(parseUnits(amount, 6))}>Borrow</Button>
    </Border>
  );
};

export default LoanWidget;
