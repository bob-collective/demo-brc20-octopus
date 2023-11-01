// import { List, ListItem } from "@interlay/ui";
import { StyledWrapper } from "./Inscriptions.style";
import { useGetInscriptionIds } from "../../hooks/useGetInscriptionIds";
import { H2 } from "@interlay/ui";
// import { Link } from "react-router-dom";

type Props = {
  bitcoinAddress?: string;
};

const Inscriptions = ({ bitcoinAddress }: Props): JSX.Element => {
  const inscriptionIds = useGetInscriptionIds(bitcoinAddress);
  console.log(inscriptionIds);

  return (
    <StyledWrapper direction="column" gap="spacing4">
      <H2>Inscriptions</H2>
      {/* <List>
        {inscriptionIds?.list.map((inscription) => (
          <ListItem key={inscription.inscriptionId}>
            <Link to={`/inscription/${inscription.inscriptionId}`}>
              {inscription.inscriptionId}
            </Link>
          </ListItem>
        ))}
      </List> */}
    </StyledWrapper>
  );
};

export default Inscriptions;
