const BTC_REGTEST_REGEX = /\b([2mn][a-km-zA-HJ-NP-Z1-9]{25,34}|bcrt1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;
const BTC_TESTNET_REGEX = /\b([2mn][a-km-zA-HJ-NP-Z1-9]{25,34}|tb1[ac-hj-np-zAC-HJ-NP-Z02-9]{11,71})\b/;

const BITCOIN_NETWORK = import.meta.env.VITE_BITCOIN_NETWORK as string;

const btcTestnetAddressRegex = new RegExp(BTC_TESTNET_REGEX);
const btcRegtestAddressRegex = new RegExp(BTC_REGTEST_REGEX);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isFormDisabled = (form: any, shouldBeDirty = true): boolean =>
  !form.isValid || (shouldBeDirty && !form.dirty);

export const isValidBTCAddress = (address: string): boolean => {
  if (BITCOIN_NETWORK === 'testnet') {
    return btcTestnetAddressRegex.test(address);
  }
  if (BITCOIN_NETWORK === 'regtest') {
    return btcRegtestAddressRegex.test(address);
  }
  throw new Error(
    `Invalid bitcoin network configured: ${BITCOIN_NETWORK}. Valid values are: testnet | regtest | mainnet.`
  );
};
