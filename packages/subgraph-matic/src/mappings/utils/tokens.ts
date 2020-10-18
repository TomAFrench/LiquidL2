import { Address } from '@graphprotocol/graph-ts';
import { ChildToken } from '../../types/ChildChainManager/ChildToken';

export function getTokenName(childTokenAddress: Address): string {
  let collateralToken = ChildToken.bind(childTokenAddress);
  let result = collateralToken.try_name();

  return result.reverted ? '' : result.value;
}

export function getTokenSymbol(childTokenAddress: Address): string {
  let collateralToken = ChildToken.bind(childTokenAddress);
  let result = collateralToken.try_symbol();

  return result.reverted ? '' : result.value;
}

export function getTokenDecimals(childTokenAddress: Address): i32 {
  let collateralToken = ChildToken.bind(childTokenAddress);
  let result = collateralToken.try_decimals();

  return result.reverted ? 0 : result.value;
}
