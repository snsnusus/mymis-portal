import { type ReactElement } from 'react';
import { Grid } from '@mui/material';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';

export const EmployeeIdentityFields = (): ReactElement => (
  <Grid container spacing={2}>
    <Grid size={12}>
      <ControlledTextField
        label="First Name *"
        name="firstName"
        rules={{ required: 'First name is required.' }}
      />
    </Grid>
    <Grid size={12}>
      <ControlledTextField
        label="Middle Name *"
        name="middleName"
        rules={{ required: 'Middle name is required.' }}
      />
    </Grid>
    <Grid size={12}>
      <ControlledTextField
        label="Last Name *"
        name="lastName"
        rules={{ required: 'Last name is required.' }}
      />
    </Grid>
    <Grid size={4}>
      <ControlledTextField label="Suffix" name="suffix" />
    </Grid>
  </Grid>
);
