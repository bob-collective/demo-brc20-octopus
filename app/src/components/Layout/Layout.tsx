import { CTA, Flex, P } from "@interlay/ui";
import "react-modern-drawer/dist/index.css";
import { Header } from "./Header";
import { StyledMain } from "./Layout.styles";
import { useState } from "react";
import { useMetamask, useConnectMetamask } from "../../hooks/useMetamask";

const Layout = ({ ...props }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connect = useConnectMetamask();
  const { data } = useMetamask(isConnected);

  console.log("data from hook", data);

  return (
    <>
      {isConnected ? (
        <Flex elementType="span" gap="spacing2">
          <P>{data?.bitcoinAddress}</P>
        </Flex>
      ) : (
        <CTA
          size="small"
          onPress={() => connect((connected) => setIsConnected(connected))}
        >
          Connect Metamask
        </CTA>
      )}
      <Flex direction="column">
        <Header />
        <StyledMain direction="column" {...props} />
      </Flex>
    </>
  );
};

export { Layout };
