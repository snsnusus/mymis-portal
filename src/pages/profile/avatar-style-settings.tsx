import type { ReactElement } from 'react';
import type { AvatarStyle } from '~/models/employee.model';
import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useAuth } from '~/contexts/auth.context';
import {
  useGetEmployee,
  useUpdateMyAvatarStyle,
} from '~/queries/employee.query';
import {
  AVATAR_STYLES,
  DEFAULT_AVATAR_STYLE,
  getDefaultAvatarUri,
} from '~/utils/default-avatar';

const STYLE_LABELS: Record<AvatarStyle, string> = {
  avataaars: 'Avatars',
  bottts: 'Bots',
  constellation: 'Constellation',
};

const AvatarStyleSettings = (): ReactElement => {
  const { user } = useAuth();
  // The JWT's sub claim is a string; the API's ids are numbers.
  const employeeId = user ? Number(user.id) : undefined;

  const {
    data: employee,
    isInitialLoading,
    isError,
  } = useGetEmployee(employeeId);
  const updateStyle = useUpdateMyAvatarStyle();

  if (isInitialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (isError || !employee) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Couldn&apos;t load your avatar settings.</Alert>
      </Box>
    );
  }

  const currentStyle = employee.avatarStyle ?? DEFAULT_AVATAR_STYLE;
  const hasPhoto = Boolean(employee.avatarThumbnailUrl ?? employee.avatarUrl);

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newStyle: AvatarStyle | null
  ): void => {
    // Clicking the already-selected button gives null; ignore it.
    if (newStyle && newStyle !== currentStyle) {
      updateStyle.mutate(newStyle);
    }
  };

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 'fontWeightMedium' }}>
          Default avatar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {hasPhoto
            ? 'Shown whenever your profile photo can’t be displayed. Everyone sees the style you pick.'
            : 'Shown in place of a profile photo. Everyone sees the style you pick.'}
        </Typography>
      </Box>

      <ToggleButtonGroup
        exclusive
        value={currentStyle}
        onChange={handleChange}
        disabled={updateStyle.isPending}
        aria-label="Default avatar style"
      >
        {AVATAR_STYLES.map((style) => (
          <ToggleButton
            key={style}
            value={style}
            sx={{ flexDirection: 'column', gap: 1, px: 3, py: 1.5 }}
          >
            <Box
              component="img"
              src={getDefaultAvatarUri(style, employee.id)}
              alt=""
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: 'action.hover',
              }}
            />
            <Typography variant="body2" sx={{ textTransform: 'none' }}>
              {STYLE_LABELS[style]}
            </Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {updateStyle.isError && (
        <Alert severity="error">
          Couldn&apos;t save your avatar style. Please try again.
        </Alert>
      )}
    </Stack>
  );
};

export default AvatarStyleSettings;
