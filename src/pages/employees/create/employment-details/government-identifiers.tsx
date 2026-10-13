import { type ReactElement } from 'react';
import { Grid } from '@mui/material';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { Card } from '~/components/ui/card';
import { SectionHeader } from '~/components/section-header';

export const GovernmentIdentifiers = (): ReactElement => (
  <Card
    header={
      <SectionHeader
        header="Government Identifiers"
        subheader="Record government-issued identifiers such as tax, social security, and
        health insurance identifiers."
      />
    }
  >
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
  </Card>
);
