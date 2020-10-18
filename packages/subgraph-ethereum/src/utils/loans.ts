import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Loan } from '../types/schema';
import { loadWithdrawalVault } from './withdrawalVault';

export function loadLoan(vaultAddress: Address, assetAddress: Address): Loan {
  let loanId = vaultAddress.toHexString() + assetAddress.toHexString();
  let loan = Loan.load(loanId);
  if (loan == null) {
    // If this is the first loan to this address we need to initialise the vault
    loadWithdrawalVault(vaultAddress);

    loan = new Loan(loanId);
    loan.vault = vaultAddress.toHexString();
    loan.token = assetAddress;
    loan.amountBorrowed = BigInt.fromI32(0);
    loan.creditLimit = BigInt.fromI32(0);
  }
  return loan as Loan;
}
