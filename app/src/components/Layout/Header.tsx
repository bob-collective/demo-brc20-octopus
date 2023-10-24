import { CTA, Flex, Span } from "@interlay/ui";
import { Link } from "react-router-dom";
import { useAccount } from "../../hooks/useAccount";
import { StyledHeader } from "./Layout.styles";
import { Logo } from "./Logo";

function shortAddress(address?: string, len = 5) {
  if (!address) return "";
  if (address.length <= len * 2) return address;
  return address.slice(0, len) + "..." + address.slice(address.length - len);
}

const Header = ({ onClickAccount }: { onClickAccount: () => void }) => {
  const { data: address } = useAccount();

  return (
    <StyledHeader
      elementType="header"
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex gap="spacing6">
        <Logo />
        <nav>
          <Flex elementType="ul" gap="spacing5">
            <li>
              <Link to="/transfer">
                <Span weight="bold">Transfer</Span>
              </Link>
            </li>
            <li>
              <Link to="/inscribe">
                <Span weight="bold">Inscribe</Span>
              </Link>
            </li>
          </Flex>
        </nav>
      </Flex>
      <Flex>
        <CTA size="small" onPress={onClickAccount}>
          {address ? shortAddress(address) : "Connect Wallet"}
        </CTA>
      </Flex>
    </StyledHeader>
  );
};

export { Header };
