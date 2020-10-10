import React, { ReactElement } from "react";
import styled from "styled-components";

import { Button } from "@gnosis.pm/safe-react-components";

const lg: string = "24px";
const md: string = "16px";

const ActionsContainer = styled.div`
  align-content: space-around;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: ${lg} ${md};
`;

const StyledButton = styled(Button).attrs({
  color: "primary",
  size: "md",
  variant: "contained",
})`
  min-width: 120px;
`;

const StreamActions = (): ReactElement => {
  return (
    <ActionsContainer>
      <StyledButton onClick={() => console.log("Action!")}>Withdraw</StyledButton>
    </ActionsContainer>
  );
};

export default StreamActions;
