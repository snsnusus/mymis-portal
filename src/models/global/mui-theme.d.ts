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
}
