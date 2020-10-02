# Delegated Withdrawals

## Motivation

Onboarding and offboarding user funds is one of the main hurdles for products building on layer 2 solutions. As an example, withdrawals from Matic include a 30 minute wait period before funds are available on Ethereum. This problem is felt more strongly on optimistic rollups (often with a 7 day challenge period).

Delegated Withdrawals is an incentivisation mechanism for lenders to delegate credit to users withdrawing funds from layer 2 collateralised by the expected income once their funds are available.

## Withdrawals from Matic

For this proof of concept, we shall be targetting withdrawals from the Matic sidechain. Withdrawing funds from Matic requires two transactions, one on each side of the bridge.

1. An address must burn their funds on Matic using the `withdraw` function, emitting a `Transfer` event.
2. The header of the block containing this burn transaction is eventually included in a checkpoint onto the Ethereum mainnet.
3. The same address which burned the funds must then call `exit` on the Matic `RootChainManager` contract on mainnet, providing merkle proofs of the `Transfer` event corresponding to the burned funds being included in the checkpoint.
4. The equivalent funds are then sent the withdrawer.

## User flow

### Withdrawal initiation

A `WithdrawalVaultFactory` contract is deployed to both Mainnet and Matic on the same address. `create2` is used such that the address of a vault for a given user is deterministic across chains.

A user on the Matic chain calls `burn` on the `WithdrawalVaultFactory`. This will transfer the selected amount of tokens to the user's `WithdrawalVault` and burn them.

The `WithdrawalVaultFactory` will emit an event alerting lenders to the fact that a new request for a loan has been made.

### Loan Provision

As the funds were burned while they were in the `WithdrawalVault`, they can only be claimed on mainnet into the `WithdrawalVault`. A lender may then delegate credit to this vault for the user to withdraw on the understanding that they will be repaid using the funds available once the withdrawal is confirmed.

### Loan Repayment

Once the block containing the burn transaction has been checkpointed and the funds are available to be claimed, anyone may call the `repayLoan` function on the `WithdrawalVault` to withdraw the funds from the `RootChainManager` and repay the loan while reducing the vault's credit limit. Any excess funds will be sent to the vault's owner.

## Protocol Risks

### Risks to Lender

Lenders take on the risk that they may extend a loan which is backed by a withdrawal which hasn't been confirmed and may be subject to reversal, in this situation they will lose the lent funds.

Lenders can mitigate this risk by two methods:

1. Lenders can wait a portion of the challenge period before extending a loan. i.e. a withdrawal which has reached day 5 out of a 7 day challenge period is much less risky than one on day 1.
2. Lenders can also take part in the validation of the layer 2 solutions for which they provide services. i.e. a lender should monitor any checkpoints are not fraudulent before extending loans to the contained withdrawals.

Once the withdrawn funds are made available on layer 1, the lender is guaranteed that their funds will be repaid as this may be enforced by the `WithdrawalVault`.

### Risks to Borrower

The only risk which is taken on by the borrower is that it is not guaranteed that any loan will be provided to them. Beyond the additional gas costs, this is equivalent to a normal withdrawal.

## Future improvements

There are a number of shortcuts necessary the time constraints of ETHOnline:

- There's a very basic model of interest for the the loans.
- Currently a single entity must back all loans given out by the platform. Ideally funds from multiple liquidity providers may be used such that they are still protected from bad debts.
