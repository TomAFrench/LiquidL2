import React, { useState } from "react";
import { AddressZero } from "@ethersproject/constants";
import { Network, Web3Provider } from "@ethersproject/providers";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { TextField } from "@material-ui/core";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { randomBytes } from "@ethersproject/random";
import { hexlify, splitSignature } from "@ethersproject/bytes";
import { Border, Button } from "../common";

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
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
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
    chainId: selectedChainId,
    verifyingContract: tokenAddress,
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

const BurnWidget: React.FC<Props> = ({ provider, network }) => {
  const [amount, setAmount] = useState<string>("0");

  const handleExit = async (withdrawalAmount: BigNumber): Promise<void> => {
    if (!provider) return;

    const userAddress = await provider.getSigner().getAddress();
    const usdcAddress = AddressZero;
    const withdrawalVaultFactoryAddress = AddressZero;
    const authorisationExpiry = Math.floor(Date.now() / 1000) + 3600; // Valid for an hour
    const nonce = hexlify(randomBytes(32));
    const signature = await provider.send("eth_signTypedData_v4", [
      userAddress,
      JSON.stringify(
        eip3009SignatureData(
          "USDC",
          "1",
          137,
          usdcAddress,
          userAddress,
          withdrawalVaultFactoryAddress,
          withdrawalAmount,
          0,
          authorisationExpiry,
          nonce,
        ),
      ),
    ]);

    const { v, r, s } = splitSignature(signature);

    console.table({ v, r, s });

    // const withdrawalVaultFactory = IWithdrawalVaultFactoryFactory.connect(
    //   withdrawalVaultFactoryAddress,
    //   provider,
    // );
    // withdrawalVaultFactory.exitFundsWithAuthorization(
    // usdcAddress,
    // amount,
    // 0,
    // authorisationExpiry,
    // nonce,
    // v,
    //  r,
    //  s
    // )
  };

  return (
    <Border style={{ opacity: network?.chainId === 137 ? 1 : 0.1 }}>
      <p> Matic USDC Balance: {`${formatUnits(100000000, 6)} USDC`}</p>
      <TextField
        type="number"
        value={amount}
        onChange={(event): void => setAmount(event.target.value)}
      />
      <Button
        disabled={network?.chainId !== 137}
        onClick={(): Promise<void> => handleExit(parseUnits(amount, 6))}
      >
        Withdraw
      </Button>
    </Border>
  );
};

export default BurnWidget;
