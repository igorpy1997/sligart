// frontend/frontend-app/src/pages/ApiTestPage.js - WITH REDUX
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';

// Redux (if you want to use Redux for API test)
import { fetchDevelopers, selectDevelopers, selectDevelopersLoading } from '../store/slices/developersSlice';
import { fetchProjects, selectProjects } from '../store/slices/projectsSlice';

const ApiTestPage = () => {
  const dispatch = useDispatch();
  const developers = useSelector(selectDevelopers);
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectDevelopersLoading);

  useEffect(() => {
    // Test API calls
    dispatch(fetchDevelopers({ limit: 5 }));
    dispatch(fetchProjects({ limit: 5 }));
  }, [dispatch]);

  const testPing = async () => {
    try {
      const response = await fetch('/api/test/ping');
      const data = await response.json();
      console.log('Ping result:', data);
      alert('Ping successful! Check console for details.');
    } catch (error) {
      console.error('Ping failed:', error);
      alert('Ping failed: ' + error.message);
    }
  };

  return (
    <Box sx={{ p: 4, fontFamily: 'Arial' }}>
      <Button
        component={Link}
        to="/"
        variant="outlined"
        sx={{ mb: 3 }}
      >
        ← Back to Home
      </Button>

      <Typography variant="h3" sx={{ mb: 4 }}>
        🧪 API Test Page
      </Typography>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

        {/* Ping Test */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            🏓 Ping Test
          </Typography>
          <Button
            variant="contained"
            onClick={testPing}
            sx={{ mb: 2 }}
          >
            Test Ping
          </Button>
        </Paper>

        {/* Developers Test */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            👥 Developers ({developers.length})
          </Typography>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Box>
              {developers.slice(0, 3).map(dev => (
                <Alert key={dev.id} severity="info" sx={{ mb: 1 }}>
                  <strong>{dev.name}</strong> - {dev.specialization}
                </Alert>
              ))}
            </Box>
          )}
        </Paper>

        {/* Projects Test */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            📁 Projects ({projects.length})
          </Typography>
          <Box>
            {projects.slice(0, 3).map(project => (
              <Alert key={project.id} severity="success" sx={{ mb: 1 }}>
                <strong>{project.title}</strong> - {project.status}
              </Alert>
            ))}
          </Box>
        </Paper>

      </Box>
    </Box>
  );
};

export default ApiTestPage;