import type { Address, EmployeeCreateFormValues } from '../types';
import { type ReactElement } from 'react';

import { useFieldArray, useFormContext } from 'react-hook-form';

import { Grid, Stack } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PlaceIcon from '@mui/icons-material/Place';
import SmartphoneIcon from '@mui/icons-material/Smartphone';

import { Card } from '~/components/ui/card';
import { SectionHeader } from '~/components/section-header';
import { SectionLabel } from '~/components/section-label';

import { RemovableItemList } from '../components/display/removable-item-list';
import { AddressAddForm } from '../components/form/employee/address-add-form';
import { EmailAddForm } from '../components/form/employee/email-add-form';
import { PhoneAddForm } from '../components/form/employee/phone-add-form';
import { EmergencyContactIdentityFields } from '../components/form/emergency-contact/identity-fields';
import { CopyAddressDialog } from '../components/dialog/copy-address-dialog';
import { EmergencyContactAddressFields } from '../components/form/emergency-contact/address-fields';

export const ContactDetails = (): ReactElement => {
  const { control, setValue } = useFormContext<EmployeeCreateFormValues>();
  const {
    fields: addresses,
    append: addAddress,
    remove: removeAddress,
  } = useFieldArray<EmployeeCreateFormValues, 'addresses'>({
    control,
    name: 'addresses',
  });
  const {
    fields: phones,
    append: addPhone,
    remove: removePhone,
  } = useFieldArray<EmployeeCreateFormValues, 'phones'>({
    control,
    name: 'phones',
  });
  const {
    fields: emails,
    append: addEmail,
    remove: removeEmail,
  } = useFieldArray({
    control,
    name: 'emails',
  });

  const handleSelectExistingAddress = (afv: Address): void => {
    setValue(
      'emergencyContact.address',
      { ...afv, addressLine2: afv.addressLine2 ?? '' },
      { shouldValidate: true, shouldDirty: true }
    );
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Card
        header={
          <SectionHeader
            header="Contact Details"
            subheader="Manage primary contact information, including physical addresses,
          phone numbers, and email accounts."
          />
        }
      >
        <Stack sx={{ gap: 1 }}>
          <Stack sx={{ gap: 1 }}>
            <SectionLabel title="Addresses" />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <RemovableItemList
                  items={addresses}
                  getKey={(address) => address.id}
                  getLabel={(_, index) => `Address ${index + 1}`}
                  getValue={(address) => address.formattedAddress}
                  icon={<PlaceIcon color="error" fontSize="large" />}
                  onRemove={removeAddress}
                  removeLabel="Remove address"
                  emptyText="No address added yet."
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <AddressAddForm onSave={(values) => addAddress(values)} />
              </Grid>
            </Grid>
          </Stack>

          <Stack sx={{ gap: 1 }}>
            <SectionLabel title="Phone Numbers" />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <RemovableItemList
                  items={phones}
                  getKey={(phone) => phone.id}
                  getLabel={(_, index) => `Phone Number ${index + 1}`}
                  getValue={(phone) => phone.international}
                  icon={<SmartphoneIcon color="error" fontSize="large" />}
                  onRemove={removePhone}
                  removeLabel="Remove Phone Number"
                  emptyText="No phone number added yet."
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <PhoneAddForm
                  phones={phones}
                  onSave={(values) => addPhone(values)}
                />
              </Grid>
            </Grid>
          </Stack>

          <Stack sx={{ gap: 1 }}>
            <SectionLabel title="Emails" />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <RemovableItemList
                  items={emails}
                  getKey={(email) => email.id}
                  getLabel={(_, index) => `Email ${index + 1}`}
                  getValue={(email) => email.value}
                  icon={<EmailIcon color="error" fontSize="large" />}
                  onRemove={removeEmail}
                  removeLabel="Remove Phone Number"
                  emptyText="No email added yet."
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <EmailAddForm
                  emails={emails}
                  onSave={(values) => addEmail(values)}
                />
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </Card>

      <Card
        header={
          <SectionHeader
            header="Emergency Contact"
            subheader="Provide primary contact details to reach in case of an emergency."
          />
        }
      >
        <Grid container columnSpacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <SectionLabel title="Identity" />
              <EmergencyContactIdentityFields />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionLabel title="Address" />
            <Stack sx={{ gap: 1 }}>
              <CopyAddressDialog
                addresses={addresses}
                onSelect={handleSelectExistingAddress}
              />
              <EmergencyContactAddressFields />
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Stack>
  );
};
