import { type ReactElement } from 'react';
import { Grid } from '@mui/material';
import { PersonnelCard } from '~/pages/departments/detail/personnel-card';
import { PositionsCard } from '~/pages/departments/detail/positions-card';
import { PLACEHOLDER_ROSTER } from '~/pages/departments/detail/placeholder-data';

export const PersonnelTab = ({
  departmentId,
}: {
  departmentId: number;
}): ReactElement => (
  <Grid container spacing={2} sx={{ mt: 2 }}>
    <Grid size={{ xs: 12, lg: 8 }}>
      <PersonnelCard members={PLACEHOLDER_ROSTER} />
    </Grid>
    <Grid size={{ xs: 12, lg: 4 }}>
      <PositionsCard departmentId={departmentId} />
    </Grid>
  </Grid>
);
