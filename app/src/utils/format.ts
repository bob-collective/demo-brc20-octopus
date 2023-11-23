const getFormatUSDNotation = (amount: number) => {
  const amountLength = amount.toFixed(0).length;

  return amountLength >= 6 ? "compact" : "standard";
};

const formatUSD = (amount: number, options?: { compact?: boolean }): string => {
  const { format } = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    notation: options?.compact ? getFormatUSDNotation(amount) : undefined,
    minimumFractionDigits: amount > 0 && amount < 0.01 ? 3 : undefined,
  });

  return format(amount);
};

function shortAddress(address?: string, len = 5) {
  if (!address) return "";
  if (address.length <= len * 2) return address;
  return address.slice(0, len) + "..." + address.slice(address.length - len);
}

export { formatUSD, shortAddress };
