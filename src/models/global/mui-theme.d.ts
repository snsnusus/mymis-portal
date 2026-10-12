import type { CSSProperties } from 'react';
import type { Theme as MuiTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeText {
    muted?: string;
  }

  interface Theme extends MuiTheme {
    custom: {
      drawer: {
        sidebar: {
          width: {
            open: number;
            close: number;
          };
        };
      };
    };
  }

  interface ThemeOptions {
    custom?: {
      drawer?: {
        sidebar?: {
          width?: {
            open?: number;
            close?: number;
          };
        };
      };
    };
  }

  // What theme.typography contains, so theme.typography.heading is typed.
  interface TypographyVariants {
    header: CSSProperties;
    subheader: CSSProperties;
  }

  // What createTheme accepts (optional, like every other typography option).
  interface TypographyVariantsOptions {
    header?: CSSProperties;
    subheader?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  // Allows <Typography variant="heading" /> and variant="subheading".
  interface TypographyPropsVariantOverrides {
    header: true;
    subheader: true;
  }
}
