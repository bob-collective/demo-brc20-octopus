import { useForm } from "@interlay/hooks";
import { Flex, Input } from "@interlay/ui";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AuthCTA } from "../../../AuthCTA";
import { transferOrdinalSchema } from "../../../../utils/schemas";
import { isFormDisabled } from "../../../../utils/validation";
import { sendInscription } from "../../../../utils/btcsnap-signer";

type Props = {
  inscriptionId: string;
  onSuccess: () => void;
};

type TransferOrdinalFormData = {
  address: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type TransferOrdinalFormProps = {};

const TransferOrdinalForm = ({
  inscriptionId,
  onSuccess,
}: Props): JSX.Element => {
  const [error, setError] = useState<string>("");
  const [isWaitingUtxo, setWaitingUtxo] = useState(false);

  const inscribeMutation = useMutation({
    mutationFn: async (form: TransferOrdinalFormData) => {
      const txid = await sendInscription(form.address, inscriptionId);
      setWaitingUtxo(false);
      return txid;
    },
    onError: (e) => {
      console.error(e);
      setError(
        "There was a problem inscribing your ordinal. Do you have enough BTC?"
      );
    },
    onSuccess: () => onSuccess(),
  });

  const handleSubmit = (values: TransferOrdinalFormData) => {
    inscribeMutation.mutate(values);
  };

  const form = useForm<TransferOrdinalFormData>({
    initialValues: {
      address: "",
    },
    validationSchema: transferOrdinalSchema(),
    onSubmit: handleSubmit,
    hideErrors: "untouched",
  });

  const isLoading = inscribeMutation.isLoading || isWaitingUtxo;

  const isSubmitDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex marginTop="spacing4" direction="column" gap="spacing8">
        <Flex direction="column" gap="spacing4">
          <Input
            label="Bitcoin Address"
            placeholder="Enter the bitcoin address"
            {...form.getFieldProps("address")}
            errorMessage={error}
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

export { TransferOrdinalForm };
export type { TransferOrdinalFormData, TransferOrdinalFormProps };
