// Global CSS, in the same order as src/main.tsx:
// 1. the date picker's own stylesheet
// 2. your index.css (the Google Sans @font-face rules live here)
import 'react-datepicker/dist/react-datepicker.css';
import '../src/index.css';

import type { Preview } from '@storybook/react-vite';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { theme } from '../src/theme';

const preview: Preview = {
  // Decorators wrap EVERY story. Storybook renders <Story /> inside
  // whatever this function returns.
  tags: ['autodocs'],

  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],

  parameters: {
    controls: {
      // Auto-pick a color picker / date picker control for props
      // whose names match these patterns.
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
