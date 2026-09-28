// ProviderInfo.tsx
import { type ReactElement } from 'react';
import {
  Card,
  Box,
  CardContent,
  Grid,
  Typography,
  MenuItem,
  Divider,
} from '@mui/material';
import DataDisplayRow from '~/components/ui/data-display-row';
import { ControlledTextField } from '~/components/form/controlled';
import ControlledDatePicker from '~/components/form/controlled/controlled-datepicker';

export const ProviderInfo = (): ReactElement => (
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
        Provider Information
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Core identity, contract terms, and support contacts for this HMO
        provider.
      </Typography>
    </Box>
    <CardContent>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            Identity
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <DataDisplayRow label="Provider Name *">
            <ControlledTextField name="name" fullWidth size="small" />
          </DataDisplayRow>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DataDisplayRow label="Code *" config={{ labelBox: { width: 70 } }}>
            <ControlledTextField
              name="code"
              fullWidth
              size="small"
              placeholder="MAXICARE"
            />
          </DataDisplayRow>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DataDisplayRow label="Status *">
            <ControlledTextField name="status" select fullWidth size="small">
              {['Active', 'Inactive'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </ControlledTextField>
          </DataDisplayRow>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DataDisplayRow label="Logo URL">
            <ControlledTextField name="logoUrl" fullWidth size="small" />
          </DataDisplayRow>
        </Grid>
        <Grid size={12}>
          <Divider sx={{ my: 1 }} />
        </Grid>
        <Grid size={12}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            Support Contact
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DataDisplayRow label="Account Manager *">
            <ControlledTextField
              name="accountManagerName"
              fullWidth
              size="small"
            />
          </DataDisplayRow>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DataDisplayRow label="Hotline *">
            <ControlledTextField name="hotline" fullWidth size="small" />
          </DataDisplayRow>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DataDisplayRow label="Support Email *">
            <ControlledTextField
              name="supportEmail"
              type="email"
              fullWidth
              size="small"
            />
          </DataDisplayRow>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DataDisplayRow label="Portal URL">
            <ControlledTextField name="portalUrl" fullWidth size="small" />
          </DataDisplayRow>
        </Grid>
        <Grid size={12}>
          <Divider sx={{ my: 1 }} />
        </Grid>
        <Grid size={12}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            Contract Term
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DataDisplayRow label="Start Date *">
            <ControlledDatePicker name="contractStartDate" />
          </DataDisplayRow>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DataDisplayRow label="End Date *">
            <ControlledDatePicker name="contractEndDate" />
          </DataDisplayRow>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
