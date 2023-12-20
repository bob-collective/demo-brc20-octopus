import { Flex, P } from "@interlay/ui";
import { InscriptionData } from "../../Inscriptions";
import { StyledWrapper } from "./Inscription.style";

type Props = {
  inscription?: InscriptionData;
};

const Inscription = ({ inscription }: Props) => {
  if (!inscription) return;

  return (
    <StyledWrapper direction="column" gap="spacing4">
      <Flex direction="column">
        <iframe
          src={`https://testnet.ordinals.com/preview/${inscription.id}`}
          sandbox="allow-scripts"
          scrolling="no"
          loading="lazy"
          allow=""
          height={200}
        ></iframe>
      </Flex>
      <Flex direction="column" gap="spacing2">
        <P size="s" color="tertiary">
          Inscription ID
        </P>
        <P size="xs">{inscription.id}</P>
      </Flex>
    </StyledWrapper>
  );
};

export { Inscription };
