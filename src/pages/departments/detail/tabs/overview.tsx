import type { DepartmentDetail } from '~/models/department.model';
import { type ReactElement } from 'react';
import { Grid, Stack } from '@mui/material';
import { MandateCard } from '~/pages/departments/detail/mandate-card';
import { AccountingCard } from '~/pages/departments/detail/accounting-card';
import { ContactsCard } from '~/pages/departments/detail/contacts-card';
import { PLACEHOLDER_SCOPES } from '~/pages/departments/detail/placeholder-data';

export const OverviewTab = ({
  department,
}: {
  department: DepartmentDetail;
}): ReactElement => (
  <Grid container spacing={2} sx={{ mt: 2 }}>
    <Grid size={{ xs: 12, md: 8 }}>
      <MandateCard scopes={PLACEHOLDER_SCOPES} />
    </Grid>
    <Grid size={{ xs: 12, md: 4 }}>
      <Stack sx={{ gap: 2 }}>
        <ContactsCard
          primaryContact={department.primaryContact}
          secondaryContact={department.secondaryContact}
        />
        <AccountingCard costCenterCode={department.costCenterCode} />
      </Stack>
    </Grid>
  </Grid>
);
