import { useState, type ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import FileUploadZone from '~/components/form/inputs/base/file-upload-zone';
import FileCriteria from '~/components/ui/file-criteria';
import { ControlledAutocomplete } from '~/components/form/inputs/controlled/autocomplete';
import { CoverImagePreview } from './cover-image-preview';
import { SectionLabel } from '../../../components/section-label';
import { validateFile } from '~/utils';
import type { DepartmentFormValues } from '~/models/department.model';
import { useGetAll as useOfficeGetAll } from '~/queries/office.query';

const MAX_FILE_SIZE_MB = 5;
const FILE_CONFIG = {
  maxFileSize: { bytes: MAX_FILE_SIZE_MB * 1024 * 1024, formattedLabel: '5MB' },
  acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
};

const CoverImage = (): ReactElement => {
  const { watch, setValue } = useFormContext<DepartmentFormValues>();
  const [invalidFile, setInvalidFile] = useState<File | null>(null);

  const coverImage = watch('coverImage');

  const handleSelectFile = (files: File[]): void => {
    if (files.length > 0) {
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

  return coverImage ? (
    <CoverImagePreview
      selectedFile={coverImage}
      removeFile={handleRemoveFile}
    />
  ) : (
    <FileUploadZone
      onFilesSelected={handleSelectFile}
      multiple={false}
      criteria={<FileCriteria file={invalidFile} config={FILE_CONFIG} />}
    />
  );
};

export const Identity = (): ReactElement => {
  const { data: offices = [] } = useOfficeGetAll();

  return (
    <Card variant="outlined">
      <Stack
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'fontWeightMedium' }}>
          Department Identity
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Basic details, branding, and location tracking.
        </Typography>
      </Stack>
      <CardContent>
        <Stack sx={{ gap: 3 }}>
          <Box>
            <SectionLabel title="Details" />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <ControlledTextField label="Department Name *" name="name" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <ControlledTextField label="Slug *" name="slug" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <ControlledTextField
                  label="Cost Center Code *"
                  name="costCenterCode"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <ControlledAutocomplete
                  label="Office *"
                  name="office"
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    if (option && typeof option === 'object') {
                      return option.name ?? '';
                    }
                    return '';
                  }}
                  options={offices}
                />
              </Grid>
              <Grid size={12}>
                <ControlledTextField
                  label="Description"
                  name="description"
                  multiline
                  minRows={3}
                />
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <Box>
            <SectionLabel
              title="Cover Image"
              caption="Shown as the banner on the department page. JPEG, PNG or WebP, up to 5MB."
            />
            <CoverImage />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
