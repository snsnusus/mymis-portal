import type { EmployeeCreateFormValues } from '../../../types';
import { type ReactElement } from 'react';

import { useFormContext } from 'react-hook-form';
import { useGetAll as useGetBarangaysByCity } from '~/queries/barangay.query';
import { useGetAll as useGetCitiesByRegion } from '~/queries/city.query';
import { useGetAll as useGetRegions } from '~/queries/region.query';

import { ControlledLocationAutocomplete } from '~/components/form/inputs/controlled/location-autocomplete';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { Grid } from '@mui/material';

export const EmergencyContactAddressFields = (): ReactElement => {
  const { watch, setValue } = useFormContext<EmployeeCreateFormValues>();

  const ecAddress = watch('emergencyContact.address');

  const { data: regions = [] } = useGetRegions();
  const { data: cities = [] } = useGetCitiesByRegion(ecAddress.region?.id);
  const { data: barangays = [] } = useGetBarangaysByCity(
    ecAddress.city?.id ?? 0
  );

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <ControlledTextField
          label="Address Line 1 *"
          name="emergencyContact.address.addressLine1"
          size="small"
          fullWidth
          rules={{ required: 'Address line 1 is required.' }}
        />
      </Grid>
      <Grid size={12}>
        <ControlledTextField
          label="Address Line 2"
          name="emergencyContact.address.addressLine2"
          size="small"
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledLocationAutocomplete
          label="Region *"
          name="emergencyContact.address.region"
          options={regions}
          rules={{ required: 'Region is required.' }}
          onChange={() => {
            setValue('emergencyContact.address.city', null);
            setValue('emergencyContact.address.barangay', null);
            setValue('emergencyContact.address.postalCode', '');
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledLocationAutocomplete
          label="City *"
          name="emergencyContact.address.city"
          options={cities}
          disabled={!ecAddress.region}
          rules={{ required: 'City is required.' }}
          onChange={() => {
            setValue('emergencyContact.address.barangay', null);
            setValue('emergencyContact.address.postalCode', '');
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledLocationAutocomplete
          label="Barangay *"
          name="emergencyContact.address.barangay"
          options={barangays}
          disabled={!ecAddress.city}
          rules={{ required: 'Barangay is required.' }}
          onChange={(value) => {
            setValue(
              'emergencyContact.address.postalCode',
              value?.zipCode ?? ''
            );
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledTextField
          label="Postal Code *"
          name="emergencyContact.address.postalCode"
          variant="outlined"
          rules={{ required: 'Postal code is required.' }}
          slotProps={{
            input: {
              readOnly: Boolean(ecAddress.postalCode),
            },
          }}
        />
      </Grid>
    </Grid>
  );
};
