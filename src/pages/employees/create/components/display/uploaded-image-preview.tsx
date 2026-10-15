import { styled, Avatar, Stack, Typography } from '@mui/material';
import { useMemo, type ReactElement } from 'react';
import { truncateFilename } from '~/utils';

const StyledTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'type',
})<{ type: string }>(({ theme, type }) => ({
  fontSize: theme.typography.h6.fontSize,
  fontWeight: 900,
  border: '2px solid',
  borderColor: theme.palette.divider,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 2.5),
  backgroundColor:
    type === 'filename'
      ? theme.palette.secondary.main
      : theme.palette.info.main,
  color: theme.palette.primary.contrastText,
}));

export const UploadedImagePreview = ({
  image,
}: {
  image: File;
}): ReactElement => {
  const imageUrl = useMemo(() => URL.createObjectURL(image), [image]);

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <Avatar
        src={imageUrl}
        sx={{ width: 150, height: 150, objectFit: 'contain' }}
      />
      <Stack
        sx={{
          gap: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {image && (
          <Typography variant="body2" color="text.muted">
            {truncateFilename(image.name)}
          </Typography>
        )}
        <Stack
          direction="row"
          sx={{
            gap: 1,
          }}
        >
          <StyledTypography type="filename">
            {image?.type.split('/')[1].toUpperCase()}
          </StyledTypography>
          <StyledTypography type="filesize">
            {image && image.size > 1024 * 1024
              ? `${((image?.size ?? 0) / (1024 * 1024)).toFixed(0)} MB`
              : `${((image?.size ?? 0) / 1024).toFixed(0)} KB`}
          </StyledTypography>
        </Stack>
      </Stack>
    </Stack>
  );
};
