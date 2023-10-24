import { useForm } from "@interlay/hooks";
import { Flex, Input, TokenInput } from "@interlay/ui";
import { mergeProps } from "@react-aria/utils";
import { useMutation } from "@tanstack/react-query";
import Big from "big.js";
import { Key, useEffect, useState } from "react";
import { AuthCTA } from "../../../../components/AuthCTA";
import { Bitcoin } from "../../../../constants/currencies";
import { useAccount } from "../../../../hooks/useAccount";
import { useBrc20Balances } from "../../../../hooks/useBrc20Balances";
import { Amount } from "../../../../utils/amount";
import {
  TransferBTCSchemaParams,
  transferBrc20Schema,
} from "../../../../utils/schemas";
import { createOrdinal } from "../../../../utils/unisat";
import { isFormDisabled } from "../../../../utils/validation";
import { useGetAccountInscriptionUtxo } from "../../../../hooks/useGetAccountInscriptionUtxo";

type TransferBrc20FormData = {
  ticker: string;
  amount: string;
  address: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type TransferBrc20FormProps = {};

const TransferBrc20Form = (): JSX.Element => {
  const [ticker, setTicker] = useState("");
  const [isWaitingUtxo, setWaitingUtxo] = useState(false);

  const { data: address } = useAccount();
  const { data: balances } = useBrc20Balances();
  const { data: inscriptionsUtxo } = useGetAccountInscriptionUtxo({
    refetchInterval: isWaitingUtxo ? 2000 : 60000,
  });

  const inscribeMutation = useMutation({
    mutationFn: async (form: TransferBrc20FormData) => {
      if (!address) return;

      const inscriptionObj = {
        p: "brc-20",
        op: "transfer",
        tick: form.ticker,
        amt: form.amount,
      };

      const txid = await createOrdinal(
        address,
        JSON.stringify(inscriptionObj),
      );

      setWaitingUtxo(true);

      return txid;
    },
  });

  const sendInscriptionMutation = useMutation({
    mutationFn: async (inscriptionId: string) => {
      return window.unisat.sendInscription(form.values.address, inscriptionId);
    },
  });

  useEffect(
    () => {
      const getInscription = async (txId: string) => {
        const txData = inscriptionsUtxo?.utxo.find(
          (item) => item.txid === txId
        );

        if (!txData) return;

        const [{ inscriptionId }] = txData.inscriptions;

        if (inscriptionId) {
          try {
            await sendInscriptionMutation.mutate(inscriptionId);

            form.resetForm();

            setWaitingUtxo(false);
          } catch (e) {
            setWaitingUtxo(false);
          }
        }
      };

      if (inscribeMutation.data && inscriptionsUtxo && isWaitingUtxo) {
        getInscription(inscribeMutation.data);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    isWaitingUtxo ? [inscriptionsUtxo] : []
  );

  const handleSubmit = (values: TransferBrc20FormData) => {
    inscribeMutation.mutate(values);
  };

  const inputBalance =
    ticker && balances
      ? new Amount(
          Bitcoin,
          balances.detail.find((balance) => balance.ticker === ticker)
            ?.availableBalance || 0,
          true
        ).toBig()
      : new Big(0);

  const schemaParams: TransferBTCSchemaParams = {
    amount: {
      maxAmount: inputBalance !== undefined ? inputBalance : undefined,
    },
  };

  const form = useForm<TransferBrc20FormData>({
    initialValues: {
      ticker: "",
      amount: "",
      address: "",
    },
    validationSchema: transferBrc20Schema(schemaParams),
    onSubmit: handleSubmit,
    hideErrors: "untouched",
  });

  useEffect(() => {
    if (!balances) return;

    form.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances]);

  const isLoading =
    inscribeMutation.isLoading ||
    isWaitingUtxo ||
    sendInscriptionMutation.isLoading;

  const isSubmitDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex marginTop="spacing4" direction="column" gap="spacing8">
        <Flex direction="column" gap="spacing4">
          <TokenInput
            type="selectable"
            label="Offer"
            balance={inputBalance?.toString()}
            valueUSD={0}
            selectProps={mergeProps(
              {
                items: (balances?.detail || []).map((balance) => ({
                  value: balance.ticker,
                  balance: balance.availableBalance,
                  balanceUSD: 0,
                })),
                onSelectionChange: (key: Key) => setTicker(key as string),
              },
              form.getSelectFieldProps("ticker")
            )}
            {...form.getTokenFieldProps("amount")}
          />
          <Input
            label="Bitcoin Address"
            placeholder="Enter your bitcoin address"
            {...form.getFieldProps("address")}
          />
        </Flex>

        <AuthCTA
          loading={isLoading}
          disabled={isSubmitDisabled}
          size="large"
          type="submit"
          fullWidth
        >
          Transfer
        </AuthCTA>
      </Flex>
    </form>
  );
};

export { TransferBrc20Form };
export type { TransferBrc20FormData, TransferBrc20FormProps };
