import { useState, type ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

import { ControlledTextField } from '~/components/form/controlled';
import DataDisplayRow from '~/components/ui/data-display-row';
import FileUploadZone from '~/components/form/base/file-upload-zone';
import FileCriteria from '~/components/ui/file-criteria';
import { ControlledAutocomplete } from '~/components/form/controlled/autocomplete';
import { CoverImagePreview } from './cover-image-preview';

import { validateFile } from '~/utils';

const MAX_FILE_SIZE_MB = 5;
const FILE_CONFIG = {
  maxFileSize: { bytes: MAX_FILE_SIZE_MB * 1024 * 1024, formattedLabel: '5MB' },
  acceptedFormats: ['image/jpeg', 'image/png', 'image/tiff'],
};

const CoverImage = (): ReactElement => {
  const { watch, setValue } = useFormContext();
  const [invalidFile, setInvalidFile] = useState<File | null>(null);

  const coverImage = watch('coverImage');

  const handleSelectFile = (files: File[]): void => {
    if (files && files.length > 0) {
      const fileToUpload = files[0];
      const { isValid } = validateFile(fileToUpload, FILE_CONFIG);

      if (isValid) {
        setInvalidFile(null);
        setValue('coverImage', fileToUpload);
      } else {
        setInvalidFile(fileToUpload);
        setValue('coverImage', null);
      }
    }
  };

  const handleRemoveFile = (): void => {
    setInvalidFile(null);
    setValue('coverImage', null);
  };

  return (
    <>
      <Grid size={{ xs: 12, md: coverImage ? 6 : 12 }}>
        <DataDisplayRow label="Cover Image">
          <FileUploadZone
            onFilesSelected={handleSelectFile}
            multiple={false}
            criteria={
              <FileCriteria
                file={coverImage || invalidFile}
                config={FILE_CONFIG}
              />
            }
          />
        </DataDisplayRow>
      </Grid>
      {coverImage && (
        <Grid size={{ xs: 12, md: 6 }}>
          <CoverImagePreview
            selectedFile={coverImage}
            removeFile={handleRemoveFile}
          />
        </Grid>
      )}
    </>
  );
};

export const Identity = (): ReactElement => {
  const offices: { label: string; value: string }[] = [];

  return (
    <Card variant="outlined">
      <Box
        sx={{
          p: 2,
          bgcolor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Department Identity
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Basic details, branding, and location tracking.
        </Typography>
      </Box>
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <DataDisplayRow label="Department Name *">
              <ControlledTextField name="name" fullWidth size="small" />
            </DataDisplayRow>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <DataDisplayRow
              label="Slug *"
              config={{
                labelBox: {
                  width: 80,
                },
              }}
            >
              <ControlledTextField name="slug" fullWidth size="small" />
            </DataDisplayRow>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <DataDisplayRow label="Cost Center Code *">
              <ControlledTextField
                name="costCenterCode"
                fullWidth
                size="small"
              />
            </DataDisplayRow>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <DataDisplayRow
              label="Office *"
              config={{
                labelBox: {
                  width: 90,
                },
              }}
            >
              <ControlledAutocomplete
                name="office"
                getOptionLabel={(option) => {
                  if (typeof option === 'string') return option;
                  if (option && typeof option === 'object') {
                    return option.label ?? '';
                  }
                  return ''; // Safe fallback string
                }}
                options={offices}
              />
            </DataDisplayRow>
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <DataDisplayRow label="Description *">
              <ControlledTextField
                name="description"
                fullWidth
                multiline
                rows={3}
              />
            </DataDisplayRow>
          </Grid>

          <CoverImage />
        </Grid>
      </CardContent>
    </Card>
  );
};
