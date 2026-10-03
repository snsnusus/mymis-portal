import { type ReactElement } from 'react';
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';

export const GovernmentIdentifiers = (): ReactElement => (
  <Card variant="outlined">
    <Stack
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6">Government Identifiers</Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Record government-issued identifiers such as tax, social security, and
        health insurance identifiers.
      </Typography>
    </Stack>
    <CardContent>
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
    </CardContent>
  </Card>
);
