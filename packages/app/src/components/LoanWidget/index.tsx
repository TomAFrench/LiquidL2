import React from "react";
import { Network, Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import { TextField } from "@material-ui/core";
import { Border, Button } from "../common";

interface Props {
  provider: Provider | undefined;
  network: Network | undefined;
}

const LoanWidget: React.FC<Props> = ({ provider, network }) => {
  return (
    <Border style={{ opacity: network?.chainId === 1 ? 1 : 0.1 }}>
      <p> Pending Withdrawals: {`${formatUnits(100000000, 6)} USDC`}</p>
      <p> Credit Limit: {`${formatUnits(100000000, 6)} USDC`}</p>
      <p> Amount Borrowed: {`${formatUnits(50000000, 6)} USDC`}</p>
      <TextField />
      <Button>Borrow</Button>
    </Border>
  );
};

export default LoanWidget;
