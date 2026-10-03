/** Rounds to a fixed number of decimal places, removing floating-point noise. */
export const roundTo = (value: number, digits: number): number =>
  Number(value.toFixed(digits));

/** API percentage (80) → form fraction (0.8). Keeps 2 decimals of the percentage. */
export const percentToFraction = (percent: number): number =>
  roundTo(percent / 100, 4);

/** Form fraction (0.8) → API percentage (80). Keeps 2 decimals, matching numeric(5,2). */
export const fractionToPercent = (fraction: number): number =>
  roundTo(fraction * 100, 2);

/** Formats an amount as currency, e.g. formatCurrency(150000, 0) → "₱150,000". */
export const formatCurrency = (
  value: number,
  decimals = 2,
  currency = 'PHP',
  locale = 'en-PH'
): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
