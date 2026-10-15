import { type ReactElement } from 'react';

import { Stack } from '@mui/material';

import { Card } from '~/components/ui/card';
import { SectionHeader } from '~/components/section-header';

import { RoleAndOrgFields } from '../components/form/employee/role-and-org-fields';

import { HMOSetup } from './employment-details/hmo-setup';
import { GovernmentIdentifiers } from './employment-details/government-identifiers';

export const EmploymentDetails = (): ReactElement => (
  <Stack sx={{ gap: 2 }}>
    <Card
      header={
        <SectionHeader
          header="Role & Organization"
          subheader="Assign the user's department, team, and organizational role."
        />
      }
    >
      <RoleAndOrgFields />
    </Card>
    <HMOSetup />
    <GovernmentIdentifiers />
  </Stack>
);
