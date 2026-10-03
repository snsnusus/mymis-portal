import type { Department } from '~/models/department.model';
import { type ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import { InteractiveCard } from '~/components/ui/interactive-card';
import { getPath } from '../utils';
import { StatusChip } from './status-chip';

export const DepartmentCard = ({
  department,
}: {
  department: Department;
}): ReactElement => (
  <InteractiveCard elevation={2}>
    <CardActionArea component={RouterLink} to={getPath(department)}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="div"
          image={department.coverImageUrl ?? undefined}
          sx={{ height: 130, bgcolor: 'grey.300', filter: 'brightness(0.9)' }}
        />
        <Chip
          label={department.slug}
          color="primary"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            fontWeight: 700,
            boxShadow: 2,
          }}
        />
      </Box>

      <CardContent sx={{ pt: 2, pb: 1, minWidth: 0 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, mb: 1 }}
        >
          {department.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: 40,
            mb: 2,
          }}
        >
          {department.description}
        </Typography>
        <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <GroupsIcon color="action" />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {department.employeeCount}{' '}
              {department.employeeCount === 1 ? 'member' : 'members'}
            </Typography>
          </Stack>
          <StatusChip status={department.status} />
        </Stack>
      </CardContent>

      <Box
        sx={{
          p: 2,
          pt: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {department.primaryContactName ? (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.875rem' }}>
              {department.primaryContactName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {department.primaryContactName}
            </Typography>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: 'action.disabledBackground',
                color: 'text.disabled',
              }}
            >
              <PersonIcon sx={{ fontSize: '1rem' }} />
            </Avatar>
            <Typography
              variant="body2"
              color="text.disabled"
              sx={{ fontStyle: 'italic' }}
            >
              Unassigned
            </Typography>
          </Stack>
        )}
        <Typography
          variant="body2"
          color="primary"
          sx={{ fontWeight: 600 }}
          className="view-details-text"
        >
          View Details &rarr;
        </Typography>
      </Box>
    </CardActionArea>
  </InteractiveCard>
);
