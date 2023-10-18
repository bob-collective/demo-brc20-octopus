import { BTC } from "@interlay/coin-icons";
import { ChevronRight } from "@interlay/icons";
import {
  Card,
  Dd,
  Dl,
  DlGroup,
  Dt,
  Flex,
  H2,
  H3,
  Span,
  Tabs,
  TabsItem,
} from "@interlay/ui";
import { HTMLAttributes, useState } from "react";
import "react-modern-drawer/dist/index.css";
import { useAccount } from "../../hooks/useAccount";
import { useBalance } from "../../hooks/useBalance";
import { useConnect } from "../../hooks/useConnect";
import { useBrc20Balances } from "../../hooks/useBrc20Balances";
import { Header } from "./Header";
import {
  StyledBRC20List,
  StyledClose,
  StyledDrawer,
  StyledMain,
  StyledRelative,
} from "./Layout.styles";

function shortAddress(address?: string, len = 5) {
  if (!address) return "";
  if (address.length <= len * 2) return address;
  return address.slice(0, len) + "..." + address.slice(address.length - len);
}

const Layout = (props: HTMLAttributes<unknown>) => {
  const [isOpen, setOpen] = useState(false);
  const { connect } = useConnect({
    onSuccess: () => setOpen(false),
  });
  const { data: balance } = useBalance();
  const { data: brc20Balances } = useBrc20Balances();
  const { data: address } = useAccount();

  console.log(brc20Balances);

  return (
    <>
      <Flex direction="column">
        <Header onClickAccount={() => setOpen(true)} />
        <StyledMain direction="column" {...props} />
      </Flex>
      <StyledDrawer
        enableOverlay={false}
        open={isOpen}
        onClose={() => setOpen(false)}
        direction="right"
      >
        <StyledRelative>
          <StyledClose onClick={() => setOpen(false)}>
            <ChevronRight />
          </StyledClose>
          {address ? (
            <Flex direction="column" gap="spacing6">
              <Flex alignItems="center" gap="spacing2">
                <Card
                  padding="spacing1"
                  variant="bordered"
                  background="secondary"
                  rounded="full"
                  alignItems="center"
                  justifyContent="center"
                >
                  <img
                    height={40}
                    src="https://unisat.io/logo/color.svg"
                    alt="unisat"
                  ></img>
                </Card>
                <Span weight="semibold" size="s">
                  {shortAddress(address)}
                </Span>
              </Flex>
              <Flex alignItems="center" gap="spacing2">
                <BTC />
                <H2 size="xl">{balance?.total || 0} sats</H2>
              </Flex>
              <Tabs>
                <TabsItem key="tokens" title="BRC-20">
                  <StyledBRC20List gap="spacing4">
                    {Object.entries(brc20Balances || {}).map(
                      ([ticker, amount]) => (
                        <Card
                          padding="spacing3"
                          flex={1}
                          variant="bordered"
                          gap="spacing2"
                          key={ticker}
                        >
                          <H3 size="lg">{ticker}</H3>
                          <Dl direction="column" gap="spacing0">
                            <DlGroup justifyContent="space-between">
                              <Dt size="s">Transferable:</Dt>
                              <Dd size="s">{0}</Dd>
                            </DlGroup>
                            <DlGroup justifyContent="space-between">
                              <Dt size="s">Availabel:</Dt>
                              <Dd size="s">{amount}</Dd>
                            </DlGroup>
                            <DlGroup justifyContent="space-between">
                              <Dt size="s">Total:</Dt>
                              <Dd size="s">{amount}</Dd>
                            </DlGroup>
                          </Dl>
                        </Card>
                      )
                    )}
                  </StyledBRC20List>
                </TabsItem>
                <TabsItem key="activity" title="Activity">
                  <Span>No Activity</Span>
                </TabsItem>
              </Tabs>
            </Flex>
          ) : (
            <Flex direction="column" gap="spacing6">
              <H2 size="xl">Connect Wallet</H2>
              <Card
                alignItems="center"
                isPressable
                isHoverable
                onPress={() => {
                  connect();
                }}
                direction="row"
                variant="bordered"
                background="secondary"
                padding="spacing4"
                gap="spacing4"
              >
                <img
                  height={40}
                  src="https://unisat.io/logo/color.svg"
                  alt="unisat"
                ></img>
                Unisat Wallet
              </Card>
            </Flex>
          )}
        </StyledRelative>
      </StyledDrawer>{" "}
    </>
  );
};

export { Layout };
