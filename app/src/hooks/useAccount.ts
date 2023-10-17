import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { QueryConfig } from "../types/query";

const queryFn = async () => window.unisat.getAccounts();

type UseAccountProps = QueryConfig<string, Error, string>;

const useAccount = (props: UseAccountProps = {}) => {
  const query = useQuery(["account"], queryFn, {
    ...props,
    onSuccess: ([data]) => {
      previousAccountRef.current = data;
    },
  });

  const previousAccountRef = useRef<string>();

  useEffect(() => {
    window.unisat.on("accountsChanged", () => query.refetch());

    return () => {
      window.unisat.removeListener("accountsChanged", () => query.refetch());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...query,
    data: previousAccountRef.current,
  };
};

export { useAccount };
export type { UseAccountProps };
