import type { DepartmentContact } from '~/models/department.model';
import { type ReactElement } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';

interface ContactRowProps {
  role: string;
  contact: DepartmentContact | null;
}

const ContactRow = ({ role, contact }: ContactRowProps): ReactElement => (
  <Stack sx={{ flexDirection: 'row', gap: 1.5, alignItems: 'center' }}>
    <Avatar sx={{ width: 40, height: 40 }}>
      {contact?.fullName.charAt(0) ?? '?'}
    </Avatar>
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', fontWeight: 600, textTransform: 'uppercase' }}
      >
        {role}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {contact?.fullName ?? 'Not assigned'}
      </Typography>
      {contact?.positionTitle && (
        <Typography variant="caption" color="text.secondary">
          {contact.positionTitle}
        </Typography>
      )}
    </Box>
  </Stack>
);

interface ContactsCardProps {
  primaryContact: DepartmentContact | null;
  secondaryContact: DepartmentContact | null;
}

export const ContactsCard = ({
  primaryContact,
  secondaryContact,
}: ContactsCardProps): ReactElement => (
  <Card variant="outlined" sx={{ borderRadius: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Key Contacts
      </Typography>
      <Stack sx={{ gap: 2 }}>
        <ContactRow role="Primary" contact={primaryContact} />
        <ContactRow role="Secondary" contact={secondaryContact} />
      </Stack>
    </CardContent>
  </Card>
);
