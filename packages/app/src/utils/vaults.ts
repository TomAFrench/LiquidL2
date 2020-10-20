import { getCreate2Address } from "@ethersproject/address";
import { keccak256 } from "@ethersproject/keccak256";
import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import { defaultAbiCoder } from "@ethersproject/abi";
import WithdrawalVault from "../abis/WithdrawalVault.json";
import { WITHDRAWAL_VAULT_FACTORY_ADDRESS } from "./constants";

export const calculateVaultAddress = (userAddress: string): string => {
  const abiEncodedAddress = defaultAbiCoder.encode(["address"], [userAddress]);
  const vaultAddress = getCreate2Address(
    WITHDRAWAL_VAULT_FACTORY_ADDRESS,
    keccak256(abiEncodedAddress),
    solidityKeccak256(["bytes", "address"], [WithdrawalVault.bytecode, abiEncodedAddress]),
  );
  return vaultAddress;
};
