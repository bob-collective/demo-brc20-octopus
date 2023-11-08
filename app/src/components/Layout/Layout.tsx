import truncateEthAddress from "truncate-eth-address";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { CTA, Flex, Span } from "@interlay/ui";
import { HTMLAttributes } from "react";
import "react-modern-drawer/dist/index.css";
import { Header } from "./Header";
import { StyledMain } from "./Layout.styles";
import { HexString } from "../../types/metamask";

type MetamaskConnectProps = {
  evmAccount?: HexString;
  connect: () => void;
  bitcoinAddress?: string;
};

type Props = HTMLAttributes<unknown> & MetamaskConnectProps;

const Layout = ({ evmAccount, bitcoinAddress, connect, ...props }: Props) => {
  return (
    <>
      <CTA size="small" onPress={() => connect()}>
        {evmAccount ? (
          <Flex elementType="span" gap="spacing2">
            <Jazzicon diameter={20} seed={jsNumberForAddress(evmAccount)} />
            <Span style={{ color: "inherit" }} size="s" color="tertiary">
              {truncateEthAddress(evmAccount)} | bitcoin: {bitcoinAddress}
            </Span>
          </Flex>
        ) : (
          "Connect Wallet"
        )}
      </CTA>
      <Flex direction="column">
        <Header />
        <StyledMain direction="column" {...props} />
      </Flex>
    </>
  );
};

export { Layout };
