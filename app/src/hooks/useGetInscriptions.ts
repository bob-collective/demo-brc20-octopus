import { useQueries } from "@tanstack/react-query";
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

                decodedString = new TextDecoder().decode(body);
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

  const inscriptions = results.map((inscription) => inscription.data);

  return { inscriptions };
};

export { useGetInscriptions };
