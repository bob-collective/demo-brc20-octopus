import { useQuery } from "@tanstack/react-query";
import { getOrdinalsUrl } from "../utils/ordinals-service";

const useGetInscriptionIds = (bitcoinAddress: string | undefined) => {
  const ordinalsUrl = getOrdinalsUrl();
  console.log("ordinalsUrl", ordinalsUrl, "bitcoinAddress", bitcoinAddress);

  const ordinalIds = useQuery({
    queryKey: ["inscription-ids", bitcoinAddress],
    enabled: !!bitcoinAddress,
    queryFn: async () =>
      await fetch(`${ordinalsUrl}/address/${bitcoinAddress}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }).then((response) => response.json()),
  });

  return ordinalIds.data;
};

export { useGetInscriptionIds };
