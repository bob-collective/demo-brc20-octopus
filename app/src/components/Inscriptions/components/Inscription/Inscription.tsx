import { Card, Dd, Dl, DlGroup, Dt } from "@interlay/ui";
import { StyledWrapper } from "./Inscription.style";
import { useEffect } from "react";
import { TESTNET_ORD_BASE_PATH } from "../../../../utils/ordinals-client";

type Props = {
  id?: string;
};

const Inscription = ({ id }: Props) => {
  useEffect(() => {
    if (!id) return;

    const getInscription = async () => {
      try {
        const res = await fetch(`${TESTNET_ORD_BASE_PATH}/content/${id}`);

        const json = await res.json();

        console.log(json);
      } catch (e) {
        try {
          const res = await fetch(`${TESTNET_ORD_BASE_PATH}/content/${id}`);

          await res.text();
        } catch (e) {
          console.log(e);
        }
      }
    };

    getInscription();
  }, [id]);

  return (
    <StyledWrapper direction="column" gap="spacing4">
      <iframe
        src={`${TESTNET_ORD_BASE_PATH}/preview/${id}`}
        sandbox="allow-scripts"
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
};

export { Inscription };
