import { type ReactElement } from 'react';
import { Stack } from '@mui/material';
import { HMOSetup } from './hmo-setup';
import { GovernmentIdentifiers } from './government-identifiers';
import { OrganizationDetails } from './organization-details';

export const EmploymentDetails = (): ReactElement => (
  <Stack sx={{ gap: 2 }}>
    <OrganizationDetails />
    <HMOSetup />
    <GovernmentIdentifiers />
  </Stack>
);
