import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#e7700d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0d5ce7',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#1e1e1e',
      secondary: '#666666',
      muted: '#979797de',
    },
    error: {
      main: '#d32f2f',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      contrastText: '#ffffff',
    },
    info: {
      main: '#2196f3',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      contrastText: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: 150,
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          header: 'h2',
          subheader: 'h3',
        },
      },
    },
    // MuiAutocomplete: {
    //   styleOverrides: {
    //     option: {
    //       paddingTop: '6px !important',
    //       paddingBottom: '6px !important',
    //     },
    //   },
    // },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme: muiTheme }) => ({
          '&.Mui-disabled.Mui-error': {
            color: muiTheme.palette.error.main,
          },
        }),
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: ({ theme: muiTheme }) => ({
          '&.Mui-disabled.Mui-error': {
            color: muiTheme.palette.error.main,
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme: muiTheme }) => ({
          '&.Mui-disabled.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: muiTheme.palette.error.main,
          },
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { fontSize: '0.875rem' },
      },
    },
  },
  custom: {
    drawer: {
      sidebar: {
        width: {
          open: 300,
          close: 120,
        },
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 56,
    },
  },
  typography: {
    h1: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.25 },
    h2: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.33 },
    h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },

    // Custom variants (typed in src/models/global/mui-theme.d.ts).
    header: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    subheader: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: '#666666',
      lineHeight: 1.5,
    },

    subtitle1: {
      fontSize: '0.9375rem',
      fontWeight: 400,
      color: '#666666',
      lineHeight: 1.5,
    },
    subtitle2: { fontSize: '0.8125rem', fontWeight: 400, lineHeight: 1.5 },

    // The base: <Typography> with no variant, inputs, menus and the page body all use body1.
    body1: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: '0.8125rem', fontWeight: 400, lineHeight: 1.5 },

    button: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.75 },
    caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.4 },
    overline: { fontSize: '0.6875rem', fontWeight: 500, lineHeight: 1.5 },
    fontFamily: ['Google Sans', 'sans-serif'].join(','),
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 900,
  },
});
