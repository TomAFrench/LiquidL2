import { ApolloClient, DocumentNode, gql, InMemoryCache } from "@apollo/client";
import { Withdrawal } from "../types";

type Response = {
  data: { withdrawals: Withdrawal[] };
};

const subgraphUri = "https://api.mumbai-graph.matic.today/subgraphs/name/tomafrench/delegated-withdrawals-mumbai";

const paginatedWithdrawalsQuery: DocumentNode = gql`
  query withdrawals($first: Int!, $skip: Int!, $user: String!) {
    withdrawals(first: $first, skip: $skip, where: { user: $user }) {
      id
      user
      amount
      childToken
    }
  }
`;

async function getPaginatedWithdrawals(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: ApolloClient<any>,
  first: number,
  vaultAddress: string,
  skip: number,
): Promise<Response> {
  return client.query({
    query: paginatedWithdrawalsQuery,
    variables: {
      first,
      skip,
      user: vaultAddress,
    },
  });
}

export async function getWithdrawals(vaultAddress: string): Promise<Withdrawal[]> {
  const client = new ApolloClient({
    uri: subgraphUri,
    cache: new InMemoryCache(),
  });

  let ended = false;
  const first = 1000;
  let skip = 0;
  let withdrawals: Withdrawal[] = [];

  while (!ended) {
    try {
      /* eslint-disable-next-line no-await-in-loop */
      const res: Response = await getPaginatedWithdrawals(client, first, vaultAddress, skip);
      skip += first;

      withdrawals = [...withdrawals, ...res.data.withdrawals];
      if (res.data.withdrawals.length < first) {
        ended = true;
      }
    } catch (error) {
      ended = true;
      throw error;
    }
  }

  return withdrawals;
}
