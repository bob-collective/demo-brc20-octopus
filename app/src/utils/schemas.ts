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
    ticker: yup.string().required(),
  });
};
