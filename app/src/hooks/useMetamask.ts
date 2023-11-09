import {
  BitcoinNetwork,
  BitcoinScriptType,
  getExtendedPublicKey,
} from "../utils/btcsnap-utils";
import { addressFromExtPubKey } from "../utils/btcsnap-signer";
import { useQuery } from "@tanstack/react-query";

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
  const { data } = useQuery(
    ["metamasksnapdata"],
    async () => await getClientsAndAccounts(),
    {
      enabled: connected,
      refetchInterval: Infinity,
      refetchOnMount: false,
    }
  );

  return {
    data,
  };
};

export { useMetamask };
