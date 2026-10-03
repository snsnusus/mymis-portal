import { type ReactElement } from 'react';

import { Typography, Stack, Box } from '@mui/material';
import { DataDisplayRow } from '~/components/ui/data-display-row';

const HMODetails = (): ReactElement => (
  <>
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
      }}
    >
      <Stack>
        <Typography
          variant="body1"
          color="text.muted"
          sx={{
            fontWeight: 'fontWeightMedium',
          }}
        >
          HMO
        </Typography>
      </Stack>
      <Box sx={{ flexGrow: 1 }} />
    </Stack>
    <DataDisplayRow label="Account Number">
      <Typography variant="body2">123ACBC</Typography>
    </DataDisplayRow>
    <DataDisplayRow label="Dependent/s">
      <Stack direction="row" spacing={6}>
        <Stack spacing={1.5}>
          <Typography variant="body2">Sofia Leigh Boangus</Typography>
          <Typography variant="body2">ABC123</Typography>
          <Typography variant="body2">Daughter</Typography>
        </Stack>
        <Stack spacing={1.5}>
          <Typography variant="body2">Jazmine Ciel Baribot</Typography>
          <Typography variant="body2">ABC123</Typography>
          <Typography variant="body2">Daughter</Typography>
        </Stack>
      </Stack>
    </DataDisplayRow>
  </>
);

export default HMODetails;
