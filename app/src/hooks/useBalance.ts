import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { QueryConfig } from "../types/query";
import { useAccount } from "./useAccount";
import { Balance } from "../types/unisat";

const queryFn = async () => window.unisat.getBalance();

type UseBalanceProps = QueryConfig<Balance, Error, Balance>;

const useBalance = (props: UseBalanceProps = {}) => {
  const account = useAccount();

  const query = useQuery(["sats-balance", account.data], queryFn, {
    ...props,
    enabled: !!account.data,
    onSuccess: (data) => {
      previousAccountRef.current = data;
    },
    refetchInterval: 60000,
  });

  const previousAccountRef = useRef<Balance>();

  return {
    ...query,
    data: previousAccountRef.current,
  };
};

export { useBalance };
export type { UseBalanceProps };
