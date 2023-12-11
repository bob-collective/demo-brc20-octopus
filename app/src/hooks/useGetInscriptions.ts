/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueries } from "@tanstack/react-query";
import { fileTypeFromBuffer } from "file-type";
import { getInscriptionFromId } from "../utils/inscription";
import { DefaultElectrsClient } from "@gobob/bob-sdk";
import { BITCOIN_NETWORK, getOrdinalsUrl } from "../utils/config";

const electrsClient = new DefaultElectrsClient(BITCOIN_NETWORK);

const getConfirmedInscriptionContent = async (
  response: Response,
  contentType: string
) => {
  let content;

  if (contentType === "text") {
    content = await response.text();
  } else {
    const getImageData = async () => {
      const reader = new FileReader();
      const blob = await response.blob();

      reader.readAsDataURL(blob);

      await new Promise<void>((resolve) => (reader.onload = () => resolve()));
      return reader.result;
    };

    content = await getImageData();
  }

  return content;
};

const getUnconfirmedInscription = async (id: string) => {
  const inscription = await getInscriptionFromId(electrsClient, id!);

  const body = Buffer.concat(inscription.body);

  const fileType = await fileTypeFromBuffer(body);
  const unconfirmedContentType = !fileType ? "text" : "image";

  const decodedInscriptionData =
    unconfirmedContentType === "text"
      ? new TextDecoder().decode(body)
      : URL.createObjectURL(new Blob([body], { type: "image/png" }));

  return { unconfirmedContentType, decodedInscriptionData };
};

const useGetInscriptions = (inscriptionIds: string[]) => {
  const results = useQueries({
    queries: inscriptionIds.map((id) => {
      return {
        queryKey: ["ordinal", id],
        queryFn: async () =>
          await fetch(`${getOrdinalsUrl()}/content/${id}`).then(
            async (response) => {
              const isConfirmed = response.ok;

              let contentType;
              let content;

              if (isConfirmed) {
                contentType = response?.headers
                  ?.get("Content-Type")
                  ?.includes("text")
                  ? "text"
                  : "image";

                content = await getConfirmedInscriptionContent(
                  response,
                  contentType
                );
              } else {
                const { unconfirmedContentType, decodedInscriptionData } =
                  await getUnconfirmedInscription(id);

                content = decodedInscriptionData;
                contentType = unconfirmedContentType;
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
