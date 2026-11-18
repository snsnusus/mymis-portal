import { type ReactElement } from 'react';

import { Grid, Stack } from '@mui/material';

import { Card } from '~/components/ui/card';
import { SectionHeader } from '~/components/section-header';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';

import { EmploymentAndOrganizationFields } from './employment-and-organization-fields';
import { HmoCoverageFields } from './hmo-coverage-fields';

const GovernmentIdentifierFields = (): ReactElement => (
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 6 }}>
      <ControlledTextField label="SS Number *" name="ssNumber" />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <ControlledTextField
        label="PhilHealth Number *"
        name="philHealthNumber"
      />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <ControlledTextField label="PagIBIG Number *" name="pagIbigNumber" />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <ControlledTextField label="TIN Number *" name="tinNumber" />
    </Grid>
  </Grid>
);

export const EmploymentDetails = (): ReactElement => (
  <Stack sx={{ gap: 2 }}>
    <Card
      header={
        <SectionHeader
          header="Employment & Organization"
          subheader="Set the employee's type, status, start date, department and position."
        />
      }
    >
      <EmploymentAndOrganizationFields />
    </Card>

    <Card
      header={
        <SectionHeader
          header="HMO & Coverage"
          subheader="Optional. Enroll the employee and their dependents now, or later from their profile."
        />
      }
    >
      <HmoCoverageFields />
    </Card>

    <Card
      header={
        <SectionHeader
          header="Government Identifiers"
          subheader="Record government-issued identifiers such as tax, social security, and
        health insurance identifiers."
        />
      }
    >
      <GovernmentIdentifierFields />
    </Card>
  </Stack>
);
