import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { QueryConfig } from "../types/query";
import { useAccount } from "./useAccount";
import { Inscription } from "../types/unisat";

const queryFn = async () => {
  const inscriptions = await window.unisat.getInscriptions(0, 100);

  return inscriptions.list.filter(
    (inscription) => inscription.contentType === "image/png"
  );
};

type UseGetNftsProps = QueryConfig<Inscription[], Error, Inscription[]>;

const useGetNfts = (props: UseGetNftsProps = {}) => {
  const account = useAccount();

  const query = useQuery(["nfts", account.data], queryFn, {
    ...props,
    enabled: !!account.data,
    onSuccess: (data) => {
      previousAccountRef.current = data;
    },
    refetchInterval: 60000,
  });

  const previousAccountRef = useRef<Inscription[]>();

  return {
    ...query,
    data: previousAccountRef.current,
  };
};

export { useGetNfts };
export type { UseGetNftsProps };
