import { useForm } from "@interlay/hooks";
import { Flex, Input } from "@interlay/ui";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AuthCTA } from "../../../../components/AuthCTA";
import {
  TransferOrdSchemaParams,
  transferOrdSchema,
} from "../../../../utils/schemas";
import { isFormDisabled } from "../../../../utils/validation";
import { sendInscription } from "../../../../utils/btcsnap-signer";

type Props = {
  inscriptionId: string;
};

type TransferOrdFormData = {
  address: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type TransferOrdFormProps = {};

const TransferOrdForm = ({ inscriptionId }: Props): JSX.Element => {
  const [isWaitingUtxo, setWaitingUtxo] = useState(false);

  const inscribeMutation = useMutation({
    mutationFn: async (form: TransferOrdFormData) => {
      const txid = await sendInscription(form.address, inscriptionId);
      setWaitingUtxo(true);
      return txid;
    },
  });

  // useEffect(
  //   () => {
  //     const getInscription = async (txId: string) => {
  //       const txData = inscriptionsUtxo?.utxo.find(
  //         (item) => item.txid === txId
  //       );

  //       if (!txData) return;

  //       const [{ inscriptionId }] = txData.inscriptions;

  //       if (inscriptionId) {
  //         try {
  //           await sendInscriptionMutation.mutate(inscriptionId);

  //           form.resetForm();

  //           setWaitingUtxo(false);
  //         } catch (e) {
  //           setWaitingUtxo(false);
  //         }
  //       }
  //     };

  //     if (inscribeMutation.data && inscriptionsUtxo && isWaitingUtxo) {
  //       getTransaction(inscribeMutation.data);
  //     }
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   isWaitingUtxo ? [inscriptionsUtxo] : []
  // );

  const handleSubmit = (values: TransferOrdFormData) => {
    inscribeMutation.mutate(values);
  };

  const schemaParams: TransferOrdSchemaParams = {};

  const form = useForm<TransferOrdFormData>({
    initialValues: {
      address: "",
    },
    validationSchema: transferOrdSchema(schemaParams),
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

export { TransferOrdForm };
export type { TransferOrdFormData, TransferOrdFormProps };
