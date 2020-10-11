import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Provider, Web3Provider } from "@ethersproject/providers";

import { Body, Button, Header, Image } from "../components";
import { web3Modal, logoutOfWeb3Modal } from "../utils/web3Modal";
import logo from "../ethereumLogo.png";

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
  const [provider, setProvider] = useState<Web3Provider>();

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

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} />
      </Header>
      <Body>
        <Image src={logo} alt="react-logo" />
        <p>
          Edit <code>packages/app/src/App.tsx</code> and save to reload.
        </p>
      </Body>
    </div>
  );
};

export default HomePage;
