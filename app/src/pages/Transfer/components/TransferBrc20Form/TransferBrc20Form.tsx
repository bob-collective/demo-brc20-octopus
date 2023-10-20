import { useForm } from "@interlay/hooks";
import { Flex, Input, TokenInput } from "@interlay/ui";
import { mergeProps } from "@react-aria/utils";
import { useMutation } from "@tanstack/react-query";
import Big from "big.js";
import { Key, useEffect, useState } from "react";
import { AuthCTA } from "../../../../components/AuthCTA";
import { Bitcoin } from "../../../../constants/currencies";
import { useBrc20Balances } from "../../../../hooks/useBrc20Balances";
import { Amount } from "../../../../utils/amount";
import {
  TransferBTCSchemaParams,
  transferBtcSchema,
} from "../../../../utils/schemas";
import { isFormDisabled } from "../../../../utils/validation";

type TransferBrc20FormData = {
  ticker: string;
  amount: string;
  address: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type TransferBrc20FormProps = {};

const TransferBrc20Form = (): JSX.Element => {
  const [ticker, setTicker] = useState("");

  const { data: balances } = useBrc20Balances();

  const mutation = useMutation({
    mutationFn: (form: TransferBrc20FormData) =>
      window.unisat.sendBitcoin(
        form.address,
        new Amount(Bitcoin, form.amount, true).toAtomic()
      ),
  });

  const handleSubmit = (values: TransferBrc20FormData) => {
    mutation.mutate(values);
  };

  const inputBalance =
    ticker && balances
      ? new Amount(Bitcoin, balances[ticker], true).toBig()
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
    validationSchema: transferBtcSchema(schemaParams),
    onSubmit: handleSubmit,
    hideErrors: "untouched",
  });

  useEffect(() => {
    if (!balances) return;

    form.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances]);

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
                items: Object.entries(balances || []).map(
                  ([ticker, balance]) => ({
                    value: ticker,
                    balance: balance,
                    balanceUSD: 0,
                  })
                ),
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
          loading={mutation.isLoading}
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
