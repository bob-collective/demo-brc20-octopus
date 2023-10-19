import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import api from "../api/api";
import { BRC20Summary } from "../api/types";
import { QueryConfig } from "../types/query";
import { useAccount } from "./useAccount";

const queryFn = async (address: string): Promise<BRC20Summary> => {
  const res = await api.unisat.getBrc20Summary(address);

  return res.data.data;
};

type UseGetBrc20SummaryProps = QueryConfig<BRC20Summary, Error, BRC20Summary>;

const useGetBrc20Summary = (props: UseGetBrc20SummaryProps = {}) => {
  const { data: address } = useAccount();

  const query = useQuery(
    ["brc20-summary", address],
    () => (address ? queryFn(address) : undefined),
    {
      ...props,
      enabled: !!address,
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

export { useGetBrc20Summary };
export type { UseGetBrc20SummaryProps };
