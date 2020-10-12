import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Contract } from "@ethersproject/contracts";
import { InfuraProvider } from "@ethersproject/providers";
import { parseEther } from "@ethersproject/units";
import { BigNumberInput } from "big-number-input";
import { Button, Select, Text, TextField, Loader } from "@gnosis.pm/safe-react-components";

import erc20Abi from "../../abis/erc20";

import { ButtonContainer, SelectContainer, TextFieldContainer } from "../index";
import { TokenItem, getTokenList } from "../../config/tokens";
import { bigNumberToHumanFormat } from "../../utils";

import { useSafeNetwork, useSendTransactions, useSafeEthBalance, useSafeAddress } from "../../contexts/SafeContext";
import { MaticNetworks } from "../../types";

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-top: 16px;
  max-width: 500px;
`;

function CollateralForm(): ReactElement {
  const safeAddress = useSafeAddress();
  const network = useSafeNetwork();
  const ethBalance = useSafeEthBalance();
  const sendTransactions = useSendTransactions();
  /** State Variables **/

  const [amountError, setAmountError] = useState<string | undefined>();
  const [selectedToken, setSelectedToken] = useState<TokenItem>();
  const [streamAmount, setStreamAmount] = useState<string>("");
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [tokenInstance, setTokenInstance] = useState<Contract>();
  const [tokenList, setTokenList] = useState<TokenItem[]>();

  /** Callbacks **/

  const humanTokenBalance = useCallback((): string => {
    return selectedToken ? bigNumberToHumanFormat(tokenBalance, selectedToken.decimals) : "";
  }, [selectedToken, tokenBalance]);

  // const validateAmountValue = useCallback((): boolean => {
  //   setAmountError(undefined);

  //   const currentValueBN: BigNumber = BigNumber.from(streamAmount);
  //   const comparisonValueBN: BigNumber = BigNumber.from(tokenBalance);

  //   if (currentValueBN.gt(comparisonValueBN)) {
  //     setAmountError(`You only have ${humanTokenBalance()} ${selectedToken && selectedToken.label} in your Safe`);
  //     return false;
  //   }

  //   return true;
  // }, [humanTokenBalance, selectedToken, streamAmount, tokenBalance]);

  const isButtonDisabled = useMemo(
    (): boolean => streamAmount.length === 0 || streamAmount === "0" || typeof amountError !== "undefined",
    [amountError, streamAmount],
  );

  const onSelectItem = useCallback(
    (id: string): void => {
      if (!tokenList) {
        return;
      }
      const newSelectedToken = tokenList.find(t => {
        return t.id === id;
      });
      if (!newSelectedToken) {
        return;
      }
      setSelectedToken(newSelectedToken);
    },
    [setSelectedToken, tokenList],
  );

  const onAmountChange = useCallback((value: string): void => {
    setAmountError(undefined);
    setStreamAmount(value);
  }, []);

  /** Side Effects **/

  /* Load tokens list and initialize with DAI */
  useEffect(() => {
    if (!network) {
      return;
    }

    const tokenListRes: TokenItem[] = getTokenList(network.toLowerCase() as MaticNetworks);

    setTokenList(tokenListRes);

    const findDaiRes: TokenItem | undefined = tokenListRes.find(t => {
      return t.id === "DAI";
    });
    setSelectedToken(findDaiRes);
  }, [network]);

  /* Clear the form every time the user changes the token */
  useEffect(() => {
    if (!network || !selectedToken) {
      return;
    }

    setTokenBalance("0");
    setStreamAmount("");
    setAmountError(undefined);

    const provider = new InfuraProvider(network, process.env.REACT_APP_INFURA_KEY);
    setTokenInstance(new Contract(selectedToken.address, erc20Abi, provider));
  }, [network, selectedToken, setTokenBalance]);

  useEffect(() => {
    const getData = async () => {
      if (!safeAddress || !ethBalance || !selectedToken || !tokenInstance) {
        return;
      }

      /* Wait until token is correctly updated */
      if (selectedToken?.address.toLocaleLowerCase() !== tokenInstance?.address.toLocaleLowerCase()) {
        return;
      }

      /* Get token Balance */
      let newTokenBalance: string;
      if (selectedToken.id === "ETH") {
        newTokenBalance = parseEther(ethBalance).toString();
      } else {
        newTokenBalance = await tokenInstance.balanceOf(safeAddress);
      }

      /* Update all the values in a row to avoid UI flickers */
      setTokenBalance(newTokenBalance);
    };

    getData();
  }, [ethBalance, safeAddress, selectedToken, setTokenBalance, tokenInstance]);

  if (!selectedToken) {
    return <Loader size="md" />;
  }

  return (
    <Wrapper>
      <Text size="lg">What token do you want to use?</Text>

      <SelectContainer>
        <Select items={tokenList || []} activeItemId={selectedToken.id} onItemClick={onSelectItem} />
        <Text size="lg">{humanTokenBalance()}</Text>
      </SelectContainer>

      <Text size="lg">How much do you want to deposit/withdraw?</Text>
      <TextFieldContainer>
        <BigNumberInput
          decimals={selectedToken.decimals}
          onChange={onAmountChange}
          value={streamAmount}
          renderInput={(props: any) => (
            <TextField label="Amount" value={props.value} onChange={props.onChange} meta={{ error: amountError }} />
          )}
        />
      </TextFieldContainer>

      <ButtonContainer>
        <Button
          size="lg"
          color="primary"
          variant="contained"
          onClick={() => console.log("Click")}
          disabled={isButtonDisabled}
        >
          Deposit
        </Button>
        <Button
          size="lg"
          color="secondary"
          variant="contained"
          onClick={() => console.log("Click")}
          disabled={isButtonDisabled}
        >
          Withdraw
        </Button>
      </ButtonContainer>
    </Wrapper>
  );
}

export default CollateralForm;
