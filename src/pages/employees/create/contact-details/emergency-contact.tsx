import type { Region } from '~/models/region.model';
import type { City } from '~/models/city.model';
import type { Barangay } from '~/models/barangay.model';
import type { FormValues } from '..';
import { useState, type ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import { useGetAll as useGetBarangaysByCity } from '~/queries/barangay.query';
import { useGetAll as useGetCitiesByRegion } from '~/queries/city.query';
import { useGetAll as useGetRegions } from '~/queries/region.query';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { DataDisplayRow } from '~/components/ui/data-display-row';
import { SectionLabel } from '~/components/section-label';
import { Switch } from '~/components/form/inputs/base/switch';
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

export const EmergencyContact = (): ReactElement => {
  const { watch, setValue } = useFormContext<FormValues>();

  const addresses = watch('addresses');
  const emergencyContact = watch('emergencyContact');

  const [useSameAddress, setUseSameAddress] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const { data: regions = [] } = useGetRegions();
  const { data: cities = [] } = useGetCitiesByRegion(
    emergencyContact?.address?.region?.id
  );
  const { data: barangays = [] } = useGetBarangaysByCity(
    emergencyContact?.address?.city?.id ?? 0
  );

  const handleToggleSameAddress = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const checked = event.target.checked;
    setUseSameAddress(checked);

    if (!checked) {
      setValue('emergencyContact.address', null);
    }
  };

  const handleSelectExistingAddress = (address: AddressFormValues): void => {
    setValue('emergencyContact.address', address);
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
                  />
                </Grid>
                <Grid size={6}>
                  <ControlledTextField
                    label="Middle Name *"
                    name="emergencyContact.middleName"
                  />
                </Grid>
                <Grid size={8}>
                  <ControlledTextField
                    label="Last Name *"
                    name="emergencyContact.lastName"
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
                  />
                </Grid>
                <Grid size={12}>
                  <ControlledPhoneNumberInput
                    label="Contact Number *"
                    name="emergencyContact.contactNumber"
                  />
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionLabel title="Address" />
            <Stack sx={{ gap: 2 }}>
              <DataDisplayRow
                label="Reuse an existing address?"
                config={{
                  row: {
                    alignItems: 'center',
                  },
                  labelBox: {
                    width: 250,
                  },
                  label: {
                    variant: 'body2',
                    sx: {
                      fontWeight: 'fontWeightMedium',
                      textTransform: 'uppercase',
                    },
                  },
                }}
              >
                <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                  <Switch
                    checked={useSameAddress}
                    onChange={handleToggleSameAddress}
                  />
                </Stack>
              </DataDisplayRow>
              <Divider />
              {useSameAddress ? (
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: 'grey.50',
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'fontWeightMedium',
                      }}
                    >
                      Choose an existing address
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pick one of the user&apos;s available addresses to reuse
                      for this emergency contact.
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setIsAddressModalOpen(true)}
                    >
                      {emergencyContact.address
                        ? 'Change address'
                        : 'Select address'}
                    </Button>
                    {emergencyContact.address && (
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {emergencyContact.address?.formattedAddress}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {emergencyContact.address?.formattedAddress}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <ControlledTextField
                      label="Address Line 1 *"
                      name="emergencyContact.address.addressLine1"
                      size="small"
                      fullWidth
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
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <ControlledLocationAutocomplete
                      label="City *"
                      name="emergencyContact.address.city"
                      options={cities}
                      disabled={!emergencyContact?.address?.region}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <ControlledLocationAutocomplete
                      label="Barangay *"
                      name="emergencyContact.address.barangay"
                      options={barangays}
                      disabled={!emergencyContact?.address?.city}
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
                      slotProps={{
                        input: {
                          readOnly: Boolean(
                            emergencyContact.address?.postalCode
                          ),
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>

      <Dialog
        open={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Select an existing address</DialogTitle>
        <DialogContent dividers>
          <List disablePadding>
            {addresses.map((address) => (
              <ListItemButton
                key={address.formattedAddress}
                selected={
                  emergencyContact.address?.formattedAddress ===
                  address.formattedAddress
                }
                onClick={() => handleSelectExistingAddress(address)}
              >
                <ListItemText
                  primary={address.formattedAddress}
                  secondary={address.formattedAddress}
                />
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
