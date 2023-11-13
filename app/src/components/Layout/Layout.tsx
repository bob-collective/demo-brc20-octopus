import { CTA, Flex } from "@interlay/ui";
import "react-modern-drawer/dist/index.css";
import { Header } from "./Header";
import { StyledMain } from "./Layout.styles";

import { useBtcSnap } from "../../hooks/useBtcSnap";

const Layout = ({ ...props }) => {
  const { bitcoinAddress, connectBtcSnap } = useBtcSnap();
  return (
    <>
      <CTA
        size="small"
        onPress={() => connectBtcSnap()}
        disabled={!!bitcoinAddress}
      >
        {bitcoinAddress ? bitcoinAddress : "Connect Metamask"}
      </CTA>
      <Flex direction="column">
        <Header />
        <StyledMain direction="column" {...props} />
      </Flex>
    </>
  );
};

export { Layout };
