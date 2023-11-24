import {
  CTA,
  Card,
  Flex,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
} from "@interlay/ui";
import { ReactNode, useMemo, useState } from "react";
import { Inscription } from "./components/Inscription";
import { TransferOrdinalForm } from "./components/TransferOrdinal/TransferOrdinalForm";
import { useGetInscriptions } from "../../hooks/useGetInscriptions";
import { shortAddress } from "../../utils/format";

type Props = {
  inscriptionIds: string[];
};

enum InscriptionsTableColumns {
  INSCRIPTION_ID = "inscription_id",
  ACTIONS = "actions",
  STATUS = "status",
}

type InscriptionData = {
  id: string;
  isConfirmed: boolean;
  content: string;
};

type InscriptionsTableRow = {
  id: string;
  [InscriptionsTableColumns.INSCRIPTION_ID]: ReactNode;
  [InscriptionsTableColumns.STATUS]: ReactNode;
  [InscriptionsTableColumns.ACTIONS]: ReactNode;
};

const Inscriptions = ({ inscriptionIds }: Props): JSX.Element => {
  const [isInscriptionOpen, setIsInscriptionOpen] = useState(false);
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
  const [inscription, setInscription] = useState<InscriptionData | undefined>();

  const { inscriptions } = useGetInscriptions(inscriptionIds);

  const handleShowInscription = (inscription: InscriptionData) => {
    setInscription(inscription);
    setIsInscriptionOpen(true);
  };

  const handleShowTransferForm = (inscription: InscriptionData) => {
    setInscription(inscription);
    setIsTransferFormOpen(true);
  };

  const columns = [
    { name: "Inscription ID", id: InscriptionsTableColumns.INSCRIPTION_ID },
    { name: "Status", id: InscriptionsTableColumns.STATUS },
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
            inscription_id: shortAddress(inscription!.id),
            status: inscription!.isConfirmed ? "Confirmed" : "Unconfirmed",
            actions: (
              <Flex
                justifyContent="flex-end"
                gap="spacing4"
                alignItems="center"
              >
                <CTA
                  onPress={() => handleShowInscription(inscription!)}
                  size="small"
                >
                  Show
                </CTA>
                <CTA
                  onPress={() => handleShowTransferForm(inscription!)}
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
      <Card>
        <Table
          aria-label="Ordinals portfolio"
          columns={columns}
          rows={inscriptionRows}
        />
      </Card>
      <Modal
        isOpen={isInscriptionOpen}
        onClose={() => setIsInscriptionOpen(false)}
      >
        <ModalHeader>Ordinal</ModalHeader>
        <ModalBody>
          <Inscription inscription={inscription} />
        </ModalBody>
      </Modal>
      <Modal
        isOpen={isTransferFormOpen}
        onClose={() => setIsTransferFormOpen(false)}
      >
        <ModalHeader>Transfer</ModalHeader>
        <ModalBody>
          <TransferOrdinalForm
            inscriptionId={inscription?.id || ""}
            onSuccess={() => setIsTransferFormOpen(false)}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export { Inscriptions };
export type { InscriptionData };
