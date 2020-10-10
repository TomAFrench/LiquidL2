import { Address, Bytes } from '@graphprotocol/graph-ts';
import { WithdrawalVault } from '../types/schema';

function getVaultOwner(vaultAddress: Address): string {
  let vault = WithdrawalVault.bind(vaultAddress);
  let result = vault.try_borrower();

  return result.reverted ? '' : result.value;
}

export function loadWithdrawalVault(vaultAddress: Address): WithdrawalVault {
  let withdrawalVault = WithdrawalVault.load(vaultAddress.toHexString());
  if (withdrawalVault == null) {
    withdrawalVault = new WithdrawalVault(vaultAddress.toHexString());
    withdrawalVault.owner = Bytes.fromHexString(getVaultOwner(vaultAddress));
  }
  return withdrawalVault;
}
