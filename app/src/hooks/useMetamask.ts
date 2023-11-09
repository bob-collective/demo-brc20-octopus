import { defineChain, Chain } from "viem";

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
  getExtendedPublicKey,
} from "../utils/btcsnap-utils";
import { addressFromExtPubKey } from "../utils/btcsnap-signer";
import { useQuery } from "@tanstack/react-query";

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
  // get segwit xpub
  const xpub = await getExtendedPublicKey(
    bitcoinNetwork,
    BitcoinScriptType.P2WPKH
  );
  // derive public address from xpub
  const bitcoinAddress = addressFromExtPubKey(xpub.xpub, bitcoinNetwork)!;

  return {
    bitcoinAddress,
    xpub,
  };
};

const useMetamask = (connected: boolean) => {
  console.log("in hook", connected);
  const { data } = useQuery(
    ["metamasksnapdata"],
    async () => await getClientsAndAccounts(),
    {
      enabled: false,
      refetchInterval: Infinity,
      refetchOnMount: false,
    }
  );

  return {
    data,
  };
};

export { useMetamask };
