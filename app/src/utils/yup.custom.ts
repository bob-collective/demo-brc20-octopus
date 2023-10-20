/* eslint-disable no-invalid-this */
import Big from 'big.js';
import * as yup from 'yup';
import { AnyObject, Maybe } from 'yup/lib/types';

import { isValidBTCAddress } from './validation';

yup.addMethod<yup.StringSchema>(yup.string, 'requiredAmount', function (action: string, customMessage?: string) {
  return this.transform((value) => (isNaN(value) ? undefined : value)).test('requiredAmount', (value, ctx) => {
    if (value === undefined) {
      const message = customMessage || `Please enter the amount to ${action}`;
      return ctx.createError({ message });
    }

    return true;
  });
});

type MaxAmountValidationParams = {
  maxAmount: Big;
};

yup.addMethod<yup.StringSchema>(
  yup.string,
  'maxAmount',
  function ({ maxAmount }: MaxAmountValidationParams, action?: string, customMessage?: string) {
    return this.test('maxAmount', (value, ctx) => {
      if (value === undefined) return true;

      const amount = new Big(value);

      if (amount.gt(maxAmount)) {
        const message = customMessage || `Amount to ${action} must be at most ${maxAmount.toString()}`;
        return ctx.createError({ message });
      }

      return true;
    });
  }
);

type MinAmountValidationParams = {
  minAmount?: Big;
};

yup.addMethod<yup.StringSchema>(
  yup.string,
  'minAmount',
  function ({ minAmount }: MinAmountValidationParams = {}, action: string, customMessage?: string) {
    return this.test('balance', (value, ctx) => {
      if (value === undefined) return true;

      const amount = new Big(value);

      if (!minAmount && !amount.gt(0)) {
        const message = customMessage || `Amount to ${action} must be greater than 0`;

        return ctx.createError({ message });
      }

      if (minAmount && amount.lt(minAmount)) {
        const message = customMessage || `Amount to ${action} must be at least ${minAmount.toString()}`;

        return ctx.createError({ message });
      }

      return true;
    });
  }
);

yup.addMethod<yup.StringSchema>(yup.string, 'address', function (customMessage?: string) {
  return this.test('address', (value, ctx) => {
    if (!value || !isValidBTCAddress(value)) {
      const message = customMessage || 'Please enter a valid address';
      return ctx.createError({ message });
    }

    return true;
  });
});

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    requiredAmount(action?: string, customMessage?: string): StringSchema<TType, TContext>;
    maxAmount(
      params: MaxAmountValidationParams,
      action?: string,
      customMessage?: string
    ): StringSchema<TType, TContext>;
    minAmount(
      params: MinAmountValidationParams,
      action?: string,
      customMessage?: string
    ): StringSchema<TType, TContext>;
    address(customMessage?: string): StringSchema<TType, TContext>;
  }
}

export default yup;
export type { MaxAmountValidationParams, MinAmountValidationParams };
