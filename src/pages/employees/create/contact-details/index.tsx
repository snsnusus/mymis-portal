import { type ReactElement } from 'react';
import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { Address } from './address';
import { PhoneNumber } from './phone-number';
import { Email } from './email';
import { EmergencyContact } from './emergency-contact';

export const ContactDetails = (): ReactElement => (
  <>
    <Card variant="outlined">
      <Stack
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">Contact Details</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage primary contact information, including physical addresses,
          phone numbers, and email accounts.
        </Typography>
      </Stack>
      <CardContent sx={{ padding: 0 }}>
        <Stack>
          <Address />
          <Divider />
          <PhoneNumber />
          <Divider />
          <Email />
        </Stack>
      </CardContent>
    </Card>
    <EmergencyContact />
  </>
);
