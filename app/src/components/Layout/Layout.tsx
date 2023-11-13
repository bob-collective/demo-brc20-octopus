import { CTA, Flex } from "@interlay/ui";
import "react-modern-drawer/dist/index.css";
import { Header } from "./Header";
import { StyledMain } from "./Layout.styles";
import { connect } from "../../utils/btcsnap-utils";
import { useCallback, useState } from "react";

import {
  BitcoinNetwork,
  BitcoinScriptType,
  getExtendedPublicKey,
} from "../../utils/btcsnap-utils";
import { addressFromExtPubKey } from "../../utils/btcsnap-signer";
import { LocalStorageKey, useLocalStorage } from "../../hooks/useLocalStorage";

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

const Layout = ({ ...props }) => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  // TODO: Remove local storage when disconnecting Snap
  const [bitcoinAddress, setBitcoinAddress] = useLocalStorage(
    LocalStorageKey.DERIVED_BTC_ADDRESS
  );

  const connectMetaMask = useCallback(async () => {
    setIsConnecting(true);

    connect(async (connected: boolean) => {
      setIsConnecting(false);
      if (connected) {
        const { bitcoinAddress } = await getClientsAndAccounts();
        setBitcoinAddress(bitcoinAddress);
      }
    });
  }, [setIsConnecting, setBitcoinAddress]);

  return (
    <>
      <CTA
        size="small"
        onPress={() => connectMetaMask()}
        disabled={!!bitcoinAddress}
      >
        {isConnecting
          ? "Connecting"
          : bitcoinAddress
          ? bitcoinAddress
          : "Connect Metamask"}
      </CTA>
      <Flex direction="column">
        <Header />
        <StyledMain direction="column" {...props} />
      </Flex>
    </>
  );
};

export { Layout };
