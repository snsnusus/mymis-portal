import { type ReactElement, useRef, useState, type ReactNode } from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  criteria?: ReactNode;
}

const FileUploadZone = ({
  onFilesSelected,
  multiple = true,
  criteria,
}: FileUploadZoneProps): ReactElement => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent): void => {
    e.preventDefault();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true);
    else if (e.type === 'dragleave' || e.type === 'drop')
      setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files?.length) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files?.length) {
      onFilesSelected(Array.from(e.target.files));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Paper
      variant="outlined"
      onDragEnter={handleDrag}
      onDragOver={(e) => handleDrag(e)}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      sx={{
        p: 4,
        paddingTop: 1,
        borderRadius: 3,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: isDragActive ? 'primary.main' : 'divider',
        backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        textAlign: 'center',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'grey.50',
        },
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: '50%',
            bgcolor: isDragActive ? 'primary.light' : 'grey.100',
            color: isDragActive ? 'primary.main' : 'text.secondary',
            display: 'inline-flex',
            transition: 'color 0.2s',
          }}
        >
          <CloudUploadIcon
            sx={{
              fontSize: '3rem',
            }}
          />
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 'fontWeightMedium' }}>
          Drag & drop files here, or{' '}
          <Typography
            component="span"
            variant="h6"
            color="primary"
            sx={{ fontWeight: 'fontWeightMedium' }}
          >
            browse
          </Typography>
        </Typography>
      </Stack>
      {criteria && (
        <Stack
          spacing={1}
          sx={{
            mt: 1,
            mx: 'auto',
            maxWidth: 'fit-content',
            alignItems: 'flex-start',
          }}
        >
          {criteria}
        </Stack>
      )}
    </Paper>
  );
};

export default FileUploadZone;
