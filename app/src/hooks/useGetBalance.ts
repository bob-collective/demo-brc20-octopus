import { useQuery } from "@tanstack/react-query";
import { DefaultElectrsClient } from "@gobob/bob-sdk";
import { getAddressUtxos } from "../utils/sdk-helpers";
import { useLocalStorage } from "react-use";
import { LocalStorageKey } from "./useLocalStorage";
import { BITCOIN_NETWORK } from "../utils/config";

const electrs = new DefaultElectrsClient(BITCOIN_NETWORK);

const satsToBtc = (sats: number) => Number(sats) / 10 ** 8;

const queryFn = async (bitcoinAddress: string) => {
  const utxos = await getAddressUtxos(electrs, bitcoinAddress);
  const balance = utxos
    .map((utxo) => utxo.value)
    .reduce((sum, value) => sum + value, 0);

  return balance;
};

const useGetBalance = () => {
  // TODO: Why is this type unknown?
  const [bitcoinAddress] = useLocalStorage(LocalStorageKey.DERIVED_BTC_ADDRESS);

  const { data } = useQuery(
    ["sats-balance", bitcoinAddress],
    async () => await queryFn(bitcoinAddress as string),
    {
      enabled: !!bitcoinAddress,
      refetchInterval: 60000,
    }
  );

  return {
    data: data ? satsToBtc(data) : 0,
  };
};

export { useGetBalance };
