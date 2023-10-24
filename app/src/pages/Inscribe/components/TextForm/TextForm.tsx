import { useForm } from "@interlay/hooks";
import { Flex, Input } from "@interlay/ui";
import { useMutation } from "@tanstack/react-query";
import { AuthCTA } from "../../../../components/AuthCTA";
import { isFormDisabled } from "../../../../utils/validation";
import { createOrdinal } from "../../../../utils/unisat";
import { useAccount } from "../../../../hooks/useAccount";
import { textFormSchema } from "../../../../utils/schemas";

type TextFormData = {
  text: string;
};

const TextForm = (): JSX.Element => {
  const { data: address } = useAccount();

  const mutation = useMutation({
    mutationFn: async (values: TextFormData) => {
      if (!address) return;
      const txid = await createOrdinal(address, values.text);
      return txid;
    },
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
