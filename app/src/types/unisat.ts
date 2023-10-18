type AccountsChangedEvent = (
  event: "accountsChanged",
  handler: (accounts: Array<string>) => void
) => void;

type Inscription = {
  inscriptionId: string;
  inscriptionNumber: string;
  address: string;
  outputValue: string;
  content: string;
  contentLength: string;
  contentType: number;
  preview: string;
  timestamp: number;
  offset: number;
  genesisTransaction: string;
  location: string;
};

type getInscriptionsResult = { total: number; list: Inscription[] };

type SendInscriptionsResult = { txid: string };

type Balance = { confirmed: number; unconfirmed: number; total: number };

type Unisat = {
  requestAccounts: () => Promise<string[]>;
  getAccounts: () => Promise<string>;
  on: AccountsChangedEvent;
  removeListener: AccountsChangedEvent;
  getInscriptions: (
    cursor: number,
    size: number
  ) => Promise<getInscriptionsResult>;
  sendInscription: (
    address: string,
    inscriptionId: string,
    options?: { feeRate: number }
  ) => Promise<SendInscriptionsResult>;
  switchNetwork: (network: "livenet" | "testnet") => Promise<void>;
  getBalance: () => Promise<Balance>;
};

declare global {
  interface Window {
    unisat: Unisat;
  }
}

export type {
  Inscription,
  SendInscriptionsResult,
  Unisat,
  getInscriptionsResult,
  Balance,
};
