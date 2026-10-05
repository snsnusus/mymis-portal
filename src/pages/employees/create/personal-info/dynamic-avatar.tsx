import { type ReactElement } from 'react';
import type { AvatarStyle } from '~/models/employee.model';
import { useController, useFormContext } from 'react-hook-form';
import { Avatar, Box, Card, Stack, Typography } from '@mui/material';
import { blue, pink } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import { AvatarStylePicker } from '~/components/modules/avatar-style-picker';
import { useDebouncedValue } from '~/hooks/use-debounced-value';
import { getDefaultAvatarUri } from '~/utils/default-avatar';

const DynamicAvatar = (): ReactElement => {
  const { watch } = useFormContext();
  const firstName: string = watch('firstName') ?? '';
  const lastName: string = watch('lastName') ?? '';
  const gender = watch('gender');

  // The picker is a controlled component, so connect it to the form field.
  const { field: avatarStyleField } = useController({ name: 'avatarStyle' });
  const avatarStyle = avatarStyleField.value as AvatarStyle | null;

  // There's no employee id until the record is saved, so the preview is
  // seeded from the typed name. Debounced so the face changes once typing
  // pauses, instead of on every keystroke.
  const debouncedName = useDebouncedValue(
    `${firstName} ${lastName}`.trim(),
    300
  );
  const previewSeed = `default:${debouncedName}`;

  return (
    <Stack sx={{ alignItems: 'center', gap: 2 }}>
      <Stack
        direction="row"
        sx={{
          gap: 2.5,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{
            width: 150,
            height: 150,
            objectFit: 'contain',
            bgcolor: gender
              ? gender === 'MALE'
                ? alpha(blue[300], 0.6)
                : alpha(pink[300], 0.6)
              : 'inherit',
          }}
        >
          <Avatar
            src={getDefaultAvatarUri(avatarStyle, previewSeed)}
            alt="Avatar preview"
            variant="circular"
            sx={{
              width: { xs: 75, md: 125 },
              height: { xs: 75, md: 125 },
            }}
          />
        </Avatar>
        <Card
          elevation={0}
          sx={{
            p: 2.5,
            border: '2px solid #B0BEC5',
            borderRadius: 4,
            position: 'relative',
            overflow: 'visible',
            backgroundColor: '#ffffff',
            maxWidth: 320,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: '-10px',
              top: '50%',
              transform: 'translateY(-50%) rotate(45deg)',
              width: 16,
              height: 16,
              backgroundColor: '#ffffff',
              borderLeft: '2px solid #B0BEC5',
              borderBottom: '2px solid #B0BEC5',
              zIndex: 1,
            }}
          />
          <Typography
            sx={{
              fontWeight: 'fontWeightMedium',
              mb: 1,
            }}
          >
            Hey there! <br /> I&apos;m a dynamic avatar.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pick a style below, and fill out the name to personalize my look.
          </Typography>
        </Card>
      </Stack>

      <AvatarStylePicker
        value={avatarStyle}
        onChange={avatarStyleField.onChange}
        seed={previewSeed}
        previewSize={56}
      />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        Preview only. The style you pick is saved; the final avatar is generated
        when the employee is created.
      </Typography>
    </Stack>
  );
};

export default DynamicAvatar;
