import { Card, Dd, Dl, DlGroup, Dt } from "@interlay/ui";
import { StyledWrapper } from "./Inscription.style";
import { useEffect, useState } from "react";
import { TESTNET_ORD_BASE_PATH } from "../../../../utils/ordinals-client";
import { DefaultElectrsClient } from "@gobob/bob-sdk";
import { getInscriptionFromId } from "../../../../utils/inscription";
import { shortAddress } from "../../../../utils/format";

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

        // TODO: Recreate script—move this elsewhere
        const getIframeSrc = () => {
          return `
            <html lang="en"><head>
              <meta charset="utf-8">
              <meta name="format-detection" content="telephone=no">
              <style>
                html {
                  background-color: #131516;
                  color: white;
                  font-size: 16px;
                  height: 100%;
                  line-height: 1;
                }
                
                body {
                  display: grid;
                  grid-template: 1fr / 1fr;
                  height: 100%;
                  margin: 0;
                  place-items: center;
                }
                
                pre {
                  margin: 0;
                }
                
                body > * {
                  grid-column: 1 / 1;
                  grid-row: 1 / 1;
                }
                
                body > pre {
                  opacity: 0;
                }
              </style>              
            </head>
            <body>
              <pre style="font-size: min(5.2598vw, 95vh); opacity: 1;">${decodedString}</pre>
              <noscript>
                <pre>${decodedString}</pre>
              </noscript>
            </body>
          </html>`;
        };

        const iframeSrc = getIframeSrc();

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
