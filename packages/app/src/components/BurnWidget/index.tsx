import React from "react";
import { Network, Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import { TextField } from "@material-ui/core";
import { Border, Button } from "../common";

interface Props {
  provider: Provider | undefined;
  network: Network | undefined;
}

const BurnWidget: React.FC<Props> = ({ provider, network }) => {
  return (
    <Border style={{ opacity: network?.chainId === 137 ? 1 : 0.1 }}>
      <p> Matic USDC Balance: {`${formatUnits(100000000, 6)} USDC`}</p>
      <TextField />
      <Button>Withdraw</Button>
    </Border>
  );
};

export default BurnWidget;
