import Big from "big.js";
import { Currency } from "../constants/currencies";

export class Amount<T extends Currency> {
  public readonly currency: T;
  private readonly amount: Big;

  constructor(currency: T, amount: Big.BigSource, base?: boolean) {
    this.currency = currency;
    this.amount = base
      ? new Big(amount)
      : new Big(amount).div(new Big(10).pow(currency.decimals));
  }

  public toBig() {
    return this.amount;
  }

  public toAtomic() {
    return this.amount.mul(new Big(10).pow(this.currency.decimals)).toNumber();
  }
}
