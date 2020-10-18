import {
  Borrow,
  GiveLoan,
  RepayLoan,
} from '../types/WithdrawalVaultFactory/WithdrawalVaultFactory';
import { loadLoan } from '../utils/loans';

export function handleGiveLoan(event: GiveLoan): void {
  let loan = loadLoan(event.params.vault, event.params.token);
  loan.creditLimit = loan.creditLimit.plus(event.params.amount);
  loan.save();
}

export function handleBorrow(event: Borrow): void {
  let loan = loadLoan(event.params.vault, event.params.token);
  loan.amountBorrowed = loan.amountBorrowed.plus(event.params.amount);
  loan.save();
}

export function handleRepayLoan(event: RepayLoan): void {
  let loan = loadLoan(event.params.vault, event.params.token);
  loan.amountBorrowed = loan.amountBorrowed.minus(event.params.loanRepayment);
  loan.creditLimit = loan.creditLimit.minus(event.params.withdrawalAmount);
  loan.save();
}
