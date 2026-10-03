import { type ReactElement, useMemo, useEffect, type ReactNode } from 'react';
import { type FileValidationConfig } from '~/models/file.models';
import { Stack, Box, Typography } from '@mui/material';
import {
  Circle as CircleIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { validateFile } from '~/utils';

interface FileCriteriaProps {
  file: File | null;
  config: FileValidationConfig;
  onValidationChange?: (isValid: boolean) => void;
}

const FileCriteria = ({
  file,
  config,
  onValidationChange,
}: FileCriteriaProps): ReactElement => {
  const { criteriaItems, isValid } = useMemo(() => {
    const items: { label: ReactNode; status: string }[] = [];
    const { isFormatValid, isSizeValid } = validateFile(file, config);

    if (config.acceptedFormats && config.acceptedFormats.length > 0) {
      const rawExtensions = config.acceptedFormats.map((f) =>
        f.replace('image/', '.').replace('.', '').toUpperCase()
      );

      const uniqueExtensions = rawExtensions.map((ext) => {
        if (ext === 'JPEG') return 'JPG';
        if (ext === 'TIFF') return 'TIF';
        return ext;
      });

      const extensions = Array.from(new Set(uniqueExtensions));

      let displayExtensions: React.ReactNode;

      if (extensions.length === 1) {
        displayExtensions = <b>{extensions[0]}</b>;
      } else if (extensions.length === 2) {
        displayExtensions = (
          <>
            <b>{extensions[0]}</b> and <b>{extensions[1]}</b>
          </>
        );
      } else {
        displayExtensions = (
          <>
            {extensions.slice(0, -1).map((ext, idx) => (
              <span key={idx}>
                <b>{ext}</b>,{' '}
              </span>
            ))}
            and <b>{extensions[extensions.length - 1]}</b>
          </>
        );
      }
      items.push({
        label: <>Accepts: {displayExtensions}</>,
        status: !file ? 'neutral' : isFormatValid ? 'success' : 'error',
      });
    }

    if (config.maxFileSize) {
      const displaySize =
        config.maxFileSize.formattedLabel ||
        `${(config.maxFileSize.bytes / (1024 * 1024)).toFixed(0)}MB`;
      items.push({
        label: (
          <>
            Max file size: <b>{displaySize}</b>
          </>
        ),
        status: !file ? 'neutral' : isSizeValid ? 'success' : 'error',
      });
    }

    return {
      criteriaItems: items,
      isValid: !file || (isFormatValid && isSizeValid),
    };
  }, [file, config]);

  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  if (criteriaItems.length === 0) return <></>;

  return (
    <Stack spacing={1} sx={{ mt: 1.5, width: '100%' }}>
      {criteriaItems.map((item, idx) => {
        let IconComponent = CircleIcon;
        let iconColor = 'text.disabled';
        let textColor = 'text.secondary';
        let iconSize = '10px';

        if (item.status === 'success') {
          IconComponent = CheckIcon;
          iconColor = 'success.main';
          textColor = 'success.main';
          iconSize = '20px';
        } else if (item.status === 'error') {
          IconComponent = CancelIcon;
          iconColor = 'error.main';
          textColor = 'error.main';
          iconSize = '20px';
        }

        return (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: item.status !== 'neutral' ? 1 : 0,
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justify: 'center',
                width: 20,
                height: 20,
                color: iconColor,
              }}
            >
              <IconComponent
                sx={{ fontSize: iconSize, transition: 'all 0.2s ease-in-out' }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{ color: textColor, transition: 'color 0.2s ease-in-out' }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
};

export default FileCriteria;
