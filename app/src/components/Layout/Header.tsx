import { CTA } from "@interlay/ui";
import { useConnect } from "../../hooks/useConnect";
import { CTAWrapper, StyledHeader } from "./Layout.styles";
import { useAccount } from "../../hooks/useAccount";

const Header = () => {
  const { connect, isLoading } = useConnect();
  const { data: address } = useAccount();

  console.log(address);
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
      <CTAWrapper>
        <CTA disabled={isLoading} size="small" onPress={handleConnectWallet}>
          Connect Wallet
        </CTA>
      </CTAWrapper>
    </StyledHeader>
  );
};

export { Header };
