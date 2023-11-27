import { useCallback, useEffect, useState } from "react";
import { addressFromExtPubKey } from "../utils/btcsnap-signer";
import {
  BitcoinNetwork,
  BitcoinScriptType,
  checkConnection,
  connect,
  getExtendedPublicKey,
} from "../utils/btcsnap-utils";
import { useLocalStorage, LocalStorageKey } from "./useLocalStorage";

const bitcoinNetwork = BitcoinNetwork.Test;

const getDerivedBtcAddress = async () => {
  const xpub = await getExtendedPublicKey(
    bitcoinNetwork,
    BitcoinScriptType.P2WPKH
  );

  const bitcoinAddress = addressFromExtPubKey(xpub.xpub, bitcoinNetwork)!;

  return {
    bitcoinAddress,
  };
};

const connectionCheck = async () => {
  const isConnected = await checkConnection();

  return isConnected;
};

const useBtcSnap = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const [bitcoinAddress, setBitcoinAddress, removeBitcoinAddress] =
    useLocalStorage(LocalStorageKey.DERIVED_BTC_ADDRESS);

  const connectBtcSnap = useCallback(async () => {
    connect(async (connected: boolean) => {
      if (connected) {
        const { bitcoinAddress } = await getDerivedBtcAddress();
        setBitcoinAddress(bitcoinAddress);
      }
    });
  }, [setBitcoinAddress]);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await connectionCheck();

      // This will reset BTC address if user has disconnected
      if (!connected && bitcoinAddress) {
        removeBitcoinAddress();
      }

      setIsConnected(connected);
    };

    checkConnection();
  }, [bitcoinAddress, isConnected, removeBitcoinAddress, setBitcoinAddress]);

  return { connectBtcSnap, bitcoinAddress, isConnected };
};

export { useBtcSnap };
