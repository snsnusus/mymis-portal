import type { ReactElement } from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { DataDisplayRow } from '~/components/ui/data-display-row';

export const Government = (): ReactElement => (
  <Stack
    spacing={2}
    sx={{
      padding: 2,
    }}
  >
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
      }}
    >
      <Typography
        variant="body1"
        color="text.muted"
        sx={{
          fontWeight: 'fontWeightMedium',
        }}
      >
        Government Related Information
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
    </Stack>
    <DataDisplayRow label="SSS">
      <Typography variant="body2">1234</Typography>
    </DataDisplayRow>
    <DataDisplayRow label="PagIBIG">
      <Typography variant="body2">12AB</Typography>
    </DataDisplayRow>
    <DataDisplayRow label="PhilHealth">
      <Typography variant="body2">AB12</Typography>
    </DataDisplayRow>
    <DataDisplayRow label="TIN">
      <Typography variant="body2">ABCD</Typography>
    </DataDisplayRow>
  </Stack>
);

export default Government;
