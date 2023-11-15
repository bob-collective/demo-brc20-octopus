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
import { ReactNode, useMemo, useState } from "react";
import Inscription from "../Inscription/Inscription";

enum InscriptionsTableColumns {
  INSCRIPTION = "inscription",
  ACTIONS = "actions",
}

type InscriptionsTableRow = {
  id: string;
  [InscriptionsTableColumns.INSCRIPTION]: ReactNode;
  [InscriptionsTableColumns.ACTIONS]: ReactNode;
};

// type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

// type InscrtipionsTableProps = Props InheritAttrs;

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

  const columns = [
    { name: "Asset", id: InscriptionsTableColumns.INSCRIPTION },
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
                  <CTA onPress={() => console.log("transfer")} size="small">
                    Transfer
                  </CTA>
                </Flex>
              ),
            };
          })
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inscriptionIds]
  );

  console.log("inscriptionIds", inscriptionIds);

  return (
    <>
      <StyledWrapper direction="column" gap="spacing4">
        <H2>Inscriptions</H2>
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
    </>
  );
};

export default Inscriptions;
