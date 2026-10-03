export const getFieldName = (
  namePrefix: string | undefined,
  field: string
): string => (namePrefix ? `${namePrefix}.${field}` : field);
