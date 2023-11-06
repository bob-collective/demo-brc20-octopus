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
            Authorization: `Bearer d4126c66d843ad55c884ecbf0412bedaaae2aef40ddd4d24b6f6731eed7d1fb7`,
            Accept: "application/json",
          },
        }
      ).then((response) => response.json()),
  });

  return ordinalIds.data;
};

export { useGetInscriptionIds };
