/// <reference types="vite/client" />

type AccountsChangedEvent = (
  event: "accountsChanged",
  handler: (accounts: Array<string>) => void
) => void;

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unisat: {
    requestAccounts: () => Promise<string[]>;
    getAccounts: () => Promise<string>;
    on: AccountsChangedEvent;
    removeListener: AccountsChangedEvent;
  };
}
