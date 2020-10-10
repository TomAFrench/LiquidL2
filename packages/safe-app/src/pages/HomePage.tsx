import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { Button, Title } from "@gnosis.pm/safe-react-components";

import { useIncomingStreams } from "../contexts/StreamsContext";

import CollateralForm from "../components/CollateralForm";

const HomeOuterWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding: 16px 24px;
  width: calc(100% - 48px);
`;

const LeftWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const RightWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const TopLeftHorizontalWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

const StyledTitle = styled(Title)`
  display: inline-block;
  margin-top: 0px;
  padding-right: 30px;
`;

const StyledButton = styled(Button).attrs({
  color: "primary",
  size: "md",
  variant: "outlined",
})`
  font-size: 14px !important;
`;

const DashboardNavWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding-left: 32px;
`;

function HomePage() {
  const history = useHistory();
  const incomingProxyStreams = useIncomingStreams();
  const userHasNoIncomingStreams = incomingProxyStreams.length === 0;

  return (
    <HomeOuterWrapper>
      <LeftWrapper>
        <TopLeftHorizontalWrapper>
          <StyledTitle size="xs">Delegated Withdrawals</StyledTitle>
        </TopLeftHorizontalWrapper>
        <CollateralForm />
      </LeftWrapper>
      <RightWrapper>
        <DashboardNavWrapper>
          <StyledButton disabled={userHasNoIncomingStreams} onClick={() => history.push("/incoming")}>
            View incoming streams
          </StyledButton>
        </DashboardNavWrapper>
      </RightWrapper>
    </HomeOuterWrapper>
  );
}

export default HomePage;
