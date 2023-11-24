import { Card, Dd, Dl, DlGroup, Dt } from "@interlay/ui";
import { StyledWrapper } from "./Inscription.style";
import { useEffect, useState } from "react";
import { TESTNET_ORD_BASE_PATH } from "../../../../utils/ordinals-client";
import { DefaultElectrsClient } from "@gobob/bob-sdk";
import { getInscriptionFromId } from "../../../../utils/inscription";
import { shortAddress } from "../../../../utils/format";
import { getIframeSource } from "../../utils/getIframeSource";

type Props = {
  id?: string;
};

const electrsClient = new DefaultElectrsClient("testnet");

const Inscription = ({ id }: Props) => {
  const [pendingInscription, setPendingInscription] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const getInscription = async () => {
      const res = await fetch(`${TESTNET_ORD_BASE_PATH}/content/${id}`);

      if (!res.ok) {
        const inscription = await getInscriptionFromId(electrsClient, id!);
        const body = Buffer.concat(inscription.body);
        const decodedString = new TextDecoder().decode(body);

        const iframeSrc = getIframeSource(decodedString);

        setPendingInscription(iframeSrc);
      }
    };

    getInscription();
  }, [id]);

  return (
    <StyledWrapper direction="column" gap="spacing4">
      {pendingInscription ? (
        <iframe srcDoc={pendingInscription} loading="lazy" allow="" />
      ) : (
        <iframe
          src={`${TESTNET_ORD_BASE_PATH}/preview/${id}`}
          loading="lazy"
          allow=""
        ></iframe>
      )}
      <Card>
        <Dl>
          <DlGroup flex={1} justifyContent="space-between">
            <Dt size="s">
              {pendingInscription
                ? "Inscription Id (unconfirmed):"
                : "Inscription Id:"}
            </Dt>
            <Dd size="s">{shortAddress(id)}</Dd>
          </DlGroup>
        </Dl>
      </Card>
    </StyledWrapper>
  );
};

export { Inscription };
