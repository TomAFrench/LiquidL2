import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Network, Provider, Web3Provider } from "@ethersproject/providers";

import styled from "styled-components";
import { Body, Button, Header, Image } from "../components/common";
import { web3Modal, logoutOfWeb3Modal } from "../utils/web3Modal";
import logo from "../ethereumLogo.png";
import BurnWidget from "../components/BurnWidget";
import LoanWidget from "../components/LoanWidget";
import RepayWidget from "../components/RepayWidget";

export const Widgets = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

function WalletButton({
  provider,
  loadWeb3Modal,
}: {
  provider: Provider | undefined;
  loadWeb3Modal: Function;
}): ReactElement {
  return (
    <Button
      onClick={(): void => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

const HomePage: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string>();
  const [provider, setProvider] = useState<Web3Provider>();
  const [network, setNetwork] = useState<Network>();

  /* Open wallet selection modal. */
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    setProvider(new Web3Provider(newProvider));
  }, []);

  /* If user has loaded a wallet before, load it automatically. */
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  useEffect(() => {
    const getNetwork = async () => {
      if (provider) setNetwork(await provider.getNetwork());
    };
    getNetwork();
  }, [provider]);

  useEffect(() => {
    const getUserAddress = async () => {
      if (provider) setUserAddress(await provider.getSigner().getAddress());
    };
    getUserAddress();
  }, [provider]);

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} />
      </Header>
      <Body>
        <Image src={logo} alt="react-logo" />
        <h2>LiquidL2</h2>
        <Widgets>
          <BurnWidget userAddress={userAddress} provider={provider} network={network} />
          <LoanWidget userAddress={userAddress} provider={provider} network={network} />
          <RepayWidget userAddress={userAddress} provider={provider} network={network} />
        </Widgets>
      </Body>
    </div>
  );
};

export default HomePage;
