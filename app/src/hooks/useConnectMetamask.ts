import {
  PublicClient,
  WalletClient,
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  http,
} from "viem";
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

const L2_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string;

const L2_METADATA = {
  name: "BOB: Peer to Peer Swap",
  description: "BOB Peer to Peer Swap Demo",
  url: "https://demo.gobob.xyz",
  icons: [
    "https://uploads-ssl.webflow.com/64e85c2f3609488b3ed725f4/64ecae53ef4b561482f1c49f_bob1.jpg",
  ],
};

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
  const publicClient = createPublicClient({
    chain: l2chain,
    transport: http(),
  });

  const walletClient = createWalletClient({
    chain: l2chain,
    transport: custom(window.ethereum),
  });
  const [evmAddress] = await walletClient.requestAddresses();

  // sometimes the snap needs to be switched to testnet first
  //try {
  //   // switch to testnet
  //   updateNetworkInSnap(bitcoinNetwork);
  // } catch {
  //   //
  // }

  // get segwit xpub
  const xpub = await getExtendedPublicKey(
    bitcoinNetwork,
    BitcoinScriptType.P2WPKH
  );
  // derive public address from xpub
  const bitcoinAddress = addressFromExtPubKey(
    xpub.xpub,
    bitcoinNetwork,
  )!;

  return {
    publicClient,
    walletClient,
    evmAddress,
    bitcoinAddress,
    xpub,
  };
};

const useConnectMetamask = () => {
  const [connected, setConnected] = useState(false);
  const [publicClient, setPublicClient] = useState<PublicClient>();
  const [walletClient, setWalletClient] = useState<WalletClient>();
  const [evmAccount, setEvmAccount] = useState<HexString>();
  const [bitcoinAddress, setBitcoinAddress] = useState<string>();
  const [xpub, setXpub] = useState<ExtendedPublicKey>();

  const connect = useCallback(() => {
    connectWithBtcSnap(() => setConnected(true));
  }, []);

  useEffect(() => {
    if (connected) {
      (async () => {
        const { publicClient, walletClient, evmAddress, bitcoinAddress, xpub } =
          await getClientsAndAccounts();
        setPublicClient(publicClient);
        setWalletClient(walletClient);
        setEvmAccount(evmAddress);
        setBitcoinAddress(bitcoinAddress);
        setXpub(xpub);
      })();
    }
  }, [connected]);

  return {
    connect,
    publicClient,
    walletClient,
    evmAccount,
    bitcoinAddress,
    xpub,
  };
};

export { L2_CHAIN_CONFIG, L2_METADATA, L2_PROJECT_ID, useConnectMetamask };
