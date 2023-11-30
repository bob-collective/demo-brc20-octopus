import { useForm } from "@interlay/hooks";
import { Flex, Input } from "@interlay/ui";
import { useMutation } from "@tanstack/react-query";
import { AuthCTA } from "../../../AuthCTA";
import { isFormDisabled } from "../../../../utils/validation";
import { createOrdinal } from "../../../../utils/btcsnap-signer";
import { textFormSchema } from "../../../../utils/schemas";
import { useBtcSnap } from "../../../../hooks/useBtcSnap";
import { useState } from "react";
import { createTextInscription } from "../../../../utils/ordinals/commit";

type TextFormData = {
  text: string;
};

type Props = {
  onSuccess: () => void;
};

const TextForm = ({ onSuccess }: Props): JSX.Element => {
  const [error, setError] = useState<string>("");

  const { bitcoinAddress } = useBtcSnap();

  const mutation = useMutation({
    mutationFn: async (values: TextFormData) => {
      if (!bitcoinAddress) return;
      await createOrdinal(bitcoinAddress, createTextInscription(values.text));
    },
    onError: (e) => {
      console.error(e);
      setError(
        "There was a problem inscribing your ordinal. Do you have enough BTC?"
      );
    },
    onSuccess: () => onSuccess(),
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
            errorMessage={error}
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
