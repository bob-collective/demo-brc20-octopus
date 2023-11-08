import { createWalletClient, custom, defineChain } from "viem";
import { Chain } from "viem";

import {
  L2_BLOCK_EXPLORER,
  L2_CHAIN_ID,
  L2_MULTICALL3_ADDRESS,
  L2_RPC_URL,
  L2_WSS_URL,
} from "../config";
import {
  BitcoinNetwork,
  BitcoinScriptType,
  ExtendedPublicKey,
  connect as connectWithBtcSnap,
  getExtendedPublicKey,
} from "../utils/btcsnap-utils";
import { useCallback, useEffect, useState } from "react";
import { HexString } from "../types/metamask";
import { addressFromExtPubKey } from "../utils/btcsnap-signer";

const L2_CHAIN_CONFIG = {
  id: L2_CHAIN_ID,
  name: "BOB L2 Demo",
  network: "BOB-L2-Demo",
  nativeCurrency: {
    decimals: 18,
    name: "Bob",
    symbol: "BOB",
  },
  rpcUrls: {
    public: { http: [L2_RPC_URL], webSocket: [L2_WSS_URL] },
    default: { http: [L2_RPC_URL], webSocket: [L2_WSS_URL] },
  },
  blockExplorers: {
    default: { name: "BobScan", url: L2_BLOCK_EXPLORER },
  },
  contracts: {
    multicall3: {
      address: L2_MULTICALL3_ADDRESS,
    },
  },
} as const satisfies Chain;

export const l2chain = defineChain(L2_CHAIN_CONFIG);

const bitcoinNetwork = BitcoinNetwork.Test;

const getClientsAndAccounts = async () => {
  const walletClient = createWalletClient({
    chain: l2chain,
    transport: custom(window.ethereum),
  });
  const [evmAddress] = await walletClient.requestAddresses();

  // get segwit xpub
  const xpub = await getExtendedPublicKey(
    bitcoinNetwork,
    BitcoinScriptType.P2WPKH
  );
  // derive public address from xpub
  const bitcoinAddress = addressFromExtPubKey(xpub.xpub, bitcoinNetwork)!;

  return {
    evmAddress,
    bitcoinAddress,
    xpub,
  };
};

const useMetamask = () => {
  const [connected, setConnected] = useState(false);
  const [evmAccount, setEvmAccount] = useState<HexString>();
  const [bitcoinAddress, setBitcoinAddress] = useState<string>();
  const [xpub, setXpub] = useState<ExtendedPublicKey>();

  const connect = useCallback(() => {
    connectWithBtcSnap(() => setConnected(true));
  }, []);

  useEffect(() => {
    if (connected) {
      (async () => {
        const { evmAddress, bitcoinAddress, xpub } =
          await getClientsAndAccounts();
        setEvmAccount(evmAddress);
        setBitcoinAddress(bitcoinAddress);
        setXpub(xpub);
      })();
    }
  }, [connected]);

  return {
    connect,
    evmAccount,
    bitcoinAddress,
    xpub,
  };
};

export { useMetamask };
