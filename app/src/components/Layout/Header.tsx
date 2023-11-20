import { CTA, Flex, Modal, ModalBody, ModalHeader } from "@interlay/ui";
import { StyledHeader } from "./Layout.styles";
import { Logo } from "./Logo";
import { useBtcSnap } from "../../hooks/useBtcSnap";
import { useState } from "react";
import Inscribe from "../Inscribe/Inscribe";
import Transfer from "../Transfer/Transfer";
import { Badge } from "../Badge";
// import { shortAddress } from "../../utils/format";

const Header = () => {
  // TODO: This can be handled with a single modal
  const [isInscribeOpen, setInscribeOpen] = useState(false);
  const [isTransferOpen, setTransferOpen] = useState(false);

  const { bitcoinAddress, connectBtcSnap } = useBtcSnap();

  return (
    <>
      <StyledHeader
        elementType="header"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex gap="spacing6" alignItems="center">
          <Flex gap="spacing1">
            <Logo />
            <Badge />
          </Flex>
          <nav>
            <Flex elementType="ul" gap="spacing5">
              <li>
                <CTA onPress={() => setTransferOpen(true)} size="small">
                  Transfer BTC
                </CTA>
              </li>
              <li>
                <CTA onPress={() => setInscribeOpen(true)} size="small">
                  Inscribe
                </CTA>
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
            {bitcoinAddress ? bitcoinAddress : "Connect Metamask"}
            {/* {bitcoinAddress ? shortAddress(bitcoinAddress) : "Connect Metamask"} */}
          </CTA>
        </Flex>
      </StyledHeader>
      <Modal isOpen={isInscribeOpen} onClose={() => setInscribeOpen(false)}>
        <ModalHeader>Inscribe</ModalHeader>
        <ModalBody>
          <Inscribe />
        </ModalBody>
      </Modal>
      <Modal isOpen={isTransferOpen} onClose={() => setTransferOpen(false)}>
        <ModalHeader>Transfer</ModalHeader>
        <ModalBody>
          <Transfer />
        </ModalBody>
      </Modal>
    </>
  );
};

export { Header };
