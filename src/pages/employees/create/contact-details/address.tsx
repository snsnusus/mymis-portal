import type { Barangay, City, Region } from '~/models/location.models';
import type { FormValues } from '..';
import {
  useEffect,
  useState,
  type ChangeEvent,
  type ReactElement,
} from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  useGetRegions,
  useGetCitiesByRegion,
  useGetBarangaysByCity,
} from '~/hooks/location.hooks';
import {
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import DataDisplayRow, {
  type DataDisplayRowProps,
} from '~/components/ui/data-display-row';
import { LocationAutocomplete } from '~/components/form/base/location-autocomplete';

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

type IsolatedInputProps = {
  label: string;
  config?: DataDisplayRowProps['config'];
  name: string;
  value: string | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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

const IsolatedInput = ({
  label,
  config,
  name,
  value,
  onChange,
}: IsolatedInputProps): ReactElement => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <DataDisplayRow label={label} config={config}>
      <TextField
        name={name}
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
          onChange(e);
        }}
        variant="outlined"
        size="small"
        fullWidth
      />
    </DataDisplayRow>
  );
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

  const { data: regions } = useGetRegions();
  const { data: cities } = useGetCitiesByRegion(formValues.region?.id ?? '');
  const { data: barangays } = useGetBarangaysByCity(formValues.city?.id ?? '');

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
    <Grid container spacing={2} columnSpacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack
          sx={{
            gap: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
            }}
          >
            Addresses
          </Typography>
          {hasAddress ? (
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{
                flexWrap: 'wrap',
              }}
            >
              {addresses.map((address, index) => (
                <Chip
                  key={address.id ?? `${address.formattedAddress}-${index}`}
                  label={address.formattedAddress}
                  variant="outlined"
                  color="primary"
                  onDelete={() => remove(index)}
                  sx={{
                    '&.MuiChip-root': {
                      height: 'fit-content',
                    },
                    '& .MuiChip-label': {
                      whiteSpace: 'normal',
                      padding: 1.4,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    },
                  }}
                />
              ))}
            </Stack>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              No address added yet.
            </Typography>
          )}
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <IsolatedInput
              name="addressLine1"
              label="Address Line 1 *"
              value={formValues.addressLine1}
              onChange={handleChange}
              config={{
                row: {
                  flexDirection: 'column',
                  gap: 1,
                },
              }}
            />
          </Grid>
          <Grid size={12}>
            <IsolatedInput
              name="addressLine2"
              label="Address Line 2"
              value={formValues.addressLine2}
              onChange={handleChange}
              config={{
                row: {
                  flexDirection: 'column',
                  gap: 1,
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DataDisplayRow
              label="Region *"
              config={{
                row: {
                  flexDirection: 'column',
                  gap: 1,
                },
              }}
            >
              <LocationAutocomplete
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
                options={regions ?? []}
              />
            </DataDisplayRow>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DataDisplayRow
              label="City *"
              config={{
                row: {
                  flexDirection: 'column',
                  gap: 1,
                },
              }}
            >
              <LocationAutocomplete
                value={formValues.city}
                onChange={(value) =>
                  setFormValues((prev) => ({
                    ...prev,
                    city: value,
                    barangay: null,
                    postalCode: '',
                  }))
                }
                options={cities ?? []}
                disabled={!formValues.region}
              />
            </DataDisplayRow>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DataDisplayRow
              label="Barangay *"
              config={{
                row: {
                  flexDirection: 'column',
                  gap: 1,
                },
              }}
            >
              <LocationAutocomplete
                value={formValues.barangay}
                onChange={(value) =>
                  setFormValues((prev) => ({
                    ...prev,
                    barangay: value,
                    postalCode: value?.zipCode ?? '',
                  }))
                }
                options={barangays ?? []}
                disabled={!formValues.city}
              />
            </DataDisplayRow>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DataDisplayRow
              label="Postal Code *"
              config={{
                row: {
                  flexDirection: 'column',
                  gap: 1,
                },
              }}
            >
              <TextField
                value={formValues.postalCode}
                onChange={handleChange}
                variant="outlined"
                size="small"
                slotProps={{
                  input: {
                    readOnly: Boolean(formValues.postalCode),
                  },
                }}
              />
            </DataDisplayRow>
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
                variant="text"
                color="inherit"
                size="medium"
                sx={{
                  minWidth: 120,
                }}
                onClick={() => setFormValues(initialFormValues)}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="medium"
                sx={{
                  minWidth: 120,
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
