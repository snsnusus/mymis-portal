import type { Region } from '~/models/region.model';
import type { City } from '~/models/city.model';
import type { Barangay } from '~/models/barangay.model';
import type { AddressPayload } from '~/models/address.models';
import { useEffect, useState, type ReactElement } from 'react';
import { useGetAll as useGetRegions } from '~/hooks/region.hooks';
import { useGetAll as useGetCitiesByRegion } from '~/hooks/city.hooks';
import { useGetAll as useGetBarangaysByCity } from '~/hooks/barangay.hooks';
import {
  Autocomplete,
  Button,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CustomSwitch from '~/components/form/base/switch';
import Drawer from '~/components/ui/drawer';
import DataDisplayRow from '~/components/ui/data-display-row';

const customConfig = {
  labelBox: {
    width: 110,
  },
};

const IsolatedInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}): ReactElement => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <DataDisplayRow label={label} config={customConfig}>
      <TextField
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
          onChange(e.target.value);
        }}
        variant="outlined"
        size="small"
        fullWidth
      />
    </DataDisplayRow>
  );
};

const AddressForm = ({
  isSubmitted,
  onSubmit,
}: {
  isSubmitted: boolean;
  onSubmit: (payload: AddressPayload) => void;
}): ReactElement => {
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<Region | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedBarangay, setSelectedBarangay] = useState<Barangay | null>(
    null
  );
  const [zipcode, setZipcode] = useState('');
  const [tag, setTag] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const { data: provinceOptions } = useGetRegions();
  const { data: cityOptions } = useGetCitiesByRegion(selectedProvince?.id);
  const { data: barangayOptions } = useGetBarangaysByCity(
    selectedCity?.id ?? 0
  );

  useEffect(() => {
    if (isSubmitted) {
      const formattedAddress = `${addressLine1}, (${addressLine2}), ${
        selectedBarangay?.name ?? ''
      }, ${selectedCity?.name ?? ''}, ${
        selectedProvince?.name ?? ''
      }, ${zipcode}`;
      onSubmit({
        userId: '',
        addressLine1,
        addressLine2,
        regionId: String(selectedProvince?.id) ?? '',
        cityId: String(selectedCity?.id) ?? '',
        barangayId: String(selectedBarangay?.id) ?? '',
        postalCode: zipcode,
        tag,
        isPrimary,
        formattedAddress,
      });
    }
  }, [
    addressLine1,
    addressLine2,
    isPrimary,
    isSubmitted,
    onSubmit,
    selectedBarangay?.id,
    selectedBarangay?.name,
    selectedCity?.id,
    selectedCity?.name,
    selectedProvince?.id,
    selectedProvince?.name,
    tag,
    zipcode,
  ]);

  return (
    <>
      <Stack
        sx={{
          gap: 2,
        }}
      >
        <IsolatedInput
          label="Address Line 1 *"
          value={addressLine1}
          onChange={setAddressLine1}
        />
        <IsolatedInput
          label="Address Line 2"
          value={addressLine2}
          onChange={setAddressLine2}
        />
        <DataDisplayRow label="Province *" config={{ ...customConfig }}>
          <Autocomplete
            options={provinceOptions ?? []}
            getOptionLabel={(option) => option.name || ''}
            value={selectedProvince}
            onChange={(_, newValue) => {
              setSelectedProvince(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                  select: { multiple: false },
                }}
              />
            )}
          />
        </DataDisplayRow>
        <DataDisplayRow label="City *" config={{ ...customConfig }}>
          <Autocomplete
            options={cityOptions ?? []}
            getOptionLabel={(option) => option.name || ''}
            value={selectedCity}
            onChange={(_, newValue) => {
              setSelectedCity(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                  select: { multiple: false },
                }}
              />
            )}
          />
        </DataDisplayRow>
        <DataDisplayRow label="Barangay *" config={{ ...customConfig }}>
          <Autocomplete
            options={barangayOptions ?? []}
            getOptionLabel={(option) => option.name || ''}
            value={selectedBarangay}
            onChange={(_, newValue) => {
              setSelectedBarangay(newValue);
              setZipcode(newValue?.zipCode ?? '');
            }}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                slotProps={{
                  inputLabel: { shrink: true },
                  select: { multiple: false },
                }}
              />
            )}
          />
        </DataDisplayRow>
        <DataDisplayRow label="Zip Code *" config={{ ...customConfig }}>
          <TextField
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            variant="outlined"
            size="small"
          />
        </DataDisplayRow>
        <DataDisplayRow label="Tag" config={{ ...customConfig }}>
          <TextField
            variant="outlined"
            size="small"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            select
            sx={{ width: 200 }}
          >
            <MenuItem value="Home" sx={{ fontSize: '0.875rem' }}>
              Home
            </MenuItem>
            <MenuItem value="Office" sx={{ fontSize: '0.875rem' }}>
              Office
            </MenuItem>
          </TextField>
        </DataDisplayRow>
        <DataDisplayRow
          label="Set as primary address"
          config={{
            row: {
              alignItems: 'center',
            },
            labelBox: {
              width: 180,
            },
          }}
        >
          <CustomSwitch
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
          />
        </DataDisplayRow>
      </Stack>
    </>
  );
};

export const AddAddressDrawer = ({
  onSave,
}: {
  onSave: (payload: AddressPayload) => void;
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleDrawer = (open: boolean): void => setIsOpen(open);
  const toggleSubmit = (flag: boolean): void => setIsSubmitted(flag);

  const handleSubmit = (payload: AddressPayload): void => {
    onSave(payload);
    toggleSubmit(false);
    toggleDrawer(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => toggleDrawer(true)}
        startIcon={<AddIcon />}
      >
        Add Address
      </Button>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => toggleDrawer(false)}
        title="Add Address"
        action={
          <>
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={() => toggleDrawer(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => toggleSubmit(true)}
            >
              Save
            </Button>
          </>
        }
      >
        {isOpen && (
          <AddressForm isSubmitted={isSubmitted} onSubmit={handleSubmit} />
        )}
      </Drawer>
    </>
  );
};

export default AddAddressDrawer;
