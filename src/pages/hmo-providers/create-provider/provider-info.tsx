import { type ReactElement } from 'react';
import {
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import ControlledDateOnlyPicker from '~/components/form/inputs/controlled/date-only-picker';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { SectionLabel } from '~/components/section-label';

export const ProviderInfo = (): ReactElement => (
  <Card variant="outlined">
    <Stack sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6">Provider Information</Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Core identity, contract terms, and support contacts for this HMO
        provider.
      </Typography>
    </Stack>
    <CardContent sx={{ p: 0 }}>
      <Stack sx={{ p: 2 }}>
        <SectionLabel title="Identity" />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <ControlledTextField
              label="Code *"
              name="code"
              placeholder="MAXI"
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <ControlledTextField
              label="Provider name *"
              name="name"
              fullWidth
            />
          </Grid>
        </Grid>
      </Stack>
      <Divider />
      <Stack sx={{ p: 2 }}>
        <SectionLabel title="Contract terms" />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ControlledDateOnlyPicker
              label="Start date *"
              name="contractStartDate"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ControlledDateOnlyPicker
              label="End date *"
              name="contractEndDate"
            />
          </Grid>
        </Grid>
      </Stack>
      <Divider />
      <Stack sx={{ p: 2 }}>
        <SectionLabel title="Support contact" />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ControlledTextField
              label="Account manager"
              name="accountManagerName"
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ControlledTextField label="Hotline" name="hotline" fullWidth />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ControlledTextField
              label="Support email"
              name="supportEmail"
              type="email"
              placeholder="support@provider.com"
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ControlledTextField
              label="Portal URL"
              name="websiteUrl"
              placeholder="https://"
              fullWidth
            />
          </Grid>
        </Grid>
      </Stack>
    </CardContent>
  </Card>
);
