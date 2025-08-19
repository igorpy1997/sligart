import { createTheme } from '@mui/material/styles';

// Сдержанная цветовая палитра
const palette = {
  wenge: '#654C52',
  rosyBrown: '#B99099',
  platinum: '#E8DDDD',
  liver: '#70444C',
  puceRed: '#762E3F',

  // Добавляем только несколько акцентов без неона
  darkCharcoal: '#2C2C34',
  lightGray: '#F5F2F0',
  softWhite: '#FAFAFA',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.liver,
      light: palette.rosyBrown,
      dark: palette.puceRed,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: palette.puceRed,
      light: palette.rosyBrown,
      dark: palette.wenge,
      contrastText: '#FFFFFF',
    },
    background: {
      default: palette.softWhite,
      paper: '#FFFFFF',
    },
    text: {
      primary: palette.darkCharcoal,
      secondary: palette.liver,
    },
    divider: palette.rosyBrown + '30',
    action: {
      hover: palette.rosyBrown + '15',
      selected: palette.liver + '20',
    },
  },

  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      color: palette.darkCharcoal,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      color: palette.darkCharcoal,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      color: palette.liver,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: palette.liver,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: palette.darkCharcoal,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
      lineHeight: 1.4,
      color: palette.darkCharcoal,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: palette.darkCharcoal,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.9rem',
      lineHeight: 1.5,
      color: palette.liver,
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.95rem',
    }
  },

  shape: {
    borderRadius: 12,
  },

  shadows: [
    'none',
    '0 1px 3px rgba(101, 76, 82, 0.12)',
    '0 2px 6px rgba(101, 76, 82, 0.16)',
    '0 4px 12px rgba(101, 76, 82, 0.18)',
    '0 6px 16px rgba(101, 76, 82, 0.20)',
    '0 8px 20px rgba(101, 76, 82, 0.22)',
    '0 10px 24px rgba(101, 76, 82, 0.24)',
    '0 12px 28px rgba(101, 76, 82, 0.26)',
    '0 16px 32px rgba(101, 76, 82, 0.28)',
    '0 20px 40px rgba(101, 76, 82, 0.30)',
    '0 24px 48px rgba(101, 76, 82, 0.32)',
    '0 28px 56px rgba(101, 76, 82, 0.34)',
    '0 32px 64px rgba(101, 76, 82, 0.36)',
    '0 36px 72px rgba(101, 76, 82, 0.38)',
    '0 40px 80px rgba(101, 76, 82, 0.40)',
    '0 44px 88px rgba(101, 76, 82, 0.42)',
    '0 48px 96px rgba(101, 76, 82, 0.44)',
    '0 52px 104px rgba(101, 76, 82, 0.46)',
    '0 56px 112px rgba(101, 76, 82, 0.48)',
    '0 60px 120px rgba(101, 76, 82, 0.50)',
    '0 64px 128px rgba(101, 76, 82, 0.52)',
    '0 68px 136px rgba(101, 76, 82, 0.54)',
    '0 72px 144px rgba(101, 76, 82, 0.56)',
    '0 76px 152px rgba(101, 76, 82, 0.58)',
    '0 80px 160px rgba(101, 76, 82, 0.60)',
  ],

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.2s ease',
        },
        contained: {
          backgroundColor: palette.liver,
          boxShadow: '0 2px 8px rgba(112, 68, 76, 0.25)',
          '&:hover': {
            backgroundColor: palette.puceRed,
            boxShadow: '0 4px 12px rgba(112, 68, 76, 0.35)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: 1,
          borderColor: palette.liver,
          color: palette.liver,
          '&:hover': {
            borderWidth: 1,
            backgroundColor: palette.liver + '08',
            borderColor: palette.puceRed,
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${palette.rosyBrown}20`,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(112, 68, 76, 0.15)',
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${palette.rosyBrown}20`,
          boxShadow: '0 2px 8px rgba(112, 68, 76, 0.08)',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: palette.darkCharcoal,
          borderRight: `1px solid ${palette.rosyBrown}30`,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: palette.liver + '15',
          border: `1px solid ${palette.liver}30`,
          color: palette.liver,
          fontWeight: 500,
          '&:hover': {
            backgroundColor: palette.liver + '25',
          },
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          border: `2px solid ${palette.liver}30`,
        },
      },
    },
  },
});

export default theme;