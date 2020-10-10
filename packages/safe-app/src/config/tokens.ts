import usdcIcon from "../assets/tokens/usdc.svg";
import { MaticNetworks } from "../types";

export type TokenItem = {
  address: string;
  decimals: number;
  id: string;
  iconUrl: string;
  label: string;
};

export type TokenMap = { [key in MaticNetworks]: { [name: string]: string } };

const tokens: TokenMap = {
  mainnet: {
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  rinkeby: {
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  goerli: {
    ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    DAI: "0xF2D1F94310823FE26cFa9c9B6fD152834b8E7849",
    WETH: "0xef03ef2d709c2e9cc40d72f72eb357928f34acd5",
  },
};

export const getTokenList = (network: MaticNetworks): TokenItem[] => {
  const tokensByNetwork: { [name: string]: string } = tokens[network];
  if (!tokensByNetwork) {
    throw Error(`No token configuration for ${network}`);
  }

  const tokenList: TokenItem[] = [
    {
      address: tokensByNetwork.USDC,
      decimals: 6,
      iconUrl: usdcIcon,
      id: "USDC",
      label: "USDC",
    },
  ];
  return tokenList.filter(token => token.address !== undefined);
};

export default tokens;
