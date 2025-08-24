// frontend/frontend-app/src/pages/DeveloperPage.js - REFACTORED WITH REDUX
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, CircularProgress, Alert, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Redux
import {
  fetchDeveloperBySlug,
  fetchDeveloperProjects,
  clearCurrentDeveloper,
  selectCurrentDeveloper,
  selectCurrentDeveloperProjects,
  selectDevelopersLoading,
  selectDevelopersError
} from '../store/slices/developersSlice';

import { openForm } from '../store/slices/contactSlice';

// Components
import DeveloperHeader from '../components/developer/DeveloperHeader';
import DeveloperProfile from '../components/developer/DeveloperProfile';
import DeveloperTabs from '../components/developer/DeveloperTabs';
import ContactForm from '../components/contact/ContactForm';

const DeveloperPage = () => {
  const { developerSlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const developer = useSelector(selectCurrentDeveloper);
  const projects = useSelector(selectCurrentDeveloperProjects);
  const loading = useSelector(selectDevelopersLoading);
  const error = useSelector(selectDevelopersError);

  useEffect(() => {
    if (developerSlug) {
      loadDeveloperData();
    }

    return () => {
      dispatch(clearCurrentDeveloper());
    };
  }, [developerSlug, dispatch]);

  const loadDeveloperData = async () => {
    try {
      const result = await dispatch(fetchDeveloperBySlug(developerSlug)).unwrap();

      // Load projects for this developer
      if (result.id) {
        dispatch(fetchDeveloperProjects(result.id));
      }
    } catch (err) {
      console.error('Error loading developer:', err);
    }
  };

  const handleStartProject = () => {
    dispatch(openForm({
      project_type: 'web',
      description: `I'd like to discuss a project with ${developer?.name} (${developer?.specialization}). `,
      source: `developer_page_${developer?.id}`
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate('/')} startIcon={<ArrowBackIcon />}>
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!developer) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Developer not found</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <DeveloperHeader onBack={() => navigate('/')} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <DeveloperProfile
          developer={developer}
          onStartProject={handleStartProject}
        />

        <DeveloperTabs
          developer={developer}
          projects={projects}
        />
      </Container>

      <ContactForm />
    </Box>
  );
};

export default DeveloperPage;