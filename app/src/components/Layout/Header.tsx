import {
  CTA,
  CTALink,
  Flex,
  Modal,
  ModalBody,
  ModalHeader,
  Span,
} from "@interlay/ui";
import { Link } from "react-router-dom";
import { StyledHeader } from "./Layout.styles";
import { Logo } from "./Logo";
import { useBtcSnap } from "../../hooks/useBtcSnap";
import { useState } from "react";
import Inscribe from "../../pages/Inscribe/Inscribe";
// import { shortAddress } from "../../utils/format";

const Header = () => {
  const [isOpen, setOpen] = useState(false);

  const { bitcoinAddress, connectBtcSnap } = useBtcSnap();

  return (
    <>
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
                <CTALink onPress={() => setOpen(true)}>
                  <Span weight="bold">Inscribe</Span>
                </CTALink>
              </li>
            </Flex>
          </nav>
        </Flex>
        <Flex>
          <CTA
            size="small"
            onPress={() => connectBtcSnap()}
            disabled={!!bitcoinAddress}
          >
            {/* {bitcoinAddress ? shortAddress(bitcoinAddress) : "Connect Metamask"} */}
            {bitcoinAddress ? bitcoinAddress : "Connect Metamask"}
          </CTA>
        </Flex>
      </StyledHeader>
      <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
        <ModalHeader>Inscribe</ModalHeader>
        <ModalBody>
          <Inscribe />
        </ModalBody>
      </Modal>
    </>
  );
};

export { Header };
