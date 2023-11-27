import { Card, Dd, Dl, DlGroup, Dt } from "@interlay/ui";
import { StyledWrapper } from "./Inscription.style";
import { shortAddress } from "../../../../utils/format";
import { InscriptionData } from "../../Inscriptions";

type Props = {
  inscription?: InscriptionData;
};

const Inscription = ({ inscription }: Props) => {
  if (!inscription) return;

  return (
    <StyledWrapper direction="column" gap="spacing4">
      {inscription.isConfirmed ? (
        <iframe src={inscription.content} loading="lazy" allow=""></iframe>
      ) : (
        <iframe srcDoc={inscription.content} loading="lazy" allow="" />
      )}
      <Card>
        <Dl>
          <DlGroup flex={1} justifyContent="space-between">
            <Dt size="s">
              {inscription.isConfirmed
                ? "Inscription Id:"
                : "Inscription Id (unconfirmed):"}
            </Dt>
            <Dd size="s">{shortAddress(inscription.id)}</Dd>
          </DlGroup>
        </Dl>
      </Card>
    </StyledWrapper>
  );
};

export { Inscription };
