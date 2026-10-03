import { type ReactElement } from 'react';

import { Typography, Stack, Box, Divider } from '@mui/material';
import { DataDisplayRow } from '~/components/ui/data-display-row';

const EmploymentDetails = (): ReactElement => (
  <>
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
        Employment Details
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
    </Stack>
    <DataDisplayRow label="Employee ID">
      <Typography variant="body2">M-20-457</Typography>
    </DataDisplayRow>
    <DataDisplayRow label="Position">
      <Typography variant="body2">Senior Specialist</Typography>
    </DataDisplayRow>
    <DataDisplayRow label="Department">
      <Typography variant="body2">Information Technology</Typography>
    </DataDisplayRow>
    <DataDisplayRow label="Status">
      <Typography variant="body2">Regular</Typography>
    </DataDisplayRow>
    <DataDisplayRow label="Employee Type">
      <Typography variant="body2">Management</Typography>
    </DataDisplayRow>
    <DataDisplayRow label="Manager">
      <Typography variant="body2">Ralph Bondoc</Typography>
    </DataDisplayRow>
    <DataDisplayRow label="Joining Date">
      <Typography variant="body2">November 15, 2021</Typography>
    </DataDisplayRow>
    <Divider />
  </>
);

export default EmploymentDetails;
