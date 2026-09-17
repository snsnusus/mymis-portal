import { type ReactElement } from 'react';

import { useFormContext } from 'react-hook-form';
import { Avatar, Box, Card, Stack, Typography } from '@mui/material';
import { blue, pink } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';

const DynamicAvatar = (): ReactElement => {
  const { watch } = useFormContext();

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const gender = watch('gender');

  const avatarSeed = `${firstName}-${lastName}`.trim() || 'default-robot';

  return (
    <Stack
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
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
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`}
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
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#37474F',
              mb: 1,
              fontSize: '1rem',
            }}
          >
            Hey there! I&apos;m a dynamic avatar.
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#607D8B', lineHeight: 1.5 }}
          >
            Fill-out the form and I&apos;ll personalize my appearance based on
            your inputs.
          </Typography>
        </Card>
      </Stack>
    </Stack>
  );
};

export default DynamicAvatar;
