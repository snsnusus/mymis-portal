import { useState, type ReactElement } from 'react';

import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import { ControlledTextField } from '~/components/form/controlled/textfield';
import ControlledDatePicker from '~/components/form/controlled/controlled-datepicker';
import DataDisplayRow from '~/components/ui/data-display-row';
import FileUploadZone from '~/components/form/base/file-upload-zone';
import ImageCropperDialog from '~/components/ui/image-cropper-dialog';
import FileCriteria from '~/components/ui/file-criteria';

import DynamicAvatar from './dynamic-avatar';
import ImagePreview from './image-preview';

import { validateFile } from '~/utils';
import { ControlledAutocomplete } from '~/components/form/controlled/autocomplete';
import { useFormContext } from 'react-hook-form';

const FILE_CONFIG = {
  maxFileSize: { bytes: 5 * 1024 * 1024, formattedLabel: '5MB' },
  acceptedFormats: ['image/jpeg', 'image/png', 'image/tiff'],
};

export const PersonalInfo = (): ReactElement => {
  const { watch, setValue } = useFormContext();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isOpenCropperDialog, setIsOpenCropperDialog] = useState(false);

  const avatar = watch('avatar');

  const handleFileUpload = (files: File[]): void => {
    if (files && files.length > 0) {
      const fileToUpload = files[0];
      setUploadedFile(fileToUpload);

      const { isValid } = validateFile(fileToUpload, FILE_CONFIG);

      if (isValid) {
        setIsOpenCropperDialog(true);
      }
    }
  };

  const handleCropComplete = (croppedImage: File): void => {
    setValue('avatar', croppedImage);
  };

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
          Personal Information
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Capture identity, demographics, and a profile photo for this record.
        </Typography>
      </Box>
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2}>
              {avatar ? (
                <ImagePreview croppedImage={avatar} />
              ) : (
                <DynamicAvatar />
              )}
              <Divider>OR</Divider>
              <FileUploadZone
                onFilesSelected={handleFileUpload}
                multiple={false}
                criteria={
                  <FileCriteria file={uploadedFile} config={FILE_CONFIG} />
                }
              />
              <ImageCropperDialog
                open={isOpenCropperDialog}
                file={uploadedFile}
                onClose={() => setIsOpenCropperDialog(false)}
                onCropcomplete={handleCropComplete}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={2} columnSpacing={3}>
              <Grid size={12}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  IDENTITY
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <DataDisplayRow
                  label="First Name *"
                  config={{
                    row: {
                      flexDirection: 'column',
                      gap: 1,
                    },
                  }}
                >
                  <ControlledTextField
                    size="small"
                    name="firstName"
                    fullWidth
                  />
                </DataDisplayRow>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <DataDisplayRow
                  label="Middle Name *"
                  config={{
                    row: {
                      flexDirection: 'column',
                      gap: 1,
                    },
                  }}
                >
                  <ControlledTextField
                    size="small"
                    name="middleName"
                    fullWidth
                  />
                </DataDisplayRow>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <DataDisplayRow
                  label="Last Name *"
                  config={{
                    row: {
                      flexDirection: 'column',
                      gap: 1,
                    },
                  }}
                >
                  <ControlledTextField size="small" name="lastName" fullWidth />
                </DataDisplayRow>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <DataDisplayRow
                  label="Suffix"
                  config={{
                    row: {
                      flexDirection: 'column',
                      gap: 1,
                    },
                  }}
                >
                  <ControlledTextField size="small" name="suffix" fullWidth />
                </DataDisplayRow>
              </Grid>
              <Grid size={12}>
                <Divider sx={{ mt: 1 }} />
              </Grid>
              <Grid size={12}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  DEMOGRAPHICS
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <DataDisplayRow
                  label="Gender *"
                  config={{
                    row: {
                      flexDirection: 'column',
                      gap: 1,
                    },
                  }}
                >
                  <ControlledTextField size="small" name="gender" select>
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                  </ControlledTextField>
                </DataDisplayRow>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <DataDisplayRow
                  label="Marital Status"
                  config={{
                    row: {
                      flexDirection: 'column',
                      gap: 1,
                    },
                  }}
                >
                  <ControlledTextField name="maritalStatus" select fullWidth>
                    <MenuItem value="SINGLE">Single</MenuItem>
                    <MenuItem value="MARRIED">Married</MenuItem>
                  </ControlledTextField>
                </DataDisplayRow>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <DataDisplayRow
                  label="Birthdate *"
                  config={{
                    row: {
                      flexDirection: 'column',
                      gap: 1,
                    },
                  }}
                >
                  <ControlledDatePicker name="birthdate" />
                </DataDisplayRow>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <DataDisplayRow
                  label="Place of Birth"
                  config={{
                    row: {
                      flexDirection: 'column',
                      gap: 1,
                    },
                  }}
                >
                  <ControlledTextField
                    size="small"
                    name="birthplace"
                    fullWidth
                  />
                </DataDisplayRow>
              </Grid>
              <Grid size={6}>
                <DataDisplayRow
                  label="Nationality"
                  config={{
                    row: {
                      flexDirection: 'column',
                      gap: 1,
                    },
                  }}
                >
                  <ControlledAutocomplete name="nationality" options={[]} />
                </DataDisplayRow>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
