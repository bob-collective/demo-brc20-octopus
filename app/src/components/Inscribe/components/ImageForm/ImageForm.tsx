import { useEffect, useState } from "react";
import { FileTrigger } from "react-aria-components";
import { useForm } from "@interlay/hooks";
import { Flex } from "@interlay/ui";
import { useMutation } from "@tanstack/react-query";
import { AuthCTA } from "../../../AuthCTA";
import { createOrdinal } from "../../../../utils/btcsnap-signer";
import { isFormDisabled } from "../../../../utils/validation";
import { useBtcSnap } from "../../../../hooks/useBtcSnap";
import { createImageInscription } from "../../../../utils/ordinals/commit";
import { StyledSelectFile } from "../../Inscribe.style";

type ImageFormData = {
  imageData: string | undefined;
};

type Props = {
  onSuccess: () => void;
};

const ImageForm = ({ onSuccess }: Props): JSX.Element => {
  const [files, setFiles] = useState<File | undefined>();
  const [error, setError] = useState<string>("");

  const { bitcoinAddress } = useBtcSnap();

  const mutation = useMutation({
    mutationFn: async (values: ImageFormData) => {
      if (!bitcoinAddress || !values.imageData) return;
      const buffer = Buffer.from(values.imageData.split(",")[1], "base64");

      await createOrdinal(bitcoinAddress, createImageInscription(buffer));
    },
    onError: (e) => {
      console.error(e);
      setError(
        "There was a problem inscribing your ordinal. Do you have enough BTC?"
      );
    },
    onSuccess: () => onSuccess(),
  });

  const handleSubmit = async (values: ImageFormData) => {
    mutation.mutate(values);
  };

  const form = useForm<ImageFormData>({
    initialValues: {
      imageData: undefined,
    },
    onSubmit: handleSubmit,
    hideErrors: "untouched",
  });

  const isSubmitDisabled = isFormDisabled(form);

  useEffect(() => {
    if (!files) return;

    const reader = new FileReader();
    reader.readAsDataURL(files);

    reader.onload = (r) => {
      if (!r?.target?.result) return;

      const result = r.target.result as string;

      form.setFieldValue("imageData", result);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(() => {
    if (!error) return;

    console.log(error);
  }, [error]);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex marginTop="spacing4" direction="column" gap="spacing8">
        <Flex direction="column" gap="spacing4">
          <FileTrigger
            acceptedFileTypes={["image/png", "image/jpg"]}
            onSelect={(e: FileList | null) => {
              if (!e) return;

              const files = Array.from(e);
              setFiles(files[0]);
            }}
          >
            <Flex justifyContent="center">
              <StyledSelectFile>Select a file</StyledSelectFile>
            </Flex>
          </FileTrigger>
          {form.values.imageData && (
            <img width="100%" src={form.values.imageData} />
          )}
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

export { ImageForm };
export type { ImageFormData };
