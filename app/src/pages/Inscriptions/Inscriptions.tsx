import { List, ListItem } from "@interlay/ui";
import { StyledWrapper } from "./Inscriptions.style";
import { useGetInscriptions } from "../../hooks/useGetInscriptions";
import { Link } from "react-router-dom";

const Inscriptions = (): JSX.Element => {
  const { data: inscriptions } = useGetInscriptions();
  console.log(inscriptions);

  return (
    <StyledWrapper direction="column" gap="spacing4">
      <List>
        {inscriptions?.list.map((inscription) => (
          <ListItem key={inscription.inscriptionId}>
            <Link to={`/inscription/${inscription.inscriptionId}`}>
              {inscription.inscriptionId}
            </Link>
          </ListItem>
        ))}
      </List>
    </StyledWrapper>
  );
};

export default Inscriptions;
