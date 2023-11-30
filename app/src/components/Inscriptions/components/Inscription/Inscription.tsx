import { Card, Dd, Dl, DlGroup, Dt } from "@interlay/ui";
import { InscriptionWrapper, StyledWrapper } from "./Inscription.style";
import { shortAddress } from "../../../../utils/format";
import { InscriptionData } from "../../Inscriptions";

type Props = {
  inscription?: InscriptionData;
};

const Inscription = ({ inscription }: Props) => {
  if (!inscription) return;

  console.log(inscription);

  return (
    <StyledWrapper direction="column" gap="spacing4">
      <InscriptionWrapper>
        {inscription.contentType === "image" ? (
          <img src={inscription.content as string} />
        ) : (
          <p>{inscription.content as string} </p>
        )}
      </InscriptionWrapper>
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
