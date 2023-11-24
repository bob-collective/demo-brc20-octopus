import { useQuery } from "@tanstack/react-query";
import { DefaultOrdinalsClient } from "../utils/ordinals-client";
import { DefaultElectrsClient } from "@gobob/bob-sdk";
import { getInscriptionIds } from "../utils/sdk-helpers";

const electrsClient = new DefaultElectrsClient("testnet");
const ordinalsClient = new DefaultOrdinalsClient("testnet");

const useGetInscriptionIds = (bitcoinAddress: string | undefined) => {
  const { data } = useQuery({
    queryKey: ["inscription-ids", bitcoinAddress],
    enabled: !!bitcoinAddress,
    queryFn: async () => {
      return getInscriptionIds(electrsClient, ordinalsClient, bitcoinAddress!);
    },
    refetchInterval: 500,
  });

  return { data };
};

export { useGetInscriptionIds };
