import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { QueryConfig } from "../types/query";
import { useAccount } from "./useAccount";
import api from "../api/api";
import { BRC20Summary } from "../api/types";

const queryFn = async (address: string): Promise<BRC20Summary> => {
  const res = await api.unisat.getBrc20Summary(address);

  return res.data.data;
};

type UseBrc20BalancesProps = QueryConfig<BRC20Summary, Error, BRC20Summary>;

const useBrc20Balances = (props: UseBrc20BalancesProps = {}) => {
  const account = useAccount();

  const query = useQuery(
    ["balances", account.data],
    () => (account.data ? queryFn(account.data) : undefined),
    {
      ...props,
      enabled: !!account.data,
      onSuccess: (data) => {
        previousAccountRef.current = data;
      },
      refetchInterval: 60000,
    }
  );

  const previousAccountRef = useRef<BRC20Summary>();

  return {
    ...query,
    data: previousAccountRef.current,
  };
};

export { useBrc20Balances };
export type { UseBrc20BalancesProps };
