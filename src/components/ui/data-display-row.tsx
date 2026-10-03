import {
  type ReactElement,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

import {
  Box,
  Stack,
  Typography,
  type TypographyProps,
  type SxProps,
  type Theme,
} from '@mui/material';

export interface DataDisplayRowProps {
  label: string;
  action?: ReactNode;
  config?: {
    row?: SxProps;
    labelBox?: SxProps;
    label?: TypographyProps;
  };
}

const rowConfig: SxProps<Theme> = {
  flexDirection: 'row',
  spacing: 2,
  alignItems: 'flex-start',
};

const labelBoxConfig: SxProps<Theme> = {
  width: 160,
  flexShrink: 0,
};

const labelProps: SxProps<Theme> = {
  variant: 'body1',
  color: 'text.secondary',
};

export const DataDisplayRow = ({
  label,
  action,
  config,
  children,
}: PropsWithChildren<DataDisplayRowProps>): ReactElement => (
  <Stack
    sx={{
      ...rowConfig,
      ...(config?.row ? (config.row as object) : {}),
    }}
  >
    <Box sx={{ ...labelBoxConfig, ...config?.labelBox }}>
      <Typography {...labelProps} {...config?.label}>
        {label}:
      </Typography>
    </Box>
    <Stack
      spacing={1}
      sx={{
        width: '100%',
      }}
    >
      {children}
      {action && (
        <Stack
          direction="row"
          sx={{
            justifyContent: 'flex-end',
          }}
        >
          {action}
        </Stack>
      )}
    </Stack>
  </Stack>
);
