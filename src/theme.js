import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // primary-blue
      dark: '#1d4ed8', // primary-blue-hover
      light: '#dbeafe', // primary-blue-light
    },
    secondary: {
      main: '#0891b2', // secondary-teal
      dark: '#0e7490', // secondary-teal-hover
      light: '#cffafe', // secondary-teal-light
    },
    error: {
      main: '#dc2626', // error-red
    },
    success: {
      main: '#059669', // success-green
    },
    warning: {
      main: '#ea580c', // accent-orange
      dark: '#c2410c', // accent-orange-hover
    },
    text: {
      primary: '#1e293b', // text-primary
      secondary: '#64748b', // text-secondary
    },
    grey: {
      50: '#f8fafc', // neutral-slate-lightest
      100: '#f1f5f9', // background-primary
      200: '#e2e8f0', // neutral-slate-lighter
      300: '#cbd5e1',
      400: '#94a3b8', // neutral-slate-light
      500: '#64748b', // text-secondary
      600: '#475569', // neutral-slate
      700: '#334155',
      800: '#1e293b', // text-primary
      900: '#0f172a',
    },
  },
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderColor: '#e2e8f0',
          color: '#475569',
          '&.Mui-selected': {
            backgroundColor: '#2563eb',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1d4ed8',
            },
          },
          '&:hover': {
            backgroundColor: '#dbeafe',
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          '& .MuiToggleButton-root': {
            border: '1px solid #e2e8f0',
          },
        },
      },
    },
  },
});

export default theme;
