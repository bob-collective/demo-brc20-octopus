import { Flex, Span } from "@interlay/ui";
import { Link } from "react-router-dom";
import { StyledHeader } from "./Layout.styles";
import { Logo } from "./Logo";

const Header = () => {
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
    </StyledHeader>
  );
};

export { Header };
