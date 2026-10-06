import type { Region } from '~/models/region.model';
import type { City } from '~/models/city.model';
import type { Barangay } from '~/models/barangay.model';
import type { EmergencyContactRelationship } from '~/models/employee.model';
import type { FormValues } from '..';
import { useState, type ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import { matchIsValidTel } from 'mui-tel-input';
import { useGetAll as useGetBarangaysByCity } from '~/queries/barangay.query';
import { useGetAll as useGetCitiesByRegion } from '~/queries/city.query';
import { useGetAll as useGetRegions } from '~/queries/region.query';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { SectionLabel } from '~/components/section-label';
import { ControlledLocationAutocomplete } from '~/components/form/inputs/controlled/location-autocomplete';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { ControlledPhoneNumberInput } from '~/components/form/inputs/controlled/phone-number-input';

type AddressFormValues = {
  addressLine1: string;
  addressLine2?: string;
  region: Region | null;
  city: City | null;
  barangay: Barangay | null;
  postalCode: string;
  formattedAddress: string;
};

const RELATIONSHIP_OPTIONS: {
  value: EmergencyContactRelationship;
  label: string;
}[] = [
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Partner', label: 'Partner' },
  { value: 'Parent', label: 'Parent' },
  { value: 'Guardian', label: 'Guardian' },
  { value: 'Sibling', label: 'Sibling' },
  { value: 'Child', label: 'Child' },
  { value: 'Relative', label: 'Relative' },
  { value: 'Friend', label: 'Friend' },
  { value: 'Other', label: 'Other' },
];

export const EmergencyContact = (): ReactElement => {
  const { watch, setValue } = useFormContext<FormValues>();

  const addresses = watch('addresses');
  const address = watch('emergencyContact.address');

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const { data: regions = [] } = useGetRegions();
  const { data: cities = [] } = useGetCitiesByRegion(address.region?.id);
  const { data: barangays = [] } = useGetBarangaysByCity(address.city?.id ?? 0);

  // Copies the chosen address into the contact's own fields. It's a copy:
  // editing or removing the employee's address later doesn't affect it.
  const handleSelectExistingAddress = (selected: AddressFormValues): void => {
    setValue(
      'emergencyContact.address',
      { ...selected, addressLine2: selected.addressLine2 ?? '' },
      { shouldValidate: true, shouldDirty: true }
    );
    setIsAddressModalOpen(false);
  };

  return (
    <Card variant="outlined">
      <Stack
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">Emergency Contact</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Provide primary contact details to reach in case of an emergency.
        </Typography>
      </Stack>
      <CardContent>
        <Grid container columnSpacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <SectionLabel title="Identity" />
              <Grid container spacing={2}>
                <Grid size={6}>
                  <ControlledTextField
                    label="First Name *"
                    name="emergencyContact.firstName"
                    rules={{ required: 'First name is required.' }}
                  />
                </Grid>
                <Grid size={6}>
                  <ControlledTextField
                    label="Middle Name"
                    name="emergencyContact.middleName"
                  />
                </Grid>
                <Grid size={8}>
                  <ControlledTextField
                    label="Last Name *"
                    name="emergencyContact.lastName"
                    rules={{ required: 'Last name is required.' }}
                  />
                </Grid>
                <Grid size={4}>
                  <ControlledTextField
                    label="Suffix"
                    name="emergencyContact.suffix"
                  />
                </Grid>
                <Grid size={12}>
                  <ControlledTextField
                    label="Relationship *"
                    name="emergencyContact.relationship"
                    select
                    rules={{ required: 'Relationship is required.' }}
                  >
                    {RELATIONSHIP_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </ControlledTextField>
                </Grid>
                <Grid size={12}>
                  <ControlledPhoneNumberInput
                    label="Contact Number *"
                    name="emergencyContact.contactNumber"
                    rules={{
                      validate: (value: { international?: string } | null) => {
                        if (!value?.international) {
                          return 'Contact number is required.';
                        }
                        return (
                          matchIsValidTel(value.international) ||
                          'Enter a valid phone number for the selected country.'
                        );
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack
              direction="row"
              sx={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
              <SectionLabel title="Address" />
              <Button
                size="small"
                startIcon={<ContentCopyIcon fontSize="small" />}
                disabled={addresses.length === 0}
                onClick={() => setIsAddressModalOpen(true)}
              >
                Copy from employee&apos;s address
              </Button>
            </Stack>
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
                  disabled={!address.region}
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
                  disabled={!address.city}
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
                      readOnly: Boolean(address.postalCode),
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>

      <Dialog
        open={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Copy one of the employee&apos;s addresses</DialogTitle>
        <DialogContent dividers>
          <List disablePadding>
            {addresses.map((employeeAddress) => (
              <ListItemButton
                key={employeeAddress.formattedAddress}
                onClick={() => handleSelectExistingAddress(employeeAddress)}
              >
                <ListItemText primary={employeeAddress.formattedAddress} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddressModalOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
