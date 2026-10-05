import type { ReactElement } from 'react';
import type { AvatarStyle } from '~/models/employee.model';
import { Avatar, Box } from '@mui/material';
import { getDefaultAvatarUri } from '~/utils/default-avatar';

type EmployeeAvatarProps = {
  id: number; // seed for the generated avatar
  name: string; // alt text
  avatarUrl?: string | null; // uploaded photo (thumbnail preferred), if any
  avatarStyle?: AvatarStyle | null; // chosen style, or null for the default
  size?: number; // width and height in px
};

// Shows the employee's uploaded photo. If there isn't one, or it fails to load,
// shows their generated DiceBear avatar in their chosen style instead.
export const EmployeeAvatar = ({
  id,
  name,
  avatarUrl,
  avatarStyle,
  size = 32,
}: EmployeeAvatarProps): ReactElement => {
  const generatedUri = getDefaultAvatarUri(avatarStyle, id);

  return (
    <Avatar
      src={avatarUrl ?? undefined}
      alt={name}
      sx={{ width: size, height: size, bgcolor: 'action.hover' }}
    >
      {/* MUI renders children whenever there's no src or the src fails to load */}
      <Box
        component="img"
        src={generatedUri}
        alt={name}
        sx={{ width: '100%', height: '100%' }}
      />
    </Avatar>
  );
};
