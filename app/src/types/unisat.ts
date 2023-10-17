type AccountsChangedEvent = (
  event: "accountsChanged",
  handler: (accounts: Array<string>) => void
) => void;

type Inscriptions = {
  total: number;
  list: Record<string, unknown>[];
  inscriptionId: string;
  inscriptionNumber: string;
  address: string;
  outputValue: string;
  content: string;
  contentLength: string;
  contentType: number;
  preview: number;
  timestamp: number;
  offset: number;
  genesisTransaction: string;
  location: string;
};

type SendInscriptionsResult = { txid: string };

type Unisat = {
  requestAccounts: () => Promise<string[]>;
  getAccounts: () => Promise<string>;
  on: AccountsChangedEvent;
  removeListener: AccountsChangedEvent;
  getInscriptions: (cursor: number, size: number) => Promise<Inscriptions>;
  sendInscription: (
    address: string,
    inscriptionId: string,
    options?: { feeRate: number }
  ) => Promise<SendInscriptionsResult>;
};

declare global {
  interface Window {
    unisat: Unisat;
  }
}

export type { Inscriptions, SendInscriptionsResult, Unisat };
