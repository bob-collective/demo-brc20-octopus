import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import list from "../constants/brc20-list";
import { QueryConfig } from "../types/query";

const queryFn = () => list.data.detail;

type UseGetBrc20ListProps = QueryConfig<
  ReturnType<typeof queryFn>,
  Error,
  ReturnType<typeof queryFn>
>;

const useGetBrc20List = (props: UseGetBrc20ListProps = {}) => {
  const query = useQuery(["brc20-list"], queryFn, {
    ...props,
    onSuccess: (data) => {
      previousAccountRef.current = data;
    },
    refetchInterval: 60000,
  });

  const previousAccountRef = useRef<ReturnType<typeof queryFn>>();

  return {
    ...query,
    data: previousAccountRef.current,
  };
};

export { useGetBrc20List };
export type { UseGetBrc20ListProps };
