import { Address } from '@graphprotocol/graph-ts';
import { Token, Withdrawal } from '../types/schema';
import { TokenMapped } from '../types/ChildChainManager/ChildChainManager';
import { ChildToken } from '../types/templates';
import { Transfer } from '../types/ChildChainManager/ChildToken';

function getTokenName(childTokenAddress: Address): string {
  let collateralToken = ChildToken.bind(childTokenAddress);
  let result = collateralToken.try_name();

  return result.reverted ? '' : result.value;
}

function getTokenSymbol(childTokenAddress: Address): string {
  let collateralToken = ChildToken.bind(childTokenAddress);
  let result = collateralToken.try_symbol();

  return result.reverted ? '' : result.value;
}

function getTokenDecimals(childTokenAddress: Address): BigInt {
  let collateralToken = ChildToken.bind(childTokenAddress);
  let result = collateralToken.try_decimals();

  return result.reverted ? 0 : result.value;
}

export function handleTokenMapped(event: TokenMapped): void {
  let childToken = new Token(event.params.childToken.toHexString());
  childToken.name = getTokenName(event.params.childToken);
  childToken.symbol = getTokenSymbol(event.params.childToken);
  childToken.decimals = getTokenDecimals(event.params.childToken);
  childToken.rootToken = event.params.rootToken;
  childToken.save();

  ChildToken.create(event.params.childToken);
}

export function handleTokenWithdrawal(event: Transfer): void {
  let withdrawal = new Withdrawal(event.transaction.hash.toHexString());
  withdrawal.user = event.params.from;
  withdrawal.amount = event.params.value;
  withdrawal.childToken = event.address.toHexString();
  withdrawal.save();
}
