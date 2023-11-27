import { CTA, Flex, Modal, ModalBody, ModalHeader } from "@interlay/ui";
import { StyledHeader } from "./Layout.styles";
import { Logo } from "./Logo";
import { useBtcSnap } from "../../hooks/useBtcSnap";
import { useState } from "react";
import Inscribe from "../Inscribe/Inscribe";
import Transfer from "../Transfer/Transfer";
import { Badge } from "../Badge";
import { shortAddress } from "../../utils/format";
// import { shortAddress } from "../../utils/format";

const Header = () => {
  const [isInscribeOpen, setIsInscribeOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const { bitcoinAddress, connectBtcSnap, isConnected } = useBtcSnap();

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
          {isConnected && (
            <nav>
              <Flex elementType="ul" gap="spacing5">
                <li>
                  <CTA onPress={() => setIsTransferOpen(true)} size="small">
                    Transfer BTC
                  </CTA>
                </li>
                <li>
                  <CTA onPress={() => setIsInscribeOpen(true)} size="small">
                    Inscribe
                  </CTA>
                </li>
              </Flex>
            </nav>
          )}
        </Flex>
        <Flex>
          <CTA
            size="small"
            onPress={() => connectBtcSnap()}
            disabled={!!bitcoinAddress}
          >
            {bitcoinAddress ? shortAddress(bitcoinAddress) : "Connect Metamask"}
          </CTA>
        </Flex>
      </StyledHeader>
      <Modal isOpen={isInscribeOpen} onClose={() => setIsInscribeOpen(false)}>
        <ModalHeader>Inscribe</ModalHeader>
        <ModalBody>
          <Inscribe onSuccess={() => setIsInscribeOpen(false)} />
        </ModalBody>
      </Modal>
      <Modal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)}>
        <ModalHeader>Transfer</ModalHeader>
        <ModalBody>
          <Transfer onSuccess={() => setIsTransferOpen(false)} />
        </ModalBody>
      </Modal>
    </>
  );
};

export { Header };
