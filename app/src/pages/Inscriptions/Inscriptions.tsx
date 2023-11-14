import { List, ListItem } from "@interlay/ui";
import { StyledWrapper } from "./Inscriptions.style";
import { useGetInscriptionIds } from "../../hooks/useGetInscriptionIds";
import { H2 } from "@interlay/ui";
import { Link } from "react-router-dom";
import { useBtcSnap } from "../../hooks/useBtcSnap";

const Inscriptions = (): JSX.Element => {
  const { bitcoinAddress } = useBtcSnap();
  const inscriptionIds = useGetInscriptionIds(bitcoinAddress);

  return (
    <StyledWrapper direction="column" gap="spacing4">
      <H2>Inscriptions</H2>
      <List>
        {inscriptionIds?.map((inscriptionId) => (
          <ListItem key={inscriptionId}>
            <Link to={`/inscription/${inscriptionId}`}>
              {inscriptionId}
            </Link>
          </ListItem>
        ))}
      </List>
    </StyledWrapper>
  );
};

export default Inscriptions;
