import {
  styled,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import { type ReactElement } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';

export interface RosterMember {
  id: string;
  name: string;
  email: string;
  position: string;
  avatarUrl: string;
  roleType: 'Head' | 'Lead' | 'Member';
  employmentType: 'Permanent' | 'Contract';
}

const ROLE_BORDER_COLOR: Record<RosterMember['roleType'], string> = {
  Head: 'primary.light',
  Lead: 'divider',
  Member: 'transparent',
};

const Heading = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 3, 0, 3),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const PersonnelCard = ({
  members,
}: {
  members: RosterMember[];
}): ReactElement => (
  <Card variant="outlined" sx={{ borderRadius: 3 }}>
    <Heading>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Personnel & Staffing
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Unified corporate directory roster including leadership designations.
        </Typography>
      </Box>
      <Button variant="contained" startIcon={<PersonAddIcon />}>
        Add Personnel
      </Button>
    </Heading>

    <CardContent sx={{ px: 1 }}>
      <List sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 1 }}>
        {members.map((member) => (
          <ListItem
            key={member.id}
            secondaryAction={
              <Stack sx={{ flexDirection: 'row', gap: 0.5 }}>
                <Tooltip title="Email Profile">
                  <IconButton size="small" href={`mailto:${member.email}`}>
                    <EmailIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Modify Assignment">
                  <IconButton size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Offboard">
                  <IconButton size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            }
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: ROLE_BORDER_COLOR[member.roleType],
              bgcolor: (theme) =>
                member.roleType === 'Head'
                  ? alpha(theme.palette.primary.main, 0.08)
                  : theme.palette.background.paper,
              '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' },
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={member.avatarUrl}
                sx={{
                  border: '1px solid',
                  borderColor: 'primary.main',
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Stack
                  sx={{
                    flexDirection: 'row',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body1">{member.name}</Typography>
                  {member.roleType === 'Head' && (
                    <Chip label="Dept Head" color="primary" />
                  )}
                  {member.roleType === 'Lead' && (
                    <Chip label="Team Lead" color="secondary" />
                  )}
                  {member.employmentType === 'Contract' && (
                    <Chip label="Contractor" variant="outlined" />
                  )}
                </Stack>
              }
              secondary={member.position}
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);
