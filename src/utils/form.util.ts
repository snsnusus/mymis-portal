const ERROR_META_KEYS = new Set(['message', 'type', 'types', 'ref']);

/**
 * Counts the field errors inside a react-hook-form errors object, at any depth.
 * Each object with a string `message` counts as one error.
 */
export const countFieldErrors = (node: unknown): number => {
  if (node === null || typeof node !== 'object') {
    return 0;
  }
  const record = node as Record<string, unknown>;
  const own = typeof record.message === 'string' ? 1 : 0;

  return Object.entries(record).reduce(
    (total, [key, child]) =>
      ERROR_META_KEYS.has(key) ? total : total + countFieldErrors(child),
    own
  );
};
