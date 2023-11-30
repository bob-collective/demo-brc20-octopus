/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueries } from "@tanstack/react-query";
import { fileTypeFromBuffer } from "file-type";
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

              let contentType;
              let content;

              if (isConfirmed) {
                contentType = response?.headers
                  ?.get("Content-Type")
                  ?.includes("text")
                  ? "text"
                  : "image";

                content = await getInscriptionContent(response, contentType);
              }

              if (!isConfirmed) {
                const inscription = await getInscriptionFromId(
                  electrsClient,
                  id!
                );

                console.log(inscription.body);
                const body = Buffer.concat(inscription.body);

                const fileType = await fileTypeFromBuffer(body);
                contentType = !fileType ? "text" : "image";

                const decodedString =
                  contentType === "text"
                    ? new TextDecoder().decode(body)
                    : URL.createObjectURL(
                        new Blob([body], { type: "image/png" })
                      );

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
