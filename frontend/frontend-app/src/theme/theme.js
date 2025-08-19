import { createTheme } from '@mui/material/styles';

// Цветовая палитра из скриншота
const palette = {
  wenge: '#654C52',        // Темно-коричневый
  rosyBrown: '#B99099',    // Розово-коричневый
  platinum: '#E8DDDD',     // Светло-серый
  liver: '#70444C',        // Темно-красный коричневый
  puceRed: '#762E3F',      // Темно-пурпурный красный
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.liver,      // Основной цвет - темно-красный коричневый
      light: palette.rosyBrown, // Светлый оттенок
      dark: palette.wenge,      // Темный оттенок
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: palette.puceRed,    // Вторичный цвет - темно-пурпурный
      light: palette.rosyBrown,
      dark: palette.wenge,
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAFAFA',       // Очень светлый фон
      paper: palette.platinum,  // Фон карточек
    },
    text: {
      primary: palette.wenge,   // Основной текст
      secondary: palette.liver, // Вторичный текст
    },
    divider: palette.rosyBrown,
    action: {
      hover: palette.platinum,
      selected: palette.rosyBrown + '40', // С прозрачностью
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: palette.wenge,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: palette.wenge,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: palette.liver,
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
      color: palette.liver,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: palette.wenge,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: palette.liver,
    }
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(112, 68, 76, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(101, 76, 82, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(101, 76, 82, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: palette.platinum,
          color: palette.wenge,
          boxShadow: '0 1px 4px rgba(101, 76, 82, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: palette.wenge,
          color: '#FFFFFF',
        },
      },
    },
  },
});

export default theme;