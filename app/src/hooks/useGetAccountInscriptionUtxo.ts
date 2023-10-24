import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import api from "../api/api";
import { InscriptionUTXOData } from "../api/types";
import { QueryConfig } from "../types/query";
import { useAccount } from "./useAccount";

const queryFn = async (address: string): Promise<InscriptionUTXOData> => {
  const res = await api.unisat.getAddressInscriptionUTXO(address);

  return res.data.data;
};

type UseGetAccountInscriptionUtxoProps = QueryConfig<
  InscriptionUTXOData,
  Error,
  InscriptionUTXOData
> & {
  refetchInterval?: number;
};

const useGetAccountInscriptionUtxo = ({
  refetchInterval = 60000,
  ...props
}: UseGetAccountInscriptionUtxoProps = {}) => {
  const account = useAccount();

  const query = useQuery(
    ["inscription-utxo", account.data],
    () => queryFn(account.data as string),
    {
      ...props,
      refetchInterval,
      enabled: !!account.data,
      onSuccess: (data) => {
        previousAccountRef.current = data;
      },
    }
  );

  const previousAccountRef = useRef<InscriptionUTXOData>();

  return {
    ...query,
    data: previousAccountRef.current,
  };
};

export { useGetAccountInscriptionUtxo };
export type { UseGetAccountInscriptionUtxoProps };
