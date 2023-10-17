import { CTA, Flex } from "@interlay/ui";
import { useAccount } from "../../hooks/useAccount";
import { useConnect } from "../../hooks/useConnect";
import { StyledHeader } from "./Layout.styles";

function shortAddress(address?: string, len = 5) {
  if (!address) return "";
  if (address.length <= len * 2) return address;
  return address.slice(0, len) + "..." + address.slice(address.length - len);
}

const Header = () => {
  const { connect, isLoading } = useConnect();
  const { data: address } = useAccount();

  const handleConnectWallet = () => connect();

  return (
    <StyledHeader
      elementType="header"
      alignItems="center"
      justifyContent="space-between"
    >
      <a href="/" aria-label="navigate to home page">
        <img
          src="https://uploads-ssl.webflow.com/64e85c2f3609488b3ed725f4/64ede4ad095a0a3801df095f_BobLogo.svg"
          width="137"
          alt="logo"
        />
      </a>
      <Flex>
        {/* <Card
          rounded="lg"
          variant="bordered"
          shadowed={false}
          padding="spacing3"
          alignItems="center"
        >
          <BTC />
        </Card> */}
        <CTA disabled={isLoading} size="small" onPress={handleConnectWallet}>
          {address ? shortAddress(address) : "Connect Wallet"}
        </CTA>
      </Flex>
    </StyledHeader>
  );
};

export { Header };
