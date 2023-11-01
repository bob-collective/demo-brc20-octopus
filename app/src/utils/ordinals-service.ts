const BITCOIN_NETWORK = import.meta.env.VITE_BITCOIN_NETWORK as string;
const ORDINALS_MAINNET = "https://ord-mainnet.gobob.xyz";
const ORDINALS_TESTNET = "https://ord-testnet.gobob.xyz";

const getOrdinalsUrl = () => {
  if (BITCOIN_NETWORK === "testnet") {
    return ORDINALS_TESTNET;
  }
  // TODO: this is the incorrect value for regtest
  if (BITCOIN_NETWORK === "regtest") {
    return ORDINALS_TESTNET;
  }
  if (BITCOIN_NETWORK === "mainnet") {
    return ORDINALS_MAINNET;
  }
  throw new Error(
    `Invalid bitcoin network configured: ${BITCOIN_NETWORK}. Valid values are: testnet | regtest | mainnet.`
  );
};

export { getOrdinalsUrl };
