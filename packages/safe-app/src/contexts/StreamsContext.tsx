import React, { useState, createContext, ReactElement, useContext, useEffect, useCallback } from "react";

import { ProxyStream } from "../types";
import { useSafeAddress, useSafeNetwork } from "./SafeContext";
import { getIncomingStreams } from "../graphql/proxyStreams";

interface Props {
  children: ReactElement | ReactElement[];
}

interface State {
  incomingProxyStreams: ProxyStream[];
}

export const StreamsContext = createContext({} as State);

export function useStreamsContext(): State {
  return useContext(StreamsContext);
}

function StreamsProvider({ children }: Props) {
  const safeAddress = useSafeAddress();
  const network = useSafeNetwork();

  /** State Variables **/
  const [incomingProxyStreams, setIncomingProxyStreams] = useState<ProxyStream[]>([]);

  const refreshStreams = useCallback(async () => {
    if (!network || !safeAddress) {
      return;
    }

    const newIncomingProxyStreams = await getIncomingStreams(network, safeAddress);
    setIncomingProxyStreams(newIncomingProxyStreams);
  }, [network, safeAddress]);

  useEffect(() => {
    refreshStreams();
    const intervalId = setInterval(refreshStreams, 10 * 1000);
    return () => clearInterval(intervalId);
  }, [refreshStreams]);

  return <StreamsContext.Provider value={{ incomingProxyStreams }}>{children}</StreamsContext.Provider>;
}

export const useIncomingStreams = (): ProxyStream[] => {
  const { incomingProxyStreams } = useStreamsContext();
  return incomingProxyStreams;
};

export default StreamsProvider;
