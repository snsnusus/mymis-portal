import { type ReactElement } from 'react';
import { HMOSetup } from './hmo-setup';
import { GovernmentIdentifiers } from './goverment-identifiers';
import { OrganizationDetails } from './organization-details';

export const EmploymentDetails = (): ReactElement => (
  <>
    <OrganizationDetails />
    <HMOSetup />
    <GovernmentIdentifiers />
  </>
);
