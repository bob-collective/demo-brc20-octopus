import { useQueries } from "@tanstack/react-query";
import { fileTypeFromBuffer } from "file-type";
import { TESTNET_ORD_BASE_PATH } from "../utils/ordinals-client";
import { getInscriptionFromId } from "../utils/inscription";
import { DefaultElectrsClient } from "@gobob/bob-sdk";
import { getIframeSource } from "../components/Inscriptions/utils/getIframeSource";

const electrsClient = new DefaultElectrsClient("testnet");

const useGetInscriptions = (inscriptionIds: string[]) => {
  const results = useQueries({
    queries: inscriptionIds.map((id) => {
      return {
        queryKey: ["ordinal", id],
        queryFn: async () =>
          await fetch(`${TESTNET_ORD_BASE_PATH}/content/${id}`).then(
            async (response) => {
              const isConfirmed = response.ok;

              let decodedString;

              if (!isConfirmed) {
                const inscription = await getInscriptionFromId(
                  electrsClient,
                  id!
                );

                const body = Buffer.concat(inscription.body);
                const fileType = await fileTypeFromBuffer(body);

                if (!fileType) {
                  decodedString = new TextDecoder().decode(body);
                } else {
                  const imageUrl = URL.createObjectURL(
                    new Blob([body.buffer], { type: "image/png" } /* (1) */)
                  );
                  decodedString = `<img src="${imageUrl}" />`;
                }
              }
              return {
                id,
                isConfirmed,
                content: isConfirmed
                  ? `${TESTNET_ORD_BASE_PATH}/preview/${id}`
                  : getIframeSource(decodedString || ""),
              };
            }
          ),
        enabled: !!id,
      };
    }),
  });

  const inscriptions = results
    .filter((result) => result.data !== undefined)
    .map((inscription) => inscription.data);

  return { inscriptions };
};

export { useGetInscriptions };
