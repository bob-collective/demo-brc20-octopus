import {
  CTA,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalHeader,
} from "@interlay/ui";
import { StyledWrapper } from "./Inscriptions.style";
import { useGetInscriptionIds } from "../../hooks/useGetInscriptionIds";
import { H2 } from "@interlay/ui";
import { useBtcSnap } from "../../hooks/useBtcSnap";
import { useState } from "react";
import Inscription from "../Inscription/Inscription";

const Inscriptions = (): JSX.Element => {
  const [isInscriptionOpen, setInscriptionOpen] = useState(false);
  const [inscriptionId, setInscriptionId] = useState<string | undefined>();

  const { bitcoinAddress } = useBtcSnap();
  const inscriptionIds = useGetInscriptionIds(bitcoinAddress);

  const handleShowInscription = (id: string) => {
    setInscriptionId(id);
    setInscriptionOpen(true);

    console.log(inscriptionId);
  };

  return (
    <>
      <StyledWrapper direction="column" gap="spacing4">
        <H2>Inscriptions</H2>
        <List>
          {inscriptionIds?.map((inscriptionId) => (
            <ListItem key={inscriptionId}>
              <CTA onPress={() => handleShowInscription(inscriptionId)}>
                {inscriptionId}
              </CTA>
            </ListItem>
          ))}
        </List>
      </StyledWrapper>
      <Modal
        isOpen={isInscriptionOpen}
        onClose={() => setInscriptionOpen(false)}
      >
        <ModalHeader>{inscriptionId}</ModalHeader>
        <ModalBody>
          <Inscription id={inscriptionId} />
        </ModalBody>
      </Modal>
    </>
  );
};

export default Inscriptions;
