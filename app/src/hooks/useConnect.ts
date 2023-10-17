import { useMutation } from "@tanstack/react-query";
import { MutationConfig } from "../types/query";

const mutationFn = () => window.unisat.requestAccounts();

type UseConnectProps = MutationConfig<string[], Error, void>;

const useConnect = (props: UseConnectProps = {}) => {
  const mutation = useMutation(mutationFn, {
    mutationKey: ["connect"],
    ...props,
  });

  return {
    ...mutation,
    connect: () => mutation.mutate(),
  };
};

export { useConnect };
export type { UseConnectProps };
