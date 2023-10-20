import { useForm } from "@interlay/hooks";
import { useMutation } from "@tanstack/react-query";
import Big from "big.js";
import { useEffect } from "react";
import { Bitcoin } from "../../../../constants/currencies";
import { useBalance } from "../../../../hooks/useBalance";
import { Amount } from "../../../../utils/amount";
import {
  TransferBrc20SchemaParams,
  transferBrc20Schema,
} from "../../../../utils/schemas";
import { Flex, Input, TokenInput } from "@interlay/ui";
import { isFormDisabled } from "../../../../utils/validation";
import { AuthCTA } from "../../../../components/AuthCTA";

type TransferBTCForm = {
  amount: string;
  address: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type TransferBtcFormProps = {};

const TransferBtcForm = (): JSX.Element => {
  const { data: balance } = useBalance();

  const mutation = useMutation({
    mutationFn: (form: TransferBTCForm) =>
      window.unisat.sendBitcoin(
        form.address,
        new Amount(Bitcoin, form.amount, true).toAtomic()
      ),
  });

  const handleSubmit = (values: TransferBTCForm) => {
    mutation.mutate(values);
  };

  const inputBalance = balance
    ? new Amount(Bitcoin, balance.confirmed).toBig()
    : new Big(0);

  const schemaParams: TransferBrc20SchemaParams = {
    amount: {
      maxAmount: inputBalance !== undefined ? inputBalance : undefined,
    },
  };

  const form = useForm<TransferBTCForm>({
    initialValues: {
      amount: "",
      address: "",
    },
    validationSchema: transferBrc20Schema(schemaParams),
    onSubmit: handleSubmit,
    hideErrors: "untouched",
  });

  useEffect(() => {
    if (!balance) return;

    form.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance]);

  const isSubmitDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex marginTop="spacing4" direction="column" gap="spacing8">
        <Flex direction="column" gap="spacing4">
          <TokenInput
            type="fixed"
            label="Amount"
            ticker="BTC"
            balance={inputBalance.toString()}
            valueUSD={0}
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

export { TransferBtcForm };
export type { TransferBTCForm, TransferBtcFormProps };
