import { type ReactElement } from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { truncateFilename } from '~/utils';

interface ImagePreviewProps {
  croppedImage: File;
}

const ImagePreview = ({ croppedImage }: ImagePreviewProps): ReactElement => (
  <Stack
    direction="row"
    sx={{
      justifyContent: 'center',
      gap: 4,
    }}
  >
    <Avatar
      src={URL.createObjectURL(croppedImage)}
      sx={{ width: 150, height: 150, objectFit: 'contain' }}
    />
    <Stack
      sx={{
        gap: 1,
        justifyContent: 'center',
      }}
    >
      {croppedImage && (
        <Typography variant="body2" color="text.muted">
          {truncateFilename(croppedImage.name)}
        </Typography>
      )}
      <Stack
        direction="row"
        sx={{
          gap: 1,
        }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            px: 1,
            py: 0.25,
            backgroundColor: 'secondary.main',
            color: 'secondary.contrastText',
          }}
        >
          {croppedImage?.type.split('/')[1].toUpperCase()}
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            px: 1,
            py: 0.25,
            backgroundColor: 'info.main',
            color: 'info.contrastText',
          }}
        >
          {croppedImage && croppedImage.size > 1024 * 1024
            ? `${((croppedImage?.size ?? 0) / (1024 * 1024)).toFixed(0)} MB`
            : `${((croppedImage?.size ?? 0) / 1024).toFixed(0)} KB`}
        </Typography>
      </Stack>
    </Stack>
  </Stack>
);

export default ImagePreview;
