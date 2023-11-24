import { useForm } from "@interlay/hooks";
import { Flex, Input } from "@interlay/ui";
import { useMutation } from "@tanstack/react-query";
import { AuthCTA } from "../../../AuthCTA";
import { isFormDisabled } from "../../../../utils/validation";
import { createOrdinal } from "../../../../utils/btcsnap-signer";
import { textFormSchema } from "../../../../utils/schemas";
import { useBtcSnap } from "../../../../hooks/useBtcSnap";

type TextFormData = {
  text: string;
};

type Props = {
  onSuccess: () => void;
};

const TextForm = ({ onSuccess }: Props): JSX.Element => {
  const { bitcoinAddress } = useBtcSnap();

  const mutation = useMutation({
    mutationFn: async (values: TextFormData) => {
      if (!bitcoinAddress) return;
      await createOrdinal(bitcoinAddress, values.text);
    },
    onSettled: () => onSuccess(),
  });

  const handleSubmit = async (values: TextFormData) => {
    mutation.mutate(values);
  };

  const form = useForm<TextFormData>({
    initialValues: {
      text: "",
    },
    onSubmit: handleSubmit,
    hideErrors: "untouched",
    validationSchema: textFormSchema(),
  });

  const isSubmitDisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex marginTop="spacing4" direction="column" gap="spacing8">
        <Flex direction="column" gap="spacing4">
          <Input
            label="Text"
            placeholder="Enter text to be inscribed"
            {...form.getFieldProps("text")}
          />
        </Flex>

        <AuthCTA
          loading={mutation.isLoading}
          disabled={isSubmitDisabled}
          size="large"
          type="submit"
          fullWidth
        >
          Inscribe
        </AuthCTA>
      </Flex>
    </form>
  );
};

export { TextForm };
export type { TextFormData };
