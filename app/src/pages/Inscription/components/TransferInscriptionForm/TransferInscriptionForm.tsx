import { useForm } from "@interlay/hooks";
import { Flex, Input } from "@interlay/ui";
import { useMutation } from "@tanstack/react-query";
import { AuthCTA } from "../../../../components/AuthCTA";
import { transferInscriptionSchema } from "../../../../utils/schemas";
import { isFormDisabled } from "../../../../utils/validation";

type TransferInscriptionFormData = {
  address: string;
};

type TransferInscriptionFormProps = { inscriptionId: string };

const TransferInscriptionForm = ({
  inscriptionId,
}: TransferInscriptionFormProps): JSX.Element => {
  const mutation = useMutation({
    mutationFn: (form: TransferInscriptionFormData) =>
      window.unisat.sendInscription(form.address, inscriptionId),
  });

  const handleSubmit = (values: TransferInscriptionFormData) => {
    mutation.mutate(values);
  };

  const form = useForm<TransferInscriptionFormData>({
    initialValues: {
      address: "",
    },
    validationSchema: transferInscriptionSchema(),
    onSubmit: handleSubmit,
    hideErrors: "untouched",
  });

  const isSubmitDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction="column" gap="spacing8">
        <Input
          label="Bitcoin Address"
          placeholder="Enter your bitcoin address"
          {...form.getFieldProps("address")}
        />
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

export { TransferInscriptionForm };
export type { TransferInscriptionFormData, TransferInscriptionFormProps };
