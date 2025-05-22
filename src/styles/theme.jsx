import { createTheme } from '@mui/material/styles';

// Base theme configuration
const baseTheme = {
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    // Add other typography variants as needed
  },
  spacing: 8, // Default spacing unit (1 = 8px)
};

// Light theme
export const lightTheme = createTheme({
  // ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // MUI default blue
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e', // MUI default pink
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
    success: {
      main: '#2e7d32',
    },
  },
});

// Dark theme (optional)
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
});

// Default export (use light theme as default)
const theme = lightTheme;
export default theme;