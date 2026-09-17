import type { FormValues } from '..';
import { useState, type ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  useGetBarangaysByCity,
  useGetCitiesByRegion,
  useGetRegions,
} from '~/hooks/location.hooks';
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
import DataDisplayRow from '~/components/ui/data-display-row';
import Switch from '~/components/form/base/switch';
import { ControlledLocationAutocomplete } from '~/components/form/controlled/location-autocomplete';
import { ControlledTextField } from '~/components/form/controlled/textfield';
import type { Barangay, City, Region } from '~/models/location.models';
import { ControlledPhoneNumberInput } from '~/components/form/controlled';

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
    emergencyContact?.address?.region?.id ?? ''
  );
  const { data: barangays = [] } = useGetBarangaysByCity(
    emergencyContact?.address?.city?.id ?? ''
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
      <Box
        sx={{
          p: 2,
          bgcolor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Emergency Contact
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Provide primary contact details to reach in case of an emergency.
        </Typography>
      </Box>
      <CardContent>
        <Grid container columnSpacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                Identity
              </Typography>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <DataDisplayRow
                    label="First Name *"
                    config={{
                      row: {
                        flexDirection: 'column',
                        gap: 1,
                        width: '100%',
                      },
                    }}
                  >
                    <ControlledTextField name="emergencyContact.firstName" />
                  </DataDisplayRow>
                </Grid>
                <Grid size={6}>
                  <DataDisplayRow
                    label="Last Name *"
                    config={{
                      row: {
                        flexDirection: 'column',
                        gap: 1,
                      },
                    }}
                  >
                    <ControlledTextField name="emergencyContact.lastName" />
                  </DataDisplayRow>
                </Grid>
                <Grid size={12}>
                  <DataDisplayRow
                    label="Relationship *"
                    config={{
                      row: {
                        flexDirection: 'column',
                        gap: 1,
                      },
                    }}
                  >
                    <ControlledTextField name="emergencyContact.relationship" />
                  </DataDisplayRow>
                </Grid>
                <Grid size={12}>
                  <DataDisplayRow
                    label="Contact Number *"
                    config={{
                      row: {
                        flexDirection: 'column',
                        gap: 1,
                      },
                    }}
                  >
                    <ControlledPhoneNumberInput name="emergencyContact.contactNumber" />
                  </DataDisplayRow>
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{
                  fontWeight: 600,
                }}
              >
                Address
              </Typography>
              <DataDisplayRow
                label="Reuse an existing address?"
                config={{
                  labelBox: {
                    width: '250px',
                  },
                  label: {
                    variant: 'body1',
                    sx: {
                      fontWeight: 600,
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
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      Choose an existing address
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pick one of the user’s available addresses to reuse for
                      this emergency contact.
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
                    <DataDisplayRow
                      label="Address Line 1 *"
                      config={{
                        row: {
                          flexDirection: 'column',
                          gap: 1,
                        },
                      }}
                    >
                      <ControlledTextField
                        name="emergencyContact.address.addressLine1"
                        size="small"
                        fullWidth
                      />
                    </DataDisplayRow>
                  </Grid>
                  <Grid size={12}>
                    <DataDisplayRow
                      label="Address Line 2"
                      config={{
                        row: {
                          flexDirection: 'column',
                          gap: 1,
                        },
                      }}
                    >
                      <ControlledTextField
                        name="emergencyContact.address.addressLine2"
                        size="small"
                        fullWidth
                      />
                    </DataDisplayRow>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <DataDisplayRow
                      label="Region *"
                      config={{
                        row: {
                          flexDirection: 'column',
                          gap: 1,
                        },
                      }}
                    >
                      <ControlledLocationAutocomplete
                        name="emergencyContact.address.region"
                        options={regions}
                      />
                    </DataDisplayRow>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <DataDisplayRow
                      label="City *"
                      config={{
                        row: {
                          flexDirection: 'column',
                          gap: 1,
                        },
                      }}
                    >
                      <ControlledLocationAutocomplete
                        name="emergencyContact.address.city"
                        options={cities}
                        disabled={!emergencyContact?.address?.region}
                      />
                    </DataDisplayRow>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <DataDisplayRow
                      label="Barangay *"
                      config={{
                        row: {
                          flexDirection: 'column',
                          gap: 1,
                        },
                      }}
                    >
                      <ControlledLocationAutocomplete
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
                    </DataDisplayRow>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <DataDisplayRow
                      label="Postal Code *"
                      config={{
                        row: {
                          flexDirection: 'column',
                          gap: 1,
                        },
                      }}
                    >
                      <ControlledTextField
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
                    </DataDisplayRow>
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
