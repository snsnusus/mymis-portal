interface IsDuplicateOptions {
  /** Compare without case, e.g. emails. Defaults to false. */
  ignoreCase?: boolean;
}

/**
 * True when any item already has the given value.
 * `getValue` picks which property of an item to compare.
 */
export const isDuplicate = <T>(
  items: readonly T[],
  value: string,
  getValue: (item: T) => string,
  { ignoreCase = false }: IsDuplicateOptions = {}
): boolean => {
  const normalize = (text: string): string =>
    ignoreCase ? text.toLowerCase() : text;

  const target = normalize(value);
  return items.some((item) => normalize(getValue(item)) === target);
};
