import { type AvatarStyle } from '~/models/employee.model';
import { type ReactElement } from 'react';
import { SpeechCardContainer, SpeechCardArrow } from '../styled';
import { alpha, Avatar, Stack, Typography } from '@mui/material';
import { AvatarStylePicker } from '~/components/modules/avatar-style-picker';

import { getDefaultAvatarUri } from '~/utils/default-avatar';
import { blue, pink } from '@mui/material/colors';

interface DynamicAvatarProps {
  avatarStyle: AvatarStyle | null;
  gender: string;
  onStyleChange: (avatarStyle: AvatarStyle) => void;
  seed: string;
}

export const SpeechCard = ({ children }: PropsWithChildren): ReactElement => (
  <SpeechCardContainer elevation={0}>
    <SpeechCardArrow />
    {children}
  </SpeechCardContainer>
);

export const DynamicAvatar = (props: DynamicAvatarProps): ReactElement => {
  const { avatarStyle, gender, onStyleChange, seed } = props;
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
            alt="Avatar Preview"
            src={getDefaultAvatarUri(avatarStyle, seed)}
            sx={{
              width: { xs: 75, md: 125 },
              height: { xs: 75, md: 125 },
            }}
            variant="circular"
          />
        </Avatar>
        <SpeechCard>
          <Stack sx={{ gap: 1 }}>
            <Typography
              sx={{
                fontWeight: 'fontWeightMedium',
              }}
            >
              Hey there! <br /> I&apos;m a dynamic avatar.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pick a style below, and fill out the name to personalize my look.
            </Typography>
          </Stack>
        </SpeechCard>
      </Stack>

      <AvatarStylePicker
        onChange={onStyleChange}
        previewSize={56}
        seed={seed}
        value={avatarStyle}
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
