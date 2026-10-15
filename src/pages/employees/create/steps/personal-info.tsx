import type { AvatarStyle } from '~/models/employee.model';
import type { EmployeeCreateFormValues } from '../types';

import { useState, type ReactElement } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useDebouncedValue } from '~/hooks/use-debounced-value';

import { Divider, Grid, Stack, Typography } from '@mui/material';

import FileUploadZone from '~/components/form/inputs/base/file-upload-zone';
import { Card } from '~/components/ui/card';
import ImageCropperDialog from '~/components/ui/image-cropper-dialog';
import { SectionLabel } from '~/components/section-label';
import { SectionHeader } from '~/components/section-header';

import { validateFile } from '~/utils';

import { EmployeeDemographicFields } from '../components/form/employee/demographic-fields';
import { EmployeeIdentityFields } from '../components/form/employee/identity-fields';

import { DynamicAvatar } from '../components/display/dynamic-avatar';
import { UploadedImagePreview } from '../components/display/uploaded-image-preview';

const FILE_CONFIG = {
  maxFileSize: { bytes: 5 * 1024 * 1024, formattedLabel: '5MB' },
  acceptedFormats: ['image/jpeg', 'image/png'],
};

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
              <EmployeeIdentityFields />
            </Stack>
            <Stack sx={{ gap: 2 }}>
              <SectionLabel title="Demographics" />
              <EmployeeDemographicFields />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};
