import type { ReactElement } from 'react';
import { useState } from 'react';

import { useController } from 'react-hook-form';
import { styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FileUploadIcon from '@mui/icons-material/FileUpload';

interface File {
  name: string;
  size: number;
  type: string;
  preview: string | undefined;
}

interface ControlledFileUploadProps {
  name: string;
  label: string;
  multiple?: boolean;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ControlledFileUpload = ({
  name,
  label,
  multiple = false,
}: ControlledFileUploadProps): ReactElement => {
  const [file, setFile] = useState<File>({
    name: '',
    size: 0,
    type: '',
    preview: undefined,
  });

  const {
    field: { ref, ...field },
  } = useController({
    name,
  });

  return (
    <Stack
      sx={{
        gap: 2,
      }}
    >
      <Box>
        <Avatar
          src={file.preview}
          variant="rounded"
          sx={{ width: '100%', height: '250px', objectFit: 'cover' }}
        />
        {file.preview && (
          <Stack
            sx={{
              direction: 'row',
              alignItems: 'center',
            }}
          >
            <Typography>{file.name}</Typography>
            <Typography>{file.size}</Typography>
            <Typography>{file.type.split('/')[1].toUpperCase()}</Typography>
          </Stack>
        )}
      </Box>
      <Button
        component="label"
        role={undefined}
        tabIndex={-1}
        startIcon={<FileUploadIcon />}
      >
        {label ?? 'Upload File'}
        <VisuallyHiddenInput
          name={name}
          ref={ref}
          type="file"
          onChange={(e) => {
            field.onChange(e.target.files);

            if (e.target.files) {
              const uploadedFile = e.target.files[0];

              const reader = new FileReader();
              reader.onloadend = () => {
                setFile({
                  name: uploadedFile.name,
                  size: uploadedFile.size,
                  type: uploadedFile.type,
                  preview: reader.result as string,
                });
              };
              reader.readAsDataURL(uploadedFile);
            }
          }}
          multiple={multiple}
        />
      </Button>
    </Stack>
  );
};

export default ControlledFileUpload;
