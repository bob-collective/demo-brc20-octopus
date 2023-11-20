import { useQuery } from "@tanstack/react-query";
import { DefaultOrdinalsClient } from "../utils/ordinals-client";
import { DefaultElectrsClient } from "@gobob/bob-sdk";
import { getAddressUtxos } from "../utils/sdk-helpers";

const useGetInscriptionIds = (bitcoinAddress: string | undefined) => {
  const ordinalIds = useQuery({
    queryKey: ["inscription-ids", bitcoinAddress],
    enabled: !!bitcoinAddress,
    queryFn: async () => {
      const electrs = new DefaultElectrsClient("testnet");
      const ordinals = new DefaultOrdinalsClient("testnet");
      const utxos = await getAddressUtxos(electrs, bitcoinAddress!);
      const inscriptionUtxos = await Promise.all(
        utxos.map((utxo) =>
          ordinals.getInscriptionFromUTXO(`${utxo.txid}:${utxo.vout}`)
        )
      );
      return inscriptionUtxos
        .map((inscriptionUtxo) => inscriptionUtxo.inscriptions)
        .flat();
    },
    refetchInterval: 600,
  });

  return ordinalIds.data;
};

export { useGetInscriptionIds };
