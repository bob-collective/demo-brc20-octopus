import { useQuery } from "@tanstack/react-query";
// import { getOrdinalsUrl } from "../utils/ordinals-service";

const useGetInscriptionIds = (bitcoinAddress: string | undefined) => {
  // const ordinalsUrl = getOrdinalsUrl();
  // console.log("ordinalsUrl", ordinalsUrl, "bitcoinAddress", bitcoinAddress);

  const ordinalIds = useQuery({
    queryKey: ["inscription-ids", bitcoinAddress],
    enabled: !!bitcoinAddress,
    queryFn: async () =>
      await fetch(
        `https://open-api-testnet.unisat.io/v1/indexer/address/${bitcoinAddress}/inscription-utxo-data`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_UNISAT_API_KEY}`,
            Accept: "application/json",
          },
        }
      ).then((response) => response.json()),
  });

  return ordinalIds.data;
};

export { useGetInscriptionIds };
