import React, { useCallback, useEffect, useState } from "react";
import { Network, Web3Provider } from "@ethersproject/providers";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { TextField } from "@material-ui/core";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { randomBytes } from "@ethersproject/random";
import { hexlify, splitSignature } from "@ethersproject/bytes";
import { Contract } from "@ethersproject/contracts";
import { Zero } from "@ethersproject/constants";
import { getCreate2Address, keccak256, solidityKeccak256 } from "ethers/lib/utils";
import { defaultAbiCoder } from "@ethersproject/abi";
import { Border, Button } from "../common";
import WithdrawalVault from "../../abis/WithdrawalVault.json";
import IWithdrawalVaultFactory from "../../abis/IWithdrawalVaultFactory.json";
import IERC20 from "../../abis/IERC20.json";

import { MATIC_CHAIN_ID, MATIC_USDC_ADDRESS, WITHDRAWAL_VAULT_FACTORY_ADDRESS } from "../../utils/constants";

interface Props {
  provider: Web3Provider | undefined;
  network: Network | undefined;
}

const eip3009SignatureData = (
  tokenName: string,
  tokenVersion: string,
  selectedChainId: number,
  tokenAddress: string,
  userAddress: string,
  recipientAddress: string,
  amount: BigNumberish,
  validAfter: number,
  validBefore: number,
  nonce: string,
): {} => ({
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "verifyingContract", type: "address" },
      { name: "salt", type: "bytes32" },
    ],
    TransferWithAuthorization: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
    ],
  },
  domain: {
    name: tokenName,
    version: tokenVersion,
    verifyingContract: tokenAddress,
    salt: typeof selectedChainId === "number" ? `0x${selectedChainId.toString(16).padStart(64, "0")}` : selectedChainId,
  },
  primaryType: "TransferWithAuthorization",
  message: {
    from: userAddress,
    to: recipientAddress,
    value: amount.toString(),
    validAfter,
    validBefore,
    nonce,
  },
});

const calculateVaultAddress = (userAddress: string): string => {
  const abiEncodedAddress = defaultAbiCoder.encode(["address"], [userAddress]);
  const vaultAddress = getCreate2Address(
    WITHDRAWAL_VAULT_FACTORY_ADDRESS,
    keccak256(abiEncodedAddress),
    solidityKeccak256(["bytes", "address"], [WithdrawalVault.bytecode, abiEncodedAddress]),
  );
  return vaultAddress;
};

const useUSDCBalance = (provider: Web3Provider | undefined): [BigNumber, () => void] => {
  const [balance, setBalance] = useState<BigNumber>(Zero);

  const refreshBalance = useCallback(async (): Promise<void> => {
    if (!provider) {
      setBalance(Zero);
      return;
    }

    const userAddress = await provider.getSigner().getAddress();
    const usdcContract = new Contract(MATIC_USDC_ADDRESS, IERC20.abi, provider);
    const userBalance = await usdcContract.balanceOf(userAddress);
    setBalance(userBalance);
  }, [provider]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  return [balance, refreshBalance];
};

const BurnWidget: React.FC<Props> = ({ provider, network }) => {
  const [balance] = useUSDCBalance(provider);
  const [amount, setAmount] = useState<string>("0");

  const handleExit = async (withdrawalAmount: BigNumber): Promise<void> => {
    if (!provider) return;

    const userAddress = await provider.getSigner().getAddress();
    const vaultAddress = calculateVaultAddress(userAddress);

    console.log("vaultAddress", vaultAddress);
    const authorisationStart = 0;
    const authorisationExpiry = Math.floor(Date.now() / 1000) + 3600; // Valid for an hour
    const nonce = hexlify(randomBytes(32));
    const signature = await provider.send("eth_signTypedData_v4", [
      userAddress,
      JSON.stringify(
        eip3009SignatureData(
          "Mumbai USD Coin",
          "2",
          MATIC_CHAIN_ID,
          MATIC_USDC_ADDRESS,
          userAddress,
          vaultAddress,
          withdrawalAmount,
          authorisationStart,
          authorisationExpiry,
          nonce,
        ),
      ),
    ]);

    const { v, r, s } = splitSignature(signature);

    const withdrawalVaultFactory = new Contract(
      WITHDRAWAL_VAULT_FACTORY_ADDRESS,
      IWithdrawalVaultFactory.abi,
      await provider.getSigner(),
    );

    const res = await withdrawalVaultFactory.exitFundsWithAuthorization(
      MATIC_USDC_ADDRESS,
      withdrawalAmount,
      authorisationStart,
      authorisationExpiry,
      nonce,
      v,
      r,
      s,
    );

    console.log("res", res);
  };

  return (
    <Border style={{ opacity: network?.chainId === MATIC_CHAIN_ID ? 1 : 0.1 }}>
      <p> Matic USDC Balance: {`${formatUnits(balance, 6)} USDC`}</p>
      <TextField type="number" value={amount} onChange={(event): void => setAmount(event.target.value)} />
      <Button
        disabled={network?.chainId !== MATIC_CHAIN_ID}
        onClick={(): Promise<void> => handleExit(parseUnits(amount, 6))}
      >
        Withdraw
      </Button>
    </Border>
  );
};

export default BurnWidget;
