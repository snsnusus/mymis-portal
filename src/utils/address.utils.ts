import type { Address } from '~/pages/employees/create/types';

export const formatAddress = (values: Address): string =>
  [
    values.addressLine1,
    values.addressLine2,
    values.barangay?.name,
    values.city?.name,
    values.region?.name,
    values.postalCode,
  ]
    .filter(Boolean)
    .join(', ');
