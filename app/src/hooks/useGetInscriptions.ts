import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { QueryConfig } from "../types/query";
import { getInscriptionsResult } from "../types/unisat";
import { useConnectMetamask } from "./useConnectMetamask";

const queryFn = async () => console.log("log");

type UseGetInscriptionsProps = QueryConfig<
  getInscriptionsResult,
  Error,
  getInscriptionsResult
>;

const useGetInscriptions = (props: UseGetInscriptionsProps = {}) => {
  const { bitcoinAddress } = useConnectMetamask();

  const query = useQuery(["inscriptions", bitcoinAddress], queryFn, {
    ...props,
    enabled: false,
    onSuccess: (data) => {
      previousAccountRef.current = data;
    },
    refetchInterval: 60000,
  });

  const previousAccountRef = useRef<getInscriptionsResult>();

  return {
    ...query,
    data: previousAccountRef.current,
  };
};

export { useGetInscriptions };
export type { UseGetInscriptionsProps };
