import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { QueryConfig } from "../types/query";
import { useAccount } from "./useAccount";

type Balance = Record<string, number>;

const queryFn = async () => {
  const a = await window.unisat.getInscriptions(0, 20);

  const content = await Promise.all(
    a.list.map((item) =>
      fetch(`https://testnet.ordinals.com/content/${item.inscriptionId}`).then(
        (res) => res.json()
      )
    )
  );

  return content.reduce((acc, val) => {
    if (val.p !== "brc-20") return;

    const { tick, amt } = val;

    const currentBalance = acc[tick];
    const newAmt = Number(amt);

    if (!currentBalance) {
      return {
        ...acc,
        [tick]: newAmt,
      };
    }

    return {
      ...acc,
      [val.tick]: currentBalance + newAmt,
    };
  }, {});
};

type UseBrc20BalancesProps = QueryConfig<Balance, Error, Balance>;

const useBrc20Balances = (props: UseBrc20BalancesProps = {}) => {
  const account = useAccount();

  const query = useQuery(["balances", account.data], queryFn, {
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

export { useBrc20Balances };
export type { UseBrc20BalancesProps };
