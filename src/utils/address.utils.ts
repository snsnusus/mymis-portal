import type { AddAddressFormValues } from '~/pages/employees/create/contact-details/addresses/add-address-form';

export const formatAddress = (values: AddAddressFormValues): string =>
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
