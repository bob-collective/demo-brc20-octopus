import {
  CTA,
  Card,
  Dd,
  Dl,
  DlGroup,
  Dt,
  Flex,
  Modal,
  ModalBody,
  ModalHeader,
} from "@interlay/ui";
import { useParams } from "react-router-dom";
import { StyledWrapper } from "./Inscription.style";
import { useEffect, useState } from "react";
import { TransferInscriptionForm } from "./components";

function Inscription() {
  const [isTransferable, setTransferable] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const getInscription = async () => {
      try {
        const res = await fetch(`https://testnet.ordinals.com/content/${id}`);

        const json = await res.json();

        console.log(json);

        if (json.p && json.op && json.tick && json.amt) {
          return setTransferable(false);
        }

        return setTransferable(true);
      } catch (e) {
        try {
          const res = await fetch(`https://testnet.ordinals.com/content/${id}`);

          await res.text();

          return setTransferable(true);
        } catch (e) {
          return setTransferable(false);
        }
      }
    };

    if (id) {
      getInscription();
    }
  }, [id]);

  return (
    <StyledWrapper direction="column" gap="spacing4">
      {isTransferable && (
        <Flex justifyContent="flex-end">
          <CTA size="small" onPress={() => setOpen(true)}>
            Transfer
          </CTA>
        </Flex>
      )}
      <iframe
        src={`https://testnet.ordinals.com/preview/${id}`}
        sandbox="allow-scripts"
        scrolling="no"
        loading="lazy"
        allow=""
      ></iframe>
      <Card>
        <Dl>
          <DlGroup flex={1} justifyContent="space-between">
            <Dt size="s">Inscription Id:</Dt>
            <Dd size="s">{id}</Dd>
          </DlGroup>
        </Dl>
      </Card>
      {id && (
        <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
          <ModalHeader>Transfer Inscription</ModalHeader>
          <ModalBody>
            <TransferInscriptionForm inscriptionId={id} />
          </ModalBody>
        </Modal>
      )}
    </StyledWrapper>
  );
}

export default Inscription;
