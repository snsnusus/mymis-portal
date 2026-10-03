import type { DepartmentDetail } from '~/models/department.model';
import { type ReactElement } from 'react';
import {
  alpha,
  styled,
  Paper,
  Box,
  Stack,
  Typography,
  IconButton,
  Chip,
  type PaperProps,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import GroupsIcon from '@mui/icons-material/Groups';
import HubIcon from '@mui/icons-material/Hub';

const HeroContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'coverImageUrl',
})<PaperProps & { coverImageUrl: string | null }>(
  ({ theme, coverImageUrl }) => ({
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
    position: 'relative',
    overflow: 'hidden',
    minHeight: 180,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[500],
    backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: theme.palette.common.white,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius:
      typeof theme.shape.borderRadius === 'number'
        ? theme.shape.borderRadius * 3
        : theme.shape.borderRadius,
  })
);

const Scrim = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  backgroundColor: alpha(theme.palette.common.black, 0.6),
}));

const HeroChip = styled(Chip)(({ theme }) => ({
  color: theme.palette.common.white,
  borderColor: alpha(theme.palette.common.white, 0.4),
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '& .MuiChip-icon': {
    color: theme.palette.common.white,
  },
  padding: 8,
}));

export const DepartmentHero = (props: DepartmentDetail): ReactElement => (
  <HeroContainer elevation={0} coverImageUrl={props.coverImageUrl}>
    <Scrim />
    <Stack
      sx={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { md: 'center' },
        gap: 2,
      }}
    >
      <Box>
        <Stack sx={{ flexDirection: 'row', gap: 1.5, alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {props.name} ({props.slug})
          </Typography>
          <IconButton
            size="small"
            aria-label="Edit department"
            sx={{ color: (theme) => alpha(theme.palette.common.white, 0.8) }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            maxWidth: 700,
            color: (theme) => alpha(theme.palette.common.white, 0.9),
          }}
        >
          {props.description}
        </Typography>
      </Box>
      <Stack
        sx={{
          justifyContent: 'flex-end',
          flexDirection: 'row',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <HeroChip
          icon={<GroupsIcon fontSize="small" />}
          label={`${props.employeeCount} ${
            props.employeeCount > 1 ? 'employees' : 'employee'
          }`}
          variant="outlined"
        />
        <HeroChip
          icon={<HubIcon fontSize="small" />}
          label={props.status}
          variant="outlined"
        />
      </Stack>
    </Stack>
  </HeroContainer>
);
