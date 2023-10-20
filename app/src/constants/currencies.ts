type CurrencyTicker = BitcoinTicker;

interface CurrencyBase {
  ticker: string;
  name: string;
  decimals: number;
}

type BitcoinTicker = "BTC";

const Bitcoin: CurrencyBase = {
  ticker: "BTC" as BitcoinTicker,
  name: "Bitcoin",
  decimals: 8,
} as const;

type BitcoinCurrency = typeof Bitcoin;

type Currency = BitcoinCurrency;

export { Bitcoin };
export type { Currency, BitcoinCurrency, BitcoinTicker, CurrencyTicker };
