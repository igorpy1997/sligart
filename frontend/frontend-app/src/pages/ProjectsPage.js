// frontend/frontend-app/src/pages/ProjectsPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Tabs,
  Tab,
  Avatar,
  AvatarGroup,
  CircularProgress,
  Alert,
  useTheme,
  Paper,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';

import { FadeInUp, StaggerContainer } from '../components/animations';

const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  // Load categories and projects
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load categories
        const categoriesResponse = await fetch('/api/public/projects/categories/list');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData.categories || []);
        }

        // Load projects
        const projectsUrl = selectedCategory === 'all'
          ? '/api/public/projects?limit=50'
          : `/api/public/projects?category=${selectedCategory}&limit=50`;

        const projectsResponse = await fetch(projectsUrl);
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData);
        } else {
          setError('Failed to load projects');
        }
      } catch (err) {
        setError('Error loading data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory]);

  const handleCategoryChange = (event, newCategory) => {
    setSelectedCategory(newCategory);
    if (newCategory === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: newCategory });
    }
  };

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'ecommerce': 'E-commerce',
      'corporate': 'Corporate',
      'saas': 'SaaS Platform',
      'portfolio': 'Portfolio',
      'blog': 'Blog/CMS',
      'social': 'Social Network',
      'education': 'Education',
      'healthcare': 'Healthcare',
      'fintech': 'Fintech',
      'gaming': 'Gaming',
      'dashboard': 'Dashboard',
      'marketplace': 'Marketplace',
      'booking': 'Booking System'
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getProjectTypeColor = (type) => {
    const colors = {
      'web': theme.palette.primary.main,
      'mobile': theme.palette.secondary.main,
      'desktop': theme.palette.info.main,
      'api': theme.palette.success.main,
      'other': theme.palette.warning.main
    };
    return colors[type] || theme.palette.grey[500];
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
        {/* Category Tabs */}
        <FadeInUp delay={0.2}>
          <Paper sx={{ mb: 4, borderRadius: 3 }}>
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: 2,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                }
              }}
            >
              <Tab label="All Projects" value="all" />
              {categories.map((category) => (
                <Tab
                  key={category.id}
                  label={`${getCategoryDisplayName(category.id)} (${category.count})`}
                  value={category.id}
                />
              ))}
            </Tabs>
          </Paper>
        </FadeInUp>

        {/* Projects Grid - БЕЗ ФОТОГРАФИЙ */}
        {projects.length > 0 ? (
          <StaggerContainer staggerDelay={0.1}>
            <Grid container spacing={3}>
              {projects.map((project, index) => (
                <Grid item xs={12} md={6} lg={4} key={project.id}>
                  <motion.div
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.2, ease: 'easeOut' }
                    }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 12px 24px ${theme.palette.primary.main}20`,
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        {/* Category and Type */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          {project.category && (
                            <Chip
                              label={getCategoryDisplayName(project.category)}
                              size="small"
                              sx={{
                                backgroundColor: theme.palette.primary.main + '15',
                                color: theme.palette.primary.main,
                                fontWeight: 500
                              }}
                            />
                          )}
                          {project.project_type && (
                            <Chip
                              label={project.project_type.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: getProjectTypeColor(project.project_type) + '15',
                                color: getProjectTypeColor(project.project_type),
                                fontWeight: 500
                              }}
                            />
                          )}
                        </Box>

                        {/* Title */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            color: theme.palette.text.primary
                          }}
                        >
                          {project.title}
                        </Typography>

                        {/* Description */}
                        {project.short_description && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.secondary,
                              mb: 2,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: 1.5
                            }}
                          >
                            {project.short_description}
                          </Typography>
                        )}

                        {/* Duration */}
                        {project.duration_months && (
                          <Typography
                            variant="body2"
                            sx={{ color: theme.palette.text.secondary, mb: 2 }}
                          >
                            Duration: {project.duration_months} {project.duration_months === 1 ? 'month' : 'months'}
                          </Typography>
                        )}

                        {/* Developers */}
                        {project.developers && project.developers.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                              Team:
                            </Typography>
                            <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                              {project.developers.map((dev) => (
                                <Avatar
                                  key={dev.id}
                                  src={dev.avatar_url}
                                  alt={dev.name}
                                  sx={{ width: 32, height: 32 }}
                                  title={`${dev.name} - ${dev.specialization}`}
                                />
                              ))}
                            </AvatarGroup>
                          </Box>
                        )}

                        {/* Action Buttons - БЕЗ DEMO */}
                        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                          {project.github_url && (
                            <Button
                              size="small"
                              variant="outlined"
                              component="a"
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              endIcon={<GitHubIcon />}
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Code
                            </Button>
                          )}
                          <Button
                            size="small"
                            variant="text"
                            component={Link}
                            to={`/project/${project.id}`}
                            endIcon={<ArrowForwardIcon />}
                            sx={{ fontSize: '0.8rem', ml: 'auto' }}
                          >
                            Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </StaggerContainer>
        ) : (
          <FadeInUp>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                No projects found
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
                {selectedCategory === 'all'
                  ? 'We haven\'t published any projects yet.'
                  : `No projects found in the "${getCategoryDisplayName(selectedCategory)}" category.`}
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