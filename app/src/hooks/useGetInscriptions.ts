import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { QueryConfig } from "../types/query";
import { useAccount } from "./useAccount";
import { getInscriptionsResult } from "../types/unisat";

const queryFn = async () => window.unisat.getInscriptions(0, 100);

type UseGetInscriptionsProps = QueryConfig<
  getInscriptionsResult,
  Error,
  getInscriptionsResult
>;

const useGetInscriptions = (props: UseGetInscriptionsProps = {}) => {
  const account = useAccount();

  const query = useQuery(["inscriptions", account.data], queryFn, {
    ...props,
    enabled: !!account.data,
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
