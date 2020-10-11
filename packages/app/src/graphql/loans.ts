import { ApolloClient, DocumentNode, gql, InMemoryCache } from "@apollo/client";
import { MaticNetworks, WithdrawalVault } from "../types";

type Response = {
  data: { withdrawalVaults: WithdrawalVault[] };
};

const subgraphUri: { [key in MaticNetworks]: string } = {
  mainnet: "https://api.thegraph.com/subgraphs/name/sablierhq/sablier",
  rinkeby: "https://api.thegraph.com/subgraphs/name/sablierhq/sablier-rinkeby",
  goerli: "https://api.thegraph.com/subgraphs/name/sablierhq/sablier-goerli",
};

const vaultQuery: DocumentNode = gql`
  query vault($owner: String!) {
    withdrawalVaults(where: { owner: $owner }) {
      id
      owner
      loans {
        id
        token
        amountBorrowed
        creditLimit
      }
    }
  }
`;

export async function getWithdrawalVault(
  userAddress: string,
): Promise<WithdrawalVault[]> {
  const client = new ApolloClient({
    uri: subgraphUri.mainnet,
    cache: new InMemoryCache(),
  });

  const res: Response = await client.query({
    query: vaultQuery,
    variables: {
      owner: userAddress,
    },
  });

  return res.data.withdrawalVaults;
}
