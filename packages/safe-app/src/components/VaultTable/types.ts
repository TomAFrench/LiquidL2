import { Token } from "../../types";

export type HumanReadableStream = {
  humanDeposit: string;
  humanStartTime: string;
  humanStopTime: string;
  humanStartTimeOrder: number;
  humanStopTimeOrder: number;
  id: number;
  humanRecipient: string;
  humanSender: string;
  token: Token;
};
