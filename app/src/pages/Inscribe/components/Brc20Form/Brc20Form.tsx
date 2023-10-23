import { useForm } from "@interlay/hooks";
import { Flex, Input, NumberInput } from "@interlay/ui";
import { useMutation } from "@tanstack/react-query";
import { AuthCTA } from "../../../../components/AuthCTA";
import { useAccount } from "../../../../hooks/useAccount";
import { brc20FormSchema } from "../../../../utils/schemas";
import { isFormDisabled } from "../../../../utils/validation";

type Brc20FormData = {
  ticker: string;
  amount: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type Brc20FormProps = {};

const Brc20Form = (): JSX.Element => {
  const { data: address } = useAccount();

  const mutation = useMutation({
    mutationFn: async (values: Brc20FormData) => {
      if (!address) return;

      // const signer = new UniSatSigner();

      // const tx = await createOrdinal(signer, address, values.text);

      // const res = await fetch("https://blockstream.info/testnet/api/tx", {
      //   method: "POST",
      //   body: tx.toHex(),
      // });
      // const txid = await res.text();
      // return txid;
    },
  });

  const handleSubmit = async (values: Brc20FormData) => {
    mutation.mutate(values);
  };

  const form = useForm<Brc20FormData>({
    initialValues: {
      ticker: "",
      amount: "",
    },
    onSubmit: handleSubmit,
    hideErrors: "untouched",
    validationSchema: brc20FormSchema(),
  });

  const isSubmitDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex marginTop="spacing4" direction="column" gap="spacing8">
        <Flex direction="column" gap="spacing2">
          <Input
            label="Tick"
            placeholder="Enter tick"
            {...form.getFieldProps("ticker")}
          />
          <NumberInput
            label="Amount"
            placeholder="Enter amount"
            {...form.getFieldProps("amount")}
          />
        </Flex>
        <AuthCTA
          loading={mutation.isLoading}
          disabled={isSubmitDisabled}
          size="large"
          type="submit"
          fullWidth
        >
          Mint
        </AuthCTA>
      </Flex>
    </form>
  );
};

export { Brc20Form };
export type { Brc20FormData, Brc20FormProps };
