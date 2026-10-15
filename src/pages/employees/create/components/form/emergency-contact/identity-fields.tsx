import { type ReactElement } from 'react';

import { Grid, MenuItem } from '@mui/material';

import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { ControlledPhoneNumberInput } from '~/components/form/inputs/controlled/phone-number-input';

import { matchIsValidTel } from 'mui-tel-input';

import { RELATIONSHIP_OPTIONS } from '../../../config/options';

export const EmergencyContactIdentityFields = (): ReactElement => (
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
