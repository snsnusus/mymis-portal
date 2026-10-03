// File: src/utils/date.util.ts
const DATE_ONLY_FORMATTER = new Intl.DateTimeFormat('en-PH', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

/** Formats an API calendar date ('YYYY-MM-DD') for display, e.g. "Jan 1, 2026". */
export const formatDateOnly = (value: string): string => {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : DATE_ONLY_FORMATTER.format(date);
};

const pad = (value: number): string => String(value).padStart(2, '0');

/**
 * Converts an API calendar date ('YYYY-MM-DD') into a Date at local midnight,
 * for date pickers to display. Returns null for '' or a malformed value.
 */
export const dateOnlyToDate = (value: string): Date | null => {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Converts a picked Date into an API calendar date ('YYYY-MM-DD') using its
 * local calendar day. Returns '' for null or an invalid Date.
 */
export const dateToDateOnly = (date: Date | null): string =>
  date && !Number.isNaN(date.getTime())
    ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    : '';
