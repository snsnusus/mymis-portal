import type { ReactElement } from 'react';
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';
import { AvatarStylePicker } from '~/components/modules/avatar-style-picker';
import { useAuth } from '~/contexts/auth.context';
import {
  useGetEmployee,
  useUpdateMyAvatarStyle,
} from '~/queries/employee.query';

// Profile's Avatar tab: loads the logged-in employee and saves a new style
// as soon as one is picked. The tiles themselves come from AvatarStylePicker.
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

  const hasPhoto = Boolean(employee.avatarThumbnailUrl ?? employee.avatarUrl);

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

      <AvatarStylePicker
        value={employee.avatarStyle}
        seed={employee.id}
        disabled={updateStyle.isPending}
        onChange={(style) => updateStyle.mutate(style)}
      />

      {updateStyle.isError && (
        <Alert severity="error">
          Couldn&apos;t save your avatar style. Please try again.
        </Alert>
      )}
    </Stack>
  );
};

export default AvatarStyleSettings;
