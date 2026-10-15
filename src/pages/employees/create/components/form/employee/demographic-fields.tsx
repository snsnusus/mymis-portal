import { Grid, MenuItem } from '@mui/material';
import { type ReactElement } from 'react';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';

import ControlledDateOnlyPicker from '~/components/form/inputs/controlled/date-only-picker';
import { ControlledAutocomplete } from '~/components/form/inputs/controlled/autocomplete';

import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  NATIONALITY_OPTIONS,
} from '../../../config/options';

export const EmployeeDemographicFields = (): ReactElement => (
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 6 }}>
      <ControlledTextField
        label="Gender *"
        name="gender"
        select
        rules={{ required: 'Gender is required.' }}
      >
        {GENDER_OPTIONS.map(({ label, value }) => (
          <MenuItem key={label} value={value}>
            {label}
          </MenuItem>
        ))}
      </ControlledTextField>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <ControlledTextField
        label="Marital Status *"
        name="maritalStatus"
        select
        rules={{ required: 'Marital status is required.' }}
      >
        {MARITAL_STATUS_OPTIONS.map(({ label, value }) => (
          <MenuItem key={label} value={value}>
            {label}
          </MenuItem>
        ))}
      </ControlledTextField>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <ControlledDateOnlyPicker label="Birthdate" name="birthdate" />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <ControlledTextField label="Birthplace" name="birthplace" />
    </Grid>
    <Grid size={6}>
      <ControlledAutocomplete
        label="Nationality"
        name="nationality"
        options={NATIONALITY_OPTIONS}
      />
    </Grid>
  </Grid>
);
