import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import api from "../api/api";
import { BRC20List } from "../api/types";
import { QueryConfig } from "../types/query";

const queryFn = async (
  type: "all" | "in-progress" | "completed"
): Promise<BRC20List> => {
  const res = await api.unisat.getBrc20List(type);

  return res.data.data;
};
type UseGetBrc20ListProps = QueryConfig<BRC20List, Error, BRC20List>;

const useGetBrc20List = (props: UseGetBrc20ListProps = {}) => {
  const [type, setType] = useState<"all" | "in-progress" | "completed">("all");

  const query = useQuery(["brc20-list", type], () => queryFn(type), {
    ...props,
    onSuccess: (data) => {
      previousAccountRef.current = data;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const previousAccountRef = useRef<BRC20List>();

  return {
    ...query,
    type,
    setType,
    data: previousAccountRef.current,
  };
};

export { useGetBrc20List };
export type { UseGetBrc20ListProps };
