export const STREAM_TABLE_ID = "id";
export const VAULT_TABLE_VAULT_ID = "humanSender";
export const VAULT_TABLE_BORROWER_ID = "humanRecipient";
export const STREAM_TABLE_DEPOSIT_ID = "humanDeposit";
export const STREAM_TABLE_START_TIME_ID = "humanStartTime";
export const STREAM_TABLE_END_TIME_ID = "humanStopTime";
export const STREAM_TABLE_STATUS_ID = "status";
export const STREAM_TABLE_EXPAND_ICON = "expand";

export type Column = {
  id: string;
  order: boolean;
  disablePadding: boolean;
  label: string;
  custom: boolean;
  align?: "right" | "inherit" | "left" | "center" | "justify" | undefined;
  width?: number;
  style?: any;
  static?: boolean;
};

export const generateColumns = () => {
  const senderColumn: Column = {
    id: VAULT_TABLE_VAULT_ID,
    order: false,
    disablePadding: false,
    label: "Vault",
    custom: false,
    width: 320,
  };

  const recipientColumn: Column = {
    id: VAULT_TABLE_BORROWER_ID,
    order: false,
    disablePadding: false,
    label: "Borrower",
    custom: false,
    width: 320,
  };

  const depositColumn: Column = {
    id: STREAM_TABLE_DEPOSIT_ID,
    order: false,
    disablePadding: false,
    label: "Pending Withdrawals",
    custom: false,
    width: 120,
    static: true,
  };

  const startColumn: Column = {
    id: STREAM_TABLE_START_TIME_ID,
    disablePadding: false,
    order: true,
    label: "Borrowed Balance",
    custom: false,
  };

  const endColumn: Column = {
    id: STREAM_TABLE_END_TIME_ID,
    disablePadding: false,
    order: true,
    label: "Credit Limit",
    custom: false,
  };

  const expandIconColumn: Column = {
    id: STREAM_TABLE_EXPAND_ICON,
    order: false,
    disablePadding: true,
    label: "",
    custom: true,
    width: 50,
    static: true,
  };

  return [senderColumn, recipientColumn, depositColumn, startColumn, endColumn, expandIconColumn];
};
