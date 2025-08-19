import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';

// Импорт темы и компонентов
import theme from './theme/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ApiTestPage from './pages/ApiTestPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
          }}
        >
          <Header />

          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/apitest" element={<ApiTestPage />} />
            </Routes>
          </Box>

          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;