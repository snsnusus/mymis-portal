import type { AvatarStyle } from '~/models/employee.model';
import type { EmployeeCreateFormValues } from '../../types';

import { useState, type ReactElement } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useDebouncedValue } from '~/hooks/use-debounced-value';

import { Divider, Grid, Stack, Typography, MenuItem } from '@mui/material';

import { ControlledAutocomplete } from '~/components/form/inputs/controlled/autocomplete';
import { ControlledDateOnlyPicker } from '~/components/form/inputs/controlled/date-only-picker';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import FileUploadZone from '~/components/form/inputs/base/file-upload-zone';
import ImageCropperDialog from '~/components/ui/image-cropper-dialog';
import { SectionLabel } from '~/components/section-label';
import { SectionHeader } from '~/components/section-header';
import { Card } from '~/components/ui/card';

import { DynamicAvatar } from './dynamic-avatar';
import { UploadedImagePreview } from './uploaded-image-preview';

import { validateFile } from '~/utils';
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  NATIONALITY_OPTIONS,
} from '../../const/options';

const FILE_CONFIG = {
  maxFileSize: { bytes: 5 * 1024 * 1024, formattedLabel: '5MB' },
  acceptedFormats: ['image/jpeg', 'image/png'],
};

const IdentityFields = (): ReactElement => (
  <Grid container spacing={2}>
    <Grid size={12}>
      <ControlledTextField
        label="First Name *"
        name="firstName"
        rules={{ required: 'First name is required.' }}
      />
    </Grid>
    <Grid size={12}>
      <ControlledTextField
        label="Middle Name *"
        name="middleName"
        rules={{ required: 'Middle name is required.' }}
      />
    </Grid>
    <Grid size={12}>
      <ControlledTextField
        label="Last Name *"
        name="lastName"
        rules={{ required: 'Last name is required.' }}
      />
    </Grid>
    <Grid size={4}>
      <ControlledTextField label="Suffix" name="suffix" />
    </Grid>
  </Grid>
);

const DemographicFields = (): ReactElement => (
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 6 }}>
      <ControlledTextField
        label="Gender *"
        name="gender"
        select
        rules={{ required: 'Gender is required.' }}
      >
        {GENDER_OPTIONS.map(({ label, value }) => (
          <MenuItem key={label} value={value}>
            {label}
          </MenuItem>
        ))}
      </ControlledTextField>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <ControlledTextField
        label="Marital Status *"
        name="maritalStatus"
        select
        rules={{ required: 'Marital status is required.' }}
      >
        {MARITAL_STATUS_OPTIONS.map(({ label, value }) => (
          <MenuItem key={label} value={value}>
            {label}
          </MenuItem>
        ))}
      </ControlledTextField>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <ControlledDateOnlyPicker label="Birthdate" name="birthdate" />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <ControlledTextField label="Birthplace" name="birthplace" />
    </Grid>
    <Grid size={6}>
      <ControlledAutocomplete
        label="Nationality"
        name="nationality"
        options={NATIONALITY_OPTIONS}
      />
    </Grid>
  </Grid>
);

export const PersonalInfo = (): ReactElement => {
  const { field: avatarStyleField } = useController({ name: 'avatarStyle' });
  const { watch, setValue } = useFormContext<EmployeeCreateFormValues>();
  const [uploadeImage, setUploadedImage] = useState<File | null>(null);
  const [isOpenCropperDialog, setIsOpenCropperDialog] = useState(false);

  const avatar = watch('avatar');
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const gender = watch('gender');

  const debouncedName = useDebouncedValue(
    `${firstName} ${lastName}`.trim(),
    300
  );
  const seed = `default:${debouncedName}`;
  const avatarStyle = avatarStyleField.value as AvatarStyle | null;

  const handleImageUpload = (files: File[]): void => {
    if (files && files.length > 0) {
      const fileToUpload = files[0];
      setUploadedImage(fileToUpload);

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
    <Card
      header={
        <SectionHeader
          header="Personal Information"
          subheader="Capture identity, demographics, and a profile photo for this record."
        />
      }
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            {avatar ? (
              <UploadedImagePreview image={avatar} />
            ) : (
              <DynamicAvatar
                avatarStyle={avatarStyle}
                gender={gender}
                onStyleChange={avatarStyleField.onChange}
                seed={seed}
              />
            )}
            <Divider>
              <Typography variant="body1">OR</Typography>
            </Divider>
            <FileUploadZone
              onFilesSelected={handleImageUpload}
              multiple={false}
            />
            <ImageCropperDialog
              open={isOpenCropperDialog}
              file={uploadeImage}
              onClose={() => setIsOpenCropperDialog(false)}
              onCropcomplete={handleCropComplete}
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack sx={{ gap: 2 }}>
            <Stack sx={{ gap: 2 }}>
              <SectionLabel title="Identity" />
              <IdentityFields />
            </Stack>
            <Stack sx={{ gap: 2 }}>
              <SectionLabel title="Demographics" />
              <DemographicFields />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};
