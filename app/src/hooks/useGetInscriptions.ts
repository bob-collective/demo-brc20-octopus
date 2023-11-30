/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueries } from "@tanstack/react-query";
import { TESTNET_ORD_BASE_PATH } from "../utils/ordinals-client";
import { getInscriptionFromId } from "../utils/inscription";
import { DefaultElectrsClient } from "@gobob/bob-sdk";

const electrsClient = new DefaultElectrsClient("testnet");

const getInscriptionContent = async (
  response: Response,
  contentType: string
) => {
  let content;

  if (contentType === "text") {
    content = await response.text();
  } else {
    const convert2DataUrl = async () => {
      const reader = new FileReader();
      const blob = await response.blob();

      reader.readAsDataURL(blob);
      await new Promise<void>((resolve) => (reader.onload = () => resolve()));
      return reader.result;
    };

    content = await convert2DataUrl();
  }

  return content;
};

const useGetInscriptions = (inscriptionIds: string[]) => {
  const results = useQueries({
    queries: inscriptionIds.map((id) => {
      return {
        queryKey: ["ordinal", id],
        queryFn: async () =>
          await fetch(`${TESTNET_ORD_BASE_PATH}/content/${id}`).then(
            async (response) => {
              const isConfirmed = response.ok;

              const contentType = response?.headers
                ?.get("Content-Type")
                ?.includes("text")
                ? "text"
                : "image";

              let content;

              if (isConfirmed) {
                content = await getInscriptionContent(response, contentType);
              }

              if (!isConfirmed) {
                console.log("not getting here");
                const inscription = await getInscriptionFromId(
                  electrsClient,
                  id!
                );
                const body = Buffer.concat(inscription.body);

                const decodedString = new TextDecoder().decode(body);
                content = decodedString;
              }

              return {
                content,
                contentType,
                id,
                isConfirmed,
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
