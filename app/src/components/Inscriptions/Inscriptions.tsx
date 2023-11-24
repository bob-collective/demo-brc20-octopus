import {
  CTA,
  Card,
  Flex,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
} from "@interlay/ui";
import { StyledWrapper } from "./Inscriptions.style";
import { H2 } from "@interlay/ui";
import { ReactNode, useMemo, useState } from "react";
import { Inscription } from "./components/Inscription";
import { TransferOrdinalForm } from "./components/TransferOrdinal/TransferOrdinalForm";
import { useGetInscriptions } from "../../hooks/useGetInscriptions";

type Props = {
  inscriptionIds: string[];
};

enum InscriptionsTableColumns {
  INSCRIPTION = "inscription",
  ACTIONS = "actions",
}

type InscriptionsTableRow = {
  id: string;
  [InscriptionsTableColumns.INSCRIPTION]: ReactNode;
  [InscriptionsTableColumns.ACTIONS]: ReactNode;
};

const Inscriptions = ({ inscriptionIds }: Props): JSX.Element => {
  const [isInscriptionOpen, setIsInscriptionOpen] = useState(false);
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
  const [inscriptionId, setInscriptionId] = useState<string | undefined>();

  console.log("inscriptionIds", inscriptionIds);

  const { inscriptions } = useGetInscriptions(inscriptionIds);
  console.log(inscriptions);

  const handleShowInscription = (id: string) => {
    setInscriptionId(id);
    setIsInscriptionOpen(true);
  };

  const handleShowTransferForm = (id: string) => {
    setInscriptionId(id);
    setIsTransferFormOpen(true);
  };

  const columns = [
    { name: "Inscription", id: InscriptionsTableColumns.INSCRIPTION },
    { name: "", id: InscriptionsTableColumns.ACTIONS },
  ];

  // TODO: Remove these non-null assertions
  const inscriptionRows: InscriptionsTableRow[] = useMemo(
    () =>
      inscriptions &&
      inscriptions
        .map((inscription) => {
          return {
            id: inscription!.id,
            inscription: `${inscription!.id!}`,
            actions: (
              <Flex
                justifyContent="flex-end"
                gap="spacing4"
                alignItems="center"
              >
                <CTA
                  onPress={() => handleShowInscription(inscription!.id)}
                  size="small"
                >
                  Show
                </CTA>
                <CTA
                  onPress={() => handleShowTransferForm(inscription!.id)}
                  size="small"
                >
                  Transfer
                </CTA>
              </Flex>
            ),
          };
        })
        .filter((row) => row !== undefined),
    [inscriptions]
  );

  return (
    <>
      <StyledWrapper direction="column" gap="spacing4">
        <H2>Ordinals portfolio</H2>
        <Card>
          <Table
            aria-label="Ordinals portfolio"
            columns={columns}
            rows={inscriptionRows}
          />
        </Card>
      </StyledWrapper>
      <Modal
        isOpen={isInscriptionOpen}
        onClose={() => setIsInscriptionOpen(false)}
      >
        <ModalHeader>Ordinal</ModalHeader>
        <ModalBody>
          <Inscription id={inscriptionId} />
        </ModalBody>
      </Modal>
      <Modal
        isOpen={isTransferFormOpen}
        onClose={() => setIsTransferFormOpen(false)}
      >
        <ModalHeader>Transfer</ModalHeader>
        <ModalBody>
          <TransferOrdinalForm
            inscriptionId={inscriptionId || ""}
            onSuccess={() => setIsTransferFormOpen(false)}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default Inscriptions;
