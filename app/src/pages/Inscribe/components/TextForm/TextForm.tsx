import { useForm } from "@interlay/hooks";
import { Flex, Input } from "@interlay/ui";
import { useMutation } from "@tanstack/react-query";
import { AuthCTA } from "../../../../components/AuthCTA";
import { textFormSchema } from "../../../../utils/schemas";
import { isFormDisabled } from "../../../../utils/validation";

type TextFormData = {
  text: string;
  address: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type TextFormProps = {};

const TextForm = (): JSX.Element => {
  const mutation = useMutation({
    mutationFn: (form: TextFormData) => 2 as Promise<number>,
  });

  const handleSubmit = (values: TextFormData) => {
    mutation.mutate(values);
  };

  const form = useForm<TextFormData>({
    initialValues: {
      text: "",
      address: "",
    },
    validationSchema: textFormSchema(),
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
          Inscribe
        </AuthCTA>
      </Flex>
    </form>
  );
};

export { TextForm };
export type { TextFormData, TextFormProps };
