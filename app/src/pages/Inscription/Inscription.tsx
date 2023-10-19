import { Card, Dd, Dl, DlGroup, Dt } from "@interlay/ui";
import { useParams } from "react-router-dom";
import { StyledWrapper } from "./Inscription.style";

function Inscription() {
  const { id } = useParams();

  return (
    <StyledWrapper direction="column" gap="spacing4">
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
    </StyledWrapper>
  );
}

export default Inscription;
