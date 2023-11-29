import { useEffect, useState } from "react";
import { FileTrigger, Button } from "react-aria-components";
import { useForm } from "@interlay/hooks";
import { Flex } from "@interlay/ui";
import { useMutation } from "@tanstack/react-query";
import { AuthCTA } from "../../../AuthCTA";
import { createOrdinal } from "../../../../utils/btcsnap-signer";
import { isFormDisabled } from "../../../../utils/validation";
import { useBtcSnap } from "../../../../hooks/useBtcSnap";
import { createImageInscription } from "../../../../utils/ordinals/commit";

type ImageFormData = {
  imageData: Buffer | undefined;
};

type Props = {
  onSuccess: () => void;
};

const ImageForm = ({ onSuccess }: Props): JSX.Element => {
  const [files, setFiles] = useState<File | undefined>();
  const [fileData, setFileData] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { bitcoinAddress } = useBtcSnap();

  const mutation = useMutation({
    mutationFn: async (values: ImageFormData) => {
      if (!bitcoinAddress || !values.imageData) return;

      createOrdinal(bitcoinAddress, createImageInscription(values.imageData));
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
    // validationSchema: textFormSchema(),
  });

  const isSubmitDisabled = isFormDisabled(form);

  useEffect(() => {
    if (!files) return;

    const reader = new FileReader();
    reader.readAsDataURL(files);

    reader.onload = (r) => {
      if (!r?.target?.result) return;

      const result = r.target.result as string;

      const buffer = Buffer.from(result.split(",")[1], "base64");

      // TODO: Set field value as data url and encode to buffer on submit
      // so that we can get rid of fileData state instance
      setFileData(result);
      form.setFieldValue("imageData", buffer);
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
            acceptedFileTypes={["image/*"]}
            onSelect={(e: FileList | null) => {
              if (!e) return;

              const files = Array.from(e);
              setFiles(files[0]);
            }}
          >
            <Button>Select a file</Button>
          </FileTrigger>
          {fileData && <img src={fileData} />}
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
