import type { Region } from '~/models/region.model';
import type { City } from '~/models/city.model';
import type { Barangay } from '~/models/barangay.model';
import type { FormValues } from '..';
import { useState, type ChangeEvent, type ReactElement } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useGetAll as useGetBarangaysByCity } from '~/queries/barangay.query';
import { useGetAll as useGetCitiesByRegion } from '~/queries/city.query';
import { useGetAll as useGetRegions } from '~/queries/region.query';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlaceIcon from '@mui/icons-material/Place';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocationAutocomplete } from '~/components/form/inputs/base/location-autocomplete';

import { formatAddress } from '~/utils/address.utils';

export type AddressFormValues = {
  addressLine1: string;
  addressLine2?: string;
  region: Region | null;
  city: City | null;
  barangay: Barangay | null;
  postalCode: string;
  formattedAddress: string;
};

const initialFormValues: AddressFormValues = {
  addressLine1: '',
  addressLine2: '',
  region: null,
  city: null,
  barangay: null,
  postalCode: '',
  formattedAddress: '',
};

export const Address = (): ReactElement => {
  const { control } = useFormContext<FormValues>();
  const {
    fields: addresses,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'addresses',
  });
  const [formValues, setFormValues] =
    useState<AddressFormValues>(initialFormValues);

  const hasAddress = addresses.length > 0;

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
    append({
      ...formValues,
      formattedAddress: formatAddress(formValues),
    });
    setFormValues(initialFormValues);
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack sx={{ gap: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'fontWeightMedium' }}>
            Addresses
          </Typography>
          {hasAddress ? (
            <Stack
              spacing={1}
              sx={{
                flexWrap: 'wrap',
                overflowY: 'auto',
                maxHeight: 200,
                scrollbarGutter: 'stable',
                paddingRight: 1,
              }}
            >
              {addresses.map((address, index) => (
                <Paper
                  key={address.id}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    width: '100%',
                  }}
                >
                  <PlaceIcon
                    color="primary"
                    fontSize="large"
                    sx={{ mt: 0.25 }}
                  />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Address {index + 1}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ overflowWrap: 'anywhere' }}
                    >
                      {address.formattedAddress}
                    </Typography>
                  </Box>
                  <Tooltip title="Remove Address">
                    <IconButton
                      aria-label={`Remove address ${index + 1}`}
                      sx={{ '&:hover': { color: 'error.main' } }}
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No address added yet.
            </Typography>
          )}
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
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
          <Grid size={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 150,
                }}
                onClick={() => setFormValues(initialFormValues)}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                sx={{
                  minWidth: 150,
                }}
                onClick={handleAddAddress}
              >
                Add Address
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
