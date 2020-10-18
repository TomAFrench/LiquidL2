import { Address, Bytes } from '@graphprotocol/graph-ts';
import { WithdrawalVault as WithdrawalVaultTemplate } from '../types/templates/WithdrawalVault/WithdrawalVault';
import { WithdrawalVault } from '../types/schema';

function getVaultOwner(vaultAddress: Address): Address {
  let vault = WithdrawalVaultTemplate.bind(vaultAddress);
  let result = vault.try_borrower();

  return result.reverted
    ? (Address.fromHexString(
        '0x0000000000000000000000000000000000000000',
      ) as Address)
    : result.value;
}

export function loadWithdrawalVault(vaultAddress: Address): WithdrawalVault {
  let withdrawalVault = WithdrawalVault.load(vaultAddress.toHexString());
  if (withdrawalVault == null) {
    withdrawalVault = new WithdrawalVault(vaultAddress.toHexString());
    withdrawalVault.owner = getVaultOwner(vaultAddress);
    withdrawalVault.save();
  }
  return withdrawalVault as WithdrawalVault;
}
