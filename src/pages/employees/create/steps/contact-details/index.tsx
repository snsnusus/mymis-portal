import type { Address, EmployeeCreateFormValues } from '../../types';
import { useState, type ReactElement } from 'react';

import { useFieldArray, useFormContext } from 'react-hook-form';

import {
  Button,
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
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Email as EmailIcon,
  Place as PlaceIcon,
  Smartphone as SmartphoneIcon,
} from '@mui/icons-material';

import { Card } from '~/components/ui/card';
import { SectionHeader } from '~/components/section-header';
import { SectionLabel } from '~/components/section-label';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { ControlledPhoneNumberInput } from '~/components/form/inputs/controlled/phone-number-input';

import { RemovableItemList } from '../../shared/removable-item-list';
import { RELATIONSHIP_OPTIONS } from '../../const/options';

import { matchIsValidTel } from 'mui-tel-input';

import { AddAddressForm } from './add-address-form';
import { AddEmailForm } from './add-email-form';
import { AddPhoneNumberForm } from './add-phone-number-form';
import { EmergencyContactAddressFields } from './emergency-contact-address-fields';

interface CopyAddressDialogProps {
  addresses: Address[];
  onSelect: (address: Address) => void;
}

const CopyAddressDialog = ({
  addresses,
  onSelect,
}: CopyAddressDialogProps): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'flex-end',
        }}
      >
        <Button
          size="small"
          startIcon={<ContentCopyIcon />}
          disabled={addresses.length === 0}
          onClick={() => setOpen(true)}
        >
          Copy from employee&apos;s address
        </Button>
      </Stack>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Copy one of the employee&apos;s addresses</DialogTitle>
        <DialogContent dividers>
          <List disablePadding>
            {addresses.map((eca) => (
              <ListItemButton
                key={eca.formattedAddress}
                onClick={() => {
                  onSelect(eca);
                  setOpen(false);
                }}
              >
                <ListItemText primary={eca.formattedAddress} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const EmergencyContactIdentityFields = (): ReactElement => (
  <Grid container spacing={2}>
    <Grid size={12}>
      <ControlledTextField
        label="First Name *"
        name="emergencyContact.firstName"
        rules={{ required: 'First name is required.' }}
      />
    </Grid>
    <Grid size={12}>
      <ControlledTextField
        label="Middle Name"
        name="emergencyContact.middleName"
      />
    </Grid>
    <Grid size={12}>
      <ControlledTextField
        label="Last Name *"
        name="emergencyContact.lastName"
        rules={{ required: 'Last name is required.' }}
      />
    </Grid>
    <Grid size={6}>
      <ControlledTextField label="Suffix" name="emergencyContact.suffix" />
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
);

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
            <Grid container columnSpacing={6}>
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
                <AddAddressForm onSave={(values) => addAddress(values)} />
              </Grid>
            </Grid>
          </Stack>

          <Stack sx={{ gap: 1 }}>
            <SectionLabel title="Phone Numbers" />
            <Grid container columnSpacing={6}>
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
                <AddPhoneNumberForm
                  phones={phones}
                  onSave={(values) => addPhone(values)}
                />
              </Grid>
            </Grid>
          </Stack>

          <Stack sx={{ gap: 1 }}>
            <SectionLabel title="Emails" />
            <Grid container columnSpacing={6}>
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
                <AddEmailForm
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
