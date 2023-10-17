import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { QueryConfig } from "../types/query";

const queryFn = () => window.unisat.getAccounts();

type UseAccountProps = QueryConfig<string, Error, string>;

const useAccount = (props: UseAccountProps = {}) => {
  const query = useQuery(["account"], queryFn, props);

  const previousAccountRef = useRef<string>();

  useEffect(() => {
    previousAccountRef.current = query.data;
  }, [query.data]);

  useEffect(() => {
    window.unisat.on("accountsChanged", () => query.refetch());

    return () => {
      window.unisat.removeListener("accountsChanged", () => query.refetch());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...query,
  };
};

export { useAccount };
export type { UseAccountProps };
