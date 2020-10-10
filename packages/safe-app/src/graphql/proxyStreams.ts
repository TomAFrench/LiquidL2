import ApolloClient, { DocumentNode, gql } from "apollo-boost";

import { ProxyStream, MaticNetworks } from "../types";

type Response = {
  data: { proxyStreams: ProxyStream[] };
};

const subgraphUri: { [key in MaticNetworks]: string } = {
  mainnet: "https://api.thegraph.com/subgraphs/name/sablierhq/sablier",
  rinkeby: "https://api.thegraph.com/subgraphs/name/sablierhq/sablier-rinkeby",
  goerli: "https://api.thegraph.com/subgraphs/name/sablierhq/sablier-goerli",
};

const streamQuery: string = `
  stream {
    id
    cancellation {
      id
      txhash
      timestamp
    }
    deposit
    startTime
    stopTime
    recipient
    sender
    token {
      id
      decimals
      symbol
    }
    withdrawals {
      amount
    }
  }
`;

const paginatedIncomingStreamsQuery: DocumentNode = gql`
  query proxyStreams($first: Int!, $skip: Int!, $recipient: String!) {
    proxyStreams(first: $first, skip: $skip, where: { recipient: $recipient }) {
      id
      sender
      recipient
      ${streamQuery}
    }
  }
`;

async function getPaginatedIncomingStreams(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  client: ApolloClient<any>,
  first: number,
  safeAddress: string,
  skip: number,
): Promise<Response> {
  return client.query({
    query: paginatedIncomingStreamsQuery,
    variables: {
      first,
      skip,
      recipient: safeAddress,
    },
  });
}

async function getProxyStreams(
  query: (client: ApolloClient<any>, first: number, safeAddress: string, skip: number) => Promise<Response>,
  network: MaticNetworks,
  safeAddress: string,
): Promise<ProxyStream[]> {
  const client = new ApolloClient({
    uri: subgraphUri[network],
  });

  let ended: boolean = false;
  const first: number = 1000;
  let skip: number = 0;
  let proxyStreams: ProxyStream[] = [];

  while (!ended) {
    try {
      /* eslint-disable-next-line no-await-in-loop */
      const res: Response = await query(client, first, safeAddress, skip);
      skip += first;

      proxyStreams = [...proxyStreams, ...res.data.proxyStreams];
      if (res.data.proxyStreams.length < first) {
        ended = true;
      }
    } catch (error) {
      ended = true;
      throw error;
    }
  }

  return proxyStreams;
}

export const getIncomingStreams = (network: MaticNetworks, safeAddress: string) =>
  getProxyStreams(getPaginatedIncomingStreams, network, safeAddress);
