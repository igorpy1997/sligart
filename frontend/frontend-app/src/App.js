// frontend/frontend-app/src/App.js - UPDATED WITH REDUX
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';

// Redux store
import { store, persistor } from './store';

// Theme and components
import theme from './theme/theme';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingContactButton from './components/contact/FloatingContactButton';

// Pages
import HomePage from './pages/HomePage';
import ApiTestPage from './pages/ApiTestPage';
import DeveloperPage from './pages/DeveloperPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

// Loading component for PersistGate
const LoadingComponent = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
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
                  <Route path="/developer/:developerSlug" element={<DeveloperPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/project/:projectId" element={<ProjectDetailPage />} />
                </Routes>
              </Box>

              <Footer />

              <FloatingContactButton />
            </Box>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;