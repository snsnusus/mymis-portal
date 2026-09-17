import type { AddressFormValues } from '~/pages/employees/create/contact-details/address';

export const formatAddress = (values: AddressFormValues): string =>
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
