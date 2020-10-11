import { BigNumberish } from "@ethersproject/bignumber";

export const maticNetworks = ["mainnet", "rinkeby", "goerli"] as const;
export type MaticNetworks = typeof maticNetworks[number];

export type Token = {
  id: string;
  decimals: number;
  name: string;
  symbol: string;
  rootToken?: string;
};

export type Withdrawal = {
  id: string;
  user: string;
  amount: BigNumberish;
  childToken: Token;
};

export type Loan = {
  id: string;
  token: string;
  amountBorrowed: BigNumberish;
  creditLimit: BigNumberish;
};

export type WithdrawalVault = {
  id: string;
  owner: string;
  loans: Loan[];
};
