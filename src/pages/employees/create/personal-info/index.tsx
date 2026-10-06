import { useState, type ReactElement } from 'react';
import type { FormValues } from '..';
import {
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { ControlledAutocomplete } from '~/components/form/inputs/controlled/autocomplete';
import { ControlledDatePicker } from '~/components/form/inputs/controlled/datepicker';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import FileUploadZone from '~/components/form/inputs/base/file-upload-zone';
import ImageCropperDialog from '~/components/ui/image-cropper-dialog';
import FileCriteria from '~/components/ui/file-criteria';
import DynamicAvatar from './dynamic-avatar';
import ImagePreview from './image-preview';
import { useFormContext } from 'react-hook-form';
import { validateFile } from '~/utils';
import { SectionLabel } from '~/components/section-label';

const FILE_CONFIG = {
  maxFileSize: { bytes: 5 * 1024 * 1024, formattedLabel: '5MB' },
  acceptedFormats: ['image/jpeg', 'image/png'],
};

export const PersonalInfo = (): ReactElement => {
  const { watch, setValue } = useFormContext<FormValues>();
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
      <Stack
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">Personal Information</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Capture identity, demographics, and a profile photo for this record.
        </Typography>
      </Stack>
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2}>
              {avatar ? (
                <ImagePreview croppedImage={avatar} />
              ) : (
                <DynamicAvatar />
              )}
              <Divider>
                <Typography variant="body1">OR</Typography>
              </Divider>
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
            <Stack sx={{ gap: 2 }}>
              <Stack>
                <SectionLabel title="Identity" />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <ControlledTextField
                      label="First Name *"
                      name="firstName"
                      rules={{ required: 'First name is required.' }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <ControlledTextField
                      label="Middle Name *"
                      name="middleName"
                      rules={{ required: 'Middle name is required.' }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <ControlledTextField
                      label="Last Name *"
                      name="lastName"
                      rules={{ required: 'Last name is required.' }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <ControlledTextField label="Suffix" name="suffix" />
                  </Grid>
                </Grid>
              </Stack>
              <Divider />
              <Stack>
                <SectionLabel title="Demographics" />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <ControlledTextField
                      label="Gender *"
                      name="gender"
                      select
                      rules={{ required: 'Gender is required.' }}
                    >
                      <MenuItem value="MALE">Male</MenuItem>
                      <MenuItem value="FEMALE">Female</MenuItem>
                    </ControlledTextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <ControlledTextField
                      label="Marital Status *"
                      name="maritalStatus"
                      select
                      rules={{ required: 'Marital status is required.' }}
                    >
                      <MenuItem value="SINGLE">Single</MenuItem>
                      <MenuItem value="MARRIED">Married</MenuItem>
                    </ControlledTextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <ControlledDatePicker label="Birthdate" name="birthdate" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <ControlledTextField label="Birthplace" name="birthplace" />
                  </Grid>
                  <Grid size={6}>
                    <ControlledAutocomplete
                      label="Nationality"
                      name="nationality"
                      options={[]}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
