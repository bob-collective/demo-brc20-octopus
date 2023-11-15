import { useQuery } from "@tanstack/react-query";
import { DefaultElectrsClient } from "@gobob/bob-sdk";
import { getAddressUtxos } from "../utils/sdk-helpers";
import { useBtcSnap } from "./useBtcSnap";

const queryFn = async () => {
  const electrs = new DefaultElectrsClient("testnet");
  const utxos = await getAddressUtxos(
    electrs,
    "tb1q7fhcdqszmwqzk75p9f43kz6zt4jhjx6e5edfph"
  );
  const balance = utxos
    .map((utxo) => utxo.value)
    .reduce((sum, value) => sum + value, 0);

  return balance;
};

const useGetBalance = () => {
  const { bitcoinAddress } = useBtcSnap();

  const query = useQuery(["sats-balance", bitcoinAddress], queryFn, {
    enabled: !!bitcoinAddress,
    refetchInterval: 60000,
  });

  return {
    ...query,
  };
};

export { useGetBalance };
