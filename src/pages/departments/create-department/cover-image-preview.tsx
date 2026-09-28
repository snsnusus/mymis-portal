import { type ReactElement } from 'react';
import { Box, Card, CardMedia, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { truncateFilename } from '~/utils';

export const CoverImagePreview = ({
  selectedFile,
  removeFile,
}: {
  selectedFile: File | null;
  removeFile: (index: number) => void;
}): ReactElement | null => {
  if (!selectedFile) return null;

  const previewUrl = URL.createObjectURL(selectedFile);

  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
      }}
    >
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          removeFile(0);
        }}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'rgba(0, 0, 0, 0.6)',
          color: 'common.white',
          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
          zIndex: 2,
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <CardMedia
        component="img"
        height="180"
        image={previewUrl}
        alt="Upload preview"
        sx={{ objectFit: 'cover' }}
      />
      <Box
        sx={{ p: 1.5, display: 'flex', flexDirection: 'column', minWidth: 0 }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {truncateFilename(selectedFile.name)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
        </Typography>
      </Box>
    </Card>
  );
};
