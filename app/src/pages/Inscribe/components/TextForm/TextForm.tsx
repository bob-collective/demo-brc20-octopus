import { useForm } from "@interlay/hooks";
import { Flex, Input } from "@interlay/ui";
import { useMutation } from "@tanstack/react-query";
import { AuthCTA } from "../../../../components/AuthCTA";
import { isFormDisabled } from "../../../../utils/validation";
import { submitOrdinal } from "../../unisat";

type TextFormData = {
  text: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type TextFormProps = {};

const TextForm = (): JSX.Element => {
  const mutation = useMutation({
    mutationFn: (_form: TextFormData) => Promise.resolve(),
  });

  const handleSubmit = async (values: TextFormData) => {
    const txid = await submitOrdinal(values.text);
    console.log(txid);
    mutation.mutate(values);
  };

  const form = useForm<TextFormData>({
    initialValues: {
      text: "",
    },
    onSubmit: handleSubmit,
    hideErrors: "untouched",
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
export type { TextFormData, TextFormProps };
