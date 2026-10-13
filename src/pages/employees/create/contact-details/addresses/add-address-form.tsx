import type { Region } from '~/models/region.model';
import type { City } from '~/models/city.model';
import type { Barangay } from '~/models/barangay.model';

import { type ChangeEvent, useState, type ReactElement } from 'react';
import { useGetAll as useGetBarangaysByCity } from '~/queries/barangay.query';
import { useGetAll as useGetCitiesByRegion } from '~/queries/city.query';
import { useGetAll as useGetRegions } from '~/queries/region.query';

import { Button, Grid, Stack, TextField } from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

import { LocationAutocomplete } from '~/components/form/inputs/base/location-autocomplete';

import { formatAddress } from '~/utils/address.utils';

interface AddAddressFormProps {
  handleSubmit: (values: AddAddressFormValues) => void;
}

export type AddAddressFormValues = {
  addressLine1: string;
  addressLine2?: string;
  region: Region | null;
  city: City | null;
  barangay: Barangay | null;
  postalCode: string;
  formattedAddress: string;
};

const defaultValues: AddAddressFormValues = {
  addressLine1: '',
  addressLine2: '',
  region: null,
  city: null,
  barangay: null,
  postalCode: '',
  formattedAddress: '',
};

export const AddAddressForm = ({
  handleSubmit,
}: AddAddressFormProps): ReactElement => {
  const [formValues, setFormValues] =
    useState<AddAddressFormValues>(defaultValues);

  const { data: regions = [] } = useGetRegions();
  const { data: cities = [] } = useGetCitiesByRegion(
    formValues.region?.id ?? 0
  );
  const { data: barangays = [] } = useGetBarangaysByCity(
    formValues.city?.id ?? 0
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, type, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddAddress = (): void => {
    handleSubmit({
      ...formValues,
      formattedAddress: formatAddress(formValues),
    });
    setFormValues(defaultValues);
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            name="addressLine1"
            label="Address Line 1 *"
            value={formValues.addressLine1}
            onChange={handleChange}
            fullWidth
            size="small"
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
            onChange={(value) =>
              setFormValues((prev) => ({
                ...prev,
                region: value,
                city: null,
                barangay: null,
                postalCode: '',
              }))
            }
            options={regions}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LocationAutocomplete
            label="City *"
            value={formValues.city}
            onChange={(value) =>
              setFormValues((prev) => ({
                ...prev,
                city: value,
                barangay: null,
                postalCode: '',
              }))
            }
            options={cities}
            disabled={!formValues.region}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LocationAutocomplete
            label="Barangay *"
            value={formValues.barangay}
            onChange={(value) =>
              setFormValues((prev) => ({
                ...prev,
                barangay: value,
                postalCode: value?.zipCode ?? '',
              }))
            }
            options={barangays}
            disabled={!formValues.city}
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
        <Button
          variant="outlined"
          size="small"
          onClick={() => setFormValues(defaultValues)}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddLocationAltIcon />}
          onClick={handleAddAddress}
        >
          Add Address
        </Button>
      </Stack>
    </Stack>
  );
};
