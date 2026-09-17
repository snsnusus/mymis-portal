import { type ReactElement } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { Address } from './address';
import { PhoneNumber } from './phone-number';
import { Email } from './email';
import { EmergencyContact } from './emergency-contact';

export const ContactDetails = (): ReactElement => (
  <>
    <Card variant="outlined">
      <Box
        sx={{
          p: 2,
          bgcolor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Contact Details
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Manage primary contact information, including physical addresses,
          phone numbers, and email accounts.
        </Typography>
      </Box>
      <CardContent>
        <Stack sx={{ gap: 2 }}>
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
