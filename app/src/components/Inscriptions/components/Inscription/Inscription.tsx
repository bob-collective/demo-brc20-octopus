import { Card, Dd, Dl, DlGroup, Dt } from "@interlay/ui";
import { StyledWrapper } from "./Inscription.style";
import { useEffect } from "react";
import { TESTNET_ORD_BASE_PATH } from "../../../../utils/ordinals-client";
import { DefaultElectrsClient } from "@gobob/bob-sdk";
import { getInscriptionFromId } from "../../../../utils/inscription";

type Props = {
  id?: string;
};

const Inscription = ({ id }: Props) => {
  useEffect(() => {
    const getInscription = async () => {
      try {
        const res = await fetch(`${TESTNET_ORD_BASE_PATH}/content/${id}`);

        await res.json();

        // const json = await res.json();

        // if (json.p && json.op && json.tick && json.amt) {
        //   return setTransferable(false);
        // }

        // return setTransferable(true);
      } catch (e) {
        try {
          const res = await fetch(`${TESTNET_ORD_BASE_PATH}/content/${id}`);

          await res.text();
        } catch (e) {
          // return setTransferable(false);
        }
        try {
          const electrsClient = new DefaultElectrsClient("testnet");
          const inscription = await getInscriptionFromId(electrsClient, id!);
          const body = Buffer.concat(inscription.body);

          const decodedString = new TextDecoder().decode(body);

          return decodedString;
        } catch (e) {
          console.log(e);
        }
      }
    };

    if (id) {
      getInscription();
    }
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
