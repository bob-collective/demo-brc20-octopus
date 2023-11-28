import { Flex, Modal, ModalBody, ModalHeader } from "@interlay/ui";
import { StyledCTA, StyledHeader } from "./Layout.styles";
import { Logo } from "./Logo";
import { useBtcSnap } from "../../hooks/useBtcSnap";
import { useState } from "react";
import Inscribe from "../Inscribe/Inscribe";
import Transfer from "../Transfer/Transfer";
import { Badge } from "../Badge";
import { shortAddress } from "../../utils/format";
import { FaCopy } from "react-icons/fa";
import { useCopyToClipboard } from "react-use";

const Header = () => {
  const [isInscribeOpen, setIsInscribeOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const { bitcoinAddress, connectBtcSnap, isConnected } = useBtcSnap();
  const [, copy] = useCopyToClipboard();

  const handleCopyAddress = () => copy(bitcoinAddress || "");

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
                  <StyledCTA
                    onPress={() => setIsTransferOpen(true)}
                    size="small"
                  >
                    Transfer BTC
                  </StyledCTA>
                </li>
                <li>
                  <StyledCTA
                    onPress={() => setIsInscribeOpen(true)}
                    size="small"
                  >
                    Inscribe
                  </StyledCTA>
                </li>
              </Flex>
            </nav>
          )}
        </Flex>
        <Flex>
          <StyledCTA
            size="small"
            onPress={
              isConnected ? () => handleCopyAddress() : () => connectBtcSnap()
            }
          >
            {bitcoinAddress ? (
              <Flex gap={"spacing2"} alignItems="center">
                {shortAddress(bitcoinAddress)}
                <FaCopy />
              </Flex>
            ) : (
              "Connect Metamask"
            )}
          </StyledCTA>
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
