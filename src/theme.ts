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
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          paddingTop: '6px !important',
          paddingBottom: '6px !important',
        },
      },
    },
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
  },
  custom: {
    drawer: {
      sidebar: {
        width: {
          open: 300,
          close: 120,
        },
      },
      chatDirectory: {
        width: {
          open: 260,
          close: 75,
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
    fontFamily: ['Google Sans', 'sans-serif'].join(','),
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 900,
  },
});
