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
import { useGetInscriptionIds } from "../../hooks/useGetInscriptionIds";
import { H2 } from "@interlay/ui";
import { useBtcSnap } from "../../hooks/useBtcSnap";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Inscription } from "./components/Inscription";
import { TransferOrdinalForm } from "./components/TransferOrdinal/TransferOrdinalForm";
import { useLocalStorage, LocalStorageKey } from "../../hooks/useLocalStorage";
import {
  DefaultOrdinalsClient,
  InscriptionId,
} from "../../utils/ordinals-client";

const ordinals = new DefaultOrdinalsClient("testnet");

enum InscriptionsTableColumns {
  INSCRIPTION = "inscription",
  ACTIONS = "actions",
}

type InscriptionsTableRow = {
  id: string;
  [InscriptionsTableColumns.INSCRIPTION]: ReactNode;
  [InscriptionsTableColumns.ACTIONS]: ReactNode;
};

const Inscriptions = (): JSX.Element => {
  // TODO: This can be handled with a single modal
  const [isInscriptionOpen, setInscriptionOpen] = useState(false);
  const [isTransferFormOpen, setTransferFormOpen] = useState(false);
  const [inscriptionId, setInscriptionId] = useState<string | undefined>();

  const [pendingInscriptions, setPendingInscriptions] = useLocalStorage(
    LocalStorageKey.PENDING_INSCRIPTIONS
  );

  const { bitcoinAddress } = useBtcSnap();
  const inscriptionIds = useGetInscriptionIds(bitcoinAddress);

  console.log(
    "inscriptionIds, pendingInscriptions",
    inscriptionIds,
    pendingInscriptions
  );

  if (pendingInscriptions?.length) {
    for (const id of pendingInscriptions) {
      const thisOne = ordinals.getInscriptionFromId(id as InscriptionId);

      console.log("thisOne", thisOne);
    }
  }

  const duplicatedIds = pendingInscriptions?.filter((id) =>
    inscriptionIds?.includes(id)
  );

  console.log("duplicatedIds", duplicatedIds);

  useEffect(() => {
    if (!duplicatedIds?.length) return;
    const dedupedPendingInscriptions = pendingInscriptions?.filter(
      (id) => !duplicatedIds.includes(id)
    );

    console.log(dedupedPendingInscriptions);
    setPendingInscriptions(dedupedPendingInscriptions);
  }, [duplicatedIds, pendingInscriptions, setPendingInscriptions]);

  const combinedInscriptions = new Set([
    ...(inscriptionIds || []),
    ...(pendingInscriptions || []),
  ]);
  console.log("combinedInscriptions", combinedInscriptions);

  const handleShowInscription = (id: string) => {
    setInscriptionId(id);
    setInscriptionOpen(true);
  };

  const handleShowTransferForm = (id: string) => {
    setInscriptionId(id);
    setTransferFormOpen(true);
  };

  const columns = [
    { name: "Inscription", id: InscriptionsTableColumns.INSCRIPTION },
    { name: "", id: InscriptionsTableColumns.ACTIONS },
  ];

  const rows: InscriptionsTableRow[] = useMemo(
    () =>
      inscriptionIds
        ? inscriptionIds.map((id) => {
            return {
              id: id,
              inscription: `${id}`,
              actions: (
                <Flex
                  justifyContent="flex-end"
                  gap="spacing4"
                  alignItems="center"
                >
                  <CTA onPress={() => handleShowInscription(id)} size="small">
                    Show
                  </CTA>
                  <CTA onPress={() => handleShowTransferForm(id)} size="small">
                    Transfer
                  </CTA>
                </Flex>
              ),
            };
          })
        : [],
    [inscriptionIds]
  );

  return (
    <>
      <StyledWrapper direction="column" gap="spacing4">
        <H2>Ordinals portfolio</H2>
        <Card>
          <Table columns={columns} rows={rows} />
        </Card>
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
      <Modal
        isOpen={isTransferFormOpen}
        onClose={() => setTransferFormOpen(false)}
      >
        <ModalHeader>Transfer</ModalHeader>
        <ModalBody>
          <TransferOrdinalForm inscriptionId={inscriptionId || ""} />
        </ModalBody>
      </Modal>
    </>
  );
};

export default Inscriptions;
