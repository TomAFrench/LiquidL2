import { ApolloClient, DocumentNode, gql, InMemoryCache } from "@apollo/client";
import { Loan } from "../types";

type Response = {
  data: { loan: Loan };
};

const subgraphUri = "https://api.thegraph.com/subgraphs/name/tomafrench/delegated-withdrawals-goerli";

const loanQuery: DocumentNode = gql`
  query loan($loan: String!) {
    loan(id: $loan) {
      id
      token
      amountBorrowed
      creditLimit
    }
  }
`;

export async function getLoan(vaultAddress: string, tokenAddress: string): Promise<Loan> {
  const client = new ApolloClient({
    uri: subgraphUri,
    cache: new InMemoryCache(),
  });

  const res: Response = await client.query({
    query: loanQuery,
    variables: {
      loan: vaultAddress.toLowerCase() + tokenAddress.toLowerCase(),
    },
  });

  return res.data.loan;
}
