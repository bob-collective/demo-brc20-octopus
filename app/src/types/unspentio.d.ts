declare module "@unspentio/xpub-lib" {
  export const addressFromExtPubKey: ({
    extPubKey,
    network,
  }: {
    extPubKey: string;
    network: string;
  }) => {
    address: string;
  };
}
