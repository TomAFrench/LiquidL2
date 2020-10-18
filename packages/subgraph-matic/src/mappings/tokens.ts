import { Token, Withdrawal } from '../types/schema';
import { TokenMapped } from '../types/ChildChainManager/ChildChainManager';
import { ChildToken } from '../types/templates';
import { Transfer } from '../types/ChildChainManager/ChildToken';
import { getTokenDecimals, getTokenName, getTokenSymbol } from './utils/tokens';

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
  withdrawal.timestamp = event.block.timestamp;
  withdrawal.save();
}
