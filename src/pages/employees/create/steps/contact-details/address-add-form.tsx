import type { AddressType } from '~/models/employee.model';
import type { EmployeeAddressValues } from '../../types';

import { type ChangeEvent, useState, type ReactElement } from 'react';

import { useGetAll as useGetBarangaysByCity } from '~/queries/barangay.query';
import { useGetAll as useGetCitiesByRegion } from '~/queries/city.query';
import { useGetAll as useGetRegions } from '~/queries/region.query';

import { type z } from 'zod';

import { Button, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { AddLocationAlt as AddLocationAltIcon } from '@mui/icons-material';

import { LocationAutocomplete } from '~/components/form/inputs/base/location-autocomplete';

import { formatAddress } from '~/utils/address.utils';

import { ADDRESS_SCHEMA } from '../../schemas';
import { ADDRESS_TYPE_OPTIONS } from '../../constants/options';
import { EMPTY_ADDRESS } from '../../constants/default-values';

type AddressFieldErrors = Partial<
  Record<keyof z.infer<typeof ADDRESS_SCHEMA>, string>
>;

const defaultValues: EmployeeAddressValues = {
  ...EMPTY_ADDRESS,
  type: 'Present',
};

export const AddressAddForm = ({
  onSave,
}: {
  onSave: (values: EmployeeAddressValues) => void;
}): ReactElement => {
  const [formValues, setFormValues] =
    useState<EmployeeAddressValues>(defaultValues);
  const [errors, setErrors] = useState<AddressFieldErrors>({});

  const { data: regions = [] } = useGetRegions();
  const { data: cities = [] } = useGetCitiesByRegion(
    formValues.region?.id ?? 0
  );
  const { data: barangays = [] } = useGetBarangaysByCity(
    formValues.city?.id ?? 0
  );

  const clearErrors = (...fields: (keyof AddressFieldErrors)[]): void => {
    setErrors((prev) => {
      const next = { ...prev };
      fields.forEach((field) => delete next[field]);
      return next;
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, type, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    clearErrors(name as keyof AddressFieldErrors);
  };

  const handleSave = (): void => {
    const result = ADDRESS_SCHEMA.safeParse(formValues);

    if (!result.success) {
      const nextErrors: AddressFieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof AddressFieldErrors;
        nextErrors[field] ??= issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    onSave({
      ...formValues,
      formattedAddress: formatAddress(formValues),
    });
    setFormValues(defaultValues);
    setErrors({});
  };

  const handleClear = (): void => {
    setFormValues(defaultValues);
    setErrors({});
  };

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            label="Address Type"
            value={formValues.type}
            onChange={(event) =>
              setFormValues((prev) => ({
                ...prev,
                type: event.target.value as AddressType,
              }))
            }
            fullWidth
            size="small"
          >
            {ADDRESS_TYPE_OPTIONS.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={12}>
          <TextField
            name="addressLine1"
            label="Address Line 1 *"
            value={formValues.addressLine1}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.addressLine1}
            helperText={errors.addressLine1}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            name="addressLine2"
            label="Address Line 2"
            value={formValues.addressLine2}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LocationAutocomplete
            label="Region *"
            value={formValues.region}
            onChange={(value) => {
              setFormValues((prev) => ({
                ...prev,
                region: value,
                city: null,
                barangay: null,
                postalCode: '',
              }));
              clearErrors('region');
            }}
            options={regions}
            error={!!errors.region}
            helperText={errors.region}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LocationAutocomplete
            label="City *"
            value={formValues.city}
            onChange={(value) => {
              setFormValues((prev) => ({
                ...prev,
                city: value,
                barangay: null,
                postalCode: '',
              }));
              clearErrors('city');
            }}
            options={cities}
            disabled={!formValues.region}
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LocationAutocomplete
            label="Barangay *"
            value={formValues.barangay}
            onChange={(value) => {
              setFormValues((prev) => ({
                ...prev,
                barangay: value,
                postalCode: value?.zipCode ?? '',
              }));
              clearErrors('barangay', 'postalCode');
            }}
            options={barangays}
            disabled={!formValues.city}
            error={!!errors.barangay}
            helperText={errors.barangay}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Postal Code *"
            value={formValues.postalCode}
            onChange={handleChange}
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                readOnly: Boolean(formValues.postalCode),
              },
            }}
            fullWidth
          />
        </Grid>
      </Grid>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'flex-end',
          gap: 1,
        }}
      >
        <Button variant="outlined" size="small" onClick={handleClear}>
          Clear
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddLocationAltIcon />}
          onClick={handleSave}
        >
          Add Address
        </Button>
      </Stack>
    </Stack>
  );
};
