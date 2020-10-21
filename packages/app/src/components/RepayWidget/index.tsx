import React from "react";
import { JsonRpcProvider, Network, Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import { Contract } from "@ethersproject/contracts";
import { buildPayloadForExit, encodePayload } from "@tomfrench/matic-proofs";
import { Border, Button } from "../common";
import IWithdrawalVaultFactory from "../../abis/IWithdrawalVaultFactory.json";
import {
  MAINNET_CHAIN_ID,
  MAINNET_RPC_URL,
  MAINNET_USDC_ADDRESS,
  MATIC_RPC_URL,
  WITHDRAWAL_VAULT_FACTORY_ADDRESS,
} from "../../utils/constants";
import usePendingWithdrawals from "../../hooks/usePendingWithdrawals";

interface Props {
  userAddress: string | undefined;
  provider: Web3Provider | undefined;
  network: Network | undefined;
}

const RepayWidget: React.FC<Props> = ({ userAddress, provider, network }) => {
  const pendingWithdrawals = usePendingWithdrawals(userAddress);

  const handleRepay = async (burnHash: string): Promise<void> => {
    if (!provider || !userAddress) return;

    const ROOT_CHAIN_MANAGER_ADDRESS = "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74";
    const ERC20_TRANSFER_EVENT_SIG = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
    const exitPayload = await buildPayloadForExit(
      new JsonRpcProvider(MAINNET_RPC_URL),
      new JsonRpcProvider(MATIC_RPC_URL),
      ROOT_CHAIN_MANAGER_ADDRESS,
      burnHash,
      ERC20_TRANSFER_EVENT_SIG,
    );
    const withdrawalProof = encodePayload(exitPayload);

    const withdrawalVaultFactory = new Contract(
      WITHDRAWAL_VAULT_FACTORY_ADDRESS,
      IWithdrawalVaultFactory.abi,
      provider.getSigner(),
    );
    withdrawalVaultFactory.repayLoan(userAddress, MAINNET_USDC_ADDRESS, withdrawalProof);
  };

  return (
    <Border style={{ opacity: network?.chainId === MAINNET_CHAIN_ID ? 1 : 0.1 }}>
      <h2>Repay</h2>
      {pendingWithdrawals.length === 0 ? (
        <p>No pending withdrawals</p>
      ) : (
        pendingWithdrawals.map(pendingWithdrawal => (
          <>
            <div>
              {`Withdrawal: ${pendingWithdrawal.id.slice(0, 6)} - Amount: ${formatUnits(
                pendingWithdrawal.amount,
                6,
              )} USDC`}
              <Button onClick={(): Promise<void> => handleRepay(pendingWithdrawal.id)}>Repay</Button>
            </div>
          </>
        ))
      )}
    </Border>
  );
};

export default RepayWidget;
