import { type ReactElement } from 'react';
import { Stack } from '@mui/material';
import { Card } from '~/components/ui/card';
import { SectionHeader } from '~/components/section-header';
import { Addresses } from './addresses';
import { PhoneNumber } from './phone-number';
import { Email } from './email';
import { EmergencyContact } from './emergency-contact';

export const ContactDetails = (): ReactElement => (
  <Stack sx={{ gap: 2 }}>
    <Card
      header={
        <SectionHeader
          header="Contact Details"
          subheader="Manage primary contact information, including physical addresses,
          phone numbers, and email accounts."
        />
      }
    >
      <Stack sx={{ gap: 1 }}>
        <Addresses />
        <PhoneNumber />
        <Email />
      </Stack>
    </Card>
    <EmergencyContact />
  </Stack>
);
