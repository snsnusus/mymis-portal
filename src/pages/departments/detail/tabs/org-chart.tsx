import { type ReactElement } from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

export const OrgChartTab = (): ReactElement => (
  <Paper
    variant="outlined"
    sx={{ mt: 2, p: 6, borderRadius: 3, textAlign: 'center' }}
  >
    <Stack sx={{ alignItems: 'center', gap: 1 }}>
      <AccountTreeIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Org chart coming soon
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
        The org chart needs reporting lines (who reports to whom), which
        aren&apos;t available from the API yet.
      </Typography>
    </Stack>
  </Paper>
);
