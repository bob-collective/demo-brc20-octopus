import * as yup from "yup";
import {
  MaxAmountValidationParams,
  MinAmountValidationParams,
} from "./yup.custom";

export type TransferBTCSchemaParams = {
  amount?: Partial<MaxAmountValidationParams & MinAmountValidationParams>;
};

export const transferBtcSchema = (params: TransferBTCSchemaParams) => {
  return yup.object().shape({
    amount: yup
      .string()
      .requiredAmount("transfer")
      .minAmount(params.amount as MinAmountValidationParams, "transfer")
      .maxAmount(params.amount as MaxAmountValidationParams, "transfer"),
    address: yup.string().required("Please enter bitcoin address").address(),
  });
};

export type TransferBrc20SchemaParams = {
  amount?: Partial<MaxAmountValidationParams & MinAmountValidationParams>;
};

export const transferBrc20Schema = (params: TransferBTCSchemaParams) => {
  return yup.object().shape({
    amount: yup
      .string()
      .requiredAmount("transfer")
      .minAmount(params.amount as MinAmountValidationParams, "transfer")
      .maxAmount(params.amount as MaxAmountValidationParams, "transfer"),
    address: yup.string().required("Please enter bitcoin address").address(),
    ticker: yup.string().required(),
  });
};

export const transferInscriptionSchema = () => {
  return yup.object().shape({
    address: yup.string().required("Please enter bitcoin address").address(),
  });
};

export const textFormSchema = () => {
  return yup.object().shape({
    text: yup.string().required("Please enter text to be inscribed"),
  });
};

export const brc20FormSchema = () => {
  return yup.object().shape({
    amount: yup.string().required("Please enter amount to be minted"),
    ticker: yup
      .string()
      .required("Please enter tick to be minted")
      .min(4, "Please enter tick with exactly 4 characters")
      .max(4, "Please enter tick with exactly 4 characters"),
  });
};
