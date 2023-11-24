import { useForm } from "@interlay/hooks";
import { useMutation } from "@tanstack/react-query";
import Big from "big.js";
import { Bitcoin } from "../../../../constants/currencies";
import { Amount } from "../../../../utils/amount";
import {
  // TransferBtcSchemaParams,
  transferBtcSchema,
} from "../../../../utils/schemas";
import { Flex, Input, TokenInput } from "@interlay/ui";
import { isFormDisabled } from "../../../../utils/validation";
import { AuthCTA } from "../../../AuthCTA";
import { BtcSnapSigner } from "../../../../utils/btcsnap-signer";
import { useGetBalance } from "../../../../hooks/useGetBalance";

type Props = {
  onSuccess: () => void;
};

type TransferBTCForm = {
  amount: string;
  address: string;
};

async function sendBitcoin(toAddress: string, amount: number): Promise<string> {
  const signer = new BtcSnapSigner();
  return signer.sendToAddress(toAddress, amount);
}

// eslint-disable-next-line @typescript-eslint/ban-types
type TransferBtcFormProps = {};

const TransferBtcForm = ({ onSuccess }: Props): JSX.Element => {
  const { data } = useGetBalance();

  const mutation = useMutation({
    mutationFn: (form: TransferBTCForm) =>
      sendBitcoin(
        form.address,
        new Amount(Bitcoin, form.amount, true).toAtomic()
      ),
    onSettled: () => onSuccess(),
  });

  const handleSubmit = (values: TransferBTCForm) => {
    mutation.mutate(values);
  };

  const inputBalance = Big(data);

  // const schemaParams: TransferBtcSchemaParams = {
  //   amount: {
  //     maxAmount: inputBalance !== undefined ? inputBalance : undefined,
  //   },
  // };

  const form = useForm<TransferBTCForm>({
    initialValues: {
      amount: "",
      address: "",
    },
    validationSchema: transferBtcSchema(),
    onSubmit: handleSubmit,
    hideErrors: "untouched",
  });

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
