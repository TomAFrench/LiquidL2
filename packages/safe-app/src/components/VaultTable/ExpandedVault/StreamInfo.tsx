import React, { ReactElement, useMemo } from "react";
import { Text } from "@gnosis.pm/safe-react-components";
import styled from "styled-components";

import { getAddress } from "@ethersproject/address";
import { Networks } from "@gnosis.pm/safe-apps-sdk";
import { ProxyStream } from "../../../types";
import useRefreshwithPeriod from "../../../hooks/useRefreshWithPeriod";
import EtherscanLink from "../../EtherscanLink";

const lg = "24px";
const md = "16px";

const StreamDataContainer = styled.div`
  align-content: space-around;
  align-items: space-around;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  padding: ${lg} ${md};
`;

const StyledText = styled(Text)`
  margin: 8px 0px;
`;

const StreamInfo = ({ proxyStream, network }: { proxyStream: ProxyStream; network: Networks }): ReactElement => {
  useRefreshwithPeriod(1000);
  const { recipient, sender } = proxyStream;

  /** Memoized Variables **/

  const recipientAddress = useMemo(() => getAddress(recipient), [recipient]);
  const senderAddress = useMemo(() => getAddress(sender), [sender]);

  return (
    <StreamDataContainer>
      <StyledText size="md">
        Sender: <EtherscanLink network={network} type="address" value={senderAddress} />
      </StyledText>
      <StyledText size="md">
        Recipient: <EtherscanLink network={network} type="address" value={recipientAddress} />
      </StyledText>
    </StreamDataContainer>
  );
};

export default StreamInfo;
