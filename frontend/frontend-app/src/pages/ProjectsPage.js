// frontend/frontend-app/src/pages/ProjectsPage.js - ИСПРАВЛЕННЫЕ ИМПОРТЫ
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';

// Redux
import {
  fetchProjects,
  fetchProjectCategories,
  setFilters,
  selectProjects,
  selectProjectCategories,
  selectProjectsLoading,
  selectProjectsError,
  selectProjectsFilters
} from '../store/slices/projectsSlice';

// Components - ПРАВИЛЬНЫЕ ИМПОРТЫ
import { FadeInUp } from '../components/animations';
import ProjectFilters from '../components/project/ProjectFilters';
import ProjectGrid from '../components/project/ProjectGrid';

const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const theme = useTheme();

  const projects = useSelector(selectProjects);
  const categories = useSelector(selectProjectCategories);
  const loading = useSelector(selectProjectsLoading);
  const error = useSelector(selectProjectsError);
  const filters = useSelector(selectProjectsFilters);

  // Initialize filters from URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'all';
    dispatch(setFilters({ category: categoryFromUrl }));
  }, [searchParams, dispatch]);

  // Load data when component mounts
  useEffect(() => {
    dispatch(fetchProjectCategories());
  }, [dispatch]);

  // Load projects when filters change
  useEffect(() => {
    const params = filters.category === 'all'
      ? { limit: 50 }
      : { category: filters.category, limit: 50 };

    dispatch(fetchProjects(params));
  }, [filters, dispatch]);

  const handleCategoryChange = (event, newCategory) => {
    dispatch(setFilters({ category: newCategory }));

    if (newCategory === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: newCategory });
    }
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
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Header */}
      <Box sx={{ backgroundColor: theme.palette.background.paper, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <FadeInUp>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                textAlign: 'center',
                color: theme.palette.text.primary,
              }}
            >
              Our Projects
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                textAlign: 'center',
                maxWidth: 600,
                mx: 'auto',
                mb: 4
              }}
            >
              Explore our portfolio of successful projects across different industries and technologies
            </Typography>
          </FadeInUp>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Category Filters */}
        <FadeInUp delay={0.2}>
          <ProjectFilters
            selectedCategory={filters.category}
            categories={categories}
            onCategoryChange={handleCategoryChange}
          />
        </FadeInUp>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <ProjectGrid projects={projects} />
        ) : (
          <FadeInUp>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                No projects found
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
                {filters.category === 'all'
                  ? 'We haven\'t published any projects yet.'
                  : `No projects found in this category.`}
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/"
                sx={{ px: 4 }}
              >
                Back to Home
              </Button>
            </Box>
          </FadeInUp>
        )}

        {/* CTA Section */}
        {projects.length > 0 && (
          <FadeInUp delay={0.4}>
            <Box
              sx={{
                mt: 8,
                p: 6,
                textAlign: 'center',
                backgroundColor: theme.palette.background.paper,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                Like What You See?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 4,
                  maxWidth: 500,
                  mx: 'auto'
                }}
              >
                Let's discuss your project and bring your ideas to life with the same quality and attention to detail.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  href="mailto:hello@sligart.studio"
                  sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                >
                  Start Your Project
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="mailto:hello@sligart.studio"
                  sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                >
                  Get in Touch
                </Button>
              </Box>
            </Box>
          </FadeInUp>
        )}
      </Container>
    </Box>
  );
};

export default ProjectsPage;