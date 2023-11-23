import { useQuery } from "@tanstack/react-query";
import { DefaultOrdinalsClient } from "../utils/ordinals-client";
import { DefaultElectrsClient } from "@gobob/bob-sdk";
import { getInscriptionIds } from "../utils/sdk-helpers";

const useGetInscriptionIds = (bitcoinAddress: string | undefined) => {

  const ordinalIds = useQuery({
    queryKey: ["inscription-ids", bitcoinAddress],
    enabled: !!bitcoinAddress,
    queryFn: async () => {
      const electrsClient = new DefaultElectrsClient("testnet");
      const ordinalsClient = new DefaultOrdinalsClient("testnet");
      return getInscriptionIds(electrsClient, ordinalsClient, bitcoinAddress!);
    }
  });

  return ordinalIds.data;
};

export { useGetInscriptionIds };
