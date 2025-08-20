// frontend/frontend-app/src/pages/ProjectDetailPage.js - ПОЛНАЯ ВЕРСИЯ С ФОРМОЙ
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  useTheme,
  Paper,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LaunchIcon from '@mui/icons-material/Launch';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { motion } from 'framer-motion';

import { FadeInUp, FadeInLeft, FadeInRight } from '../components/animations';
import ProjectGallery from '../components/ProjectGallery';
// ИМПОРТЫ ДЛЯ ФОРМЫ
import ContactForm from '../components/ContactForm';
import { useContactForm } from '../hooks/useContactForm';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ХУК ДЛЯ ФОРМЫ
  const { isOpen, openForm, closeForm } = useContactForm();

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setLoading(true);

        // Load project details
        const projectResponse = await fetch(`/api/public/projects/${projectId}`);
        if (!projectResponse.ok) {
          throw new Error('Project not found');
        }
        const projectData = await projectResponse.json();
        console.log('Project Data:', projectData);
        setProject(projectData);

        // Load related projects (same category)
        if (projectData.category) {
          const relatedResponse = await fetch(`/api/public/projects?category=${projectData.category}&limit=6`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            console.log('Related Projects:', relatedData);
            const filtered = relatedData.filter(p => p.id !== parseInt(projectId));
            setRelatedProjects(filtered.slice(0, 3));
          }
        }

      } catch (err) {
        console.error('Error loading project:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  // ФУНКЦИИ ДЛЯ ОТКРЫТИЯ ФОРМЫ
  const handleDiscussSimilarProject = () => {
    openForm({
      project_type: project?.project_type || 'web',
      description: `I'm interested in a project similar to "${project?.title}". `,
      source: `project_detail_${project?.id}`
    });
  };

  const handleGetQuote = () => {
    openForm({
      project_type: project?.project_type || 'web',
      description: `I need a quote for a project similar to "${project?.title}". Please provide details about timeline and pricing. `,
      source: `project_sidebar_${project?.id}`
    });
  };

  const handleStartSimilarProject = () => {
    openForm({
      project_type: project?.project_type || 'web',
      description: `I want to start a project similar to "${project?.title}". `,
      source: `project_cta_${project?.id}`
    });
  };

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'ecommerce': 'E-commerce',
      'corporate': 'Corporate Website',
      'saas': 'SaaS Platform',
      'portfolio': 'Portfolio',
      'blog': 'Blog/CMS',
      'social': 'Social Network',
      'education': 'Education Platform',
      'healthcare': 'Healthcare',
      'fintech': 'Fintech',
      'gaming': 'Gaming',
      'dashboard': 'Dashboard/Analytics',
      'marketplace': 'Marketplace',
      'booking': 'Booking System'
    };
    return categoryMap[category] || (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'General');
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate('/projects')} startIcon={<ArrowBackIcon />}>
          Back to Projects
        </Button>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Project not found</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Header */}
      <Box sx={{ backgroundColor: theme.palette.background.paper, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Button
            onClick={() => navigate('/projects')}
            startIcon={<ArrowBackIcon />}
            sx={{ color: theme.palette.text.secondary }}
          >
            Back to Projects
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Project Header */}
        <FadeInUp>
          <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                  {project.category && (
                    <Chip
                      label={getCategoryDisplayName(project.category)}
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
                      sx={{
                        backgroundColor: getProjectTypeColor(project.project_type) + '15',
                        color: getProjectTypeColor(project.project_type),
                        fontWeight: 500
                      }}
                    />
                  )}
                  {project.duration_months && (
                    <Chip
                      label={`${project.duration_months} ${project.duration_months === 1 ? 'month' : 'months'}`}
                      variant="outlined"
                    />
                  )}
                </Box>

                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                  {project.title}
                </Typography>

                {project.short_description && (
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 400,
                      mb: 3,
                      lineHeight: 1.6
                    }}
                  >
                    {project.short_description}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {project.demo_url && (
                    <Button
                      variant="contained"
                      size="large"
                      component="a"
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<LaunchIcon />}
                      sx={{ px: 4 }}
                    >
                      View Demo
                    </Button>
                  )}
                  {project.github_url && (
                    <Button
                      variant="outlined"
                      size="large"
                      component="a"
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<GitHubIcon />}
                      sx={{ px: 4 }}
                    >
                      View Code
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<EmailIcon />}
                    onClick={handleDiscussSimilarProject}
                    sx={{ px: 4 }}
                  >
                    Discuss Similar Project
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                {project.developers && project.developers.length > 0 && (
                  <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Project Team
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {project.developers.map((dev) => {
                        const slug = dev.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                        return (
                          <Box key={dev.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={dev.avatar_url}
                              alt={dev.name}
                              sx={{ width: 48, height: 48 }}
                              component={Link}
                              to={`/developer/${slug}`}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 500 }}
                                component={Link}
                                to={`/developer/${slug}`}
                                color="inherit"
                                underline="hover"
                              >
                                {dev.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {dev.specialization}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Card>
                )}
              </Grid>
            </Grid>
          </Paper>
        </FadeInUp>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Project Gallery */}
            {project.image_urls && project.image_urls.length > 0 ? (
              <FadeInLeft>
                <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                  <ProjectGallery
                    images={project.image_urls}
                    projectTitle={project.title}
                  />
                </Paper>
              </FadeInLeft>
            ) : (
              <FadeInLeft>
                <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No images available for this project.
                  </Typography>
                </Paper>
              </FadeInLeft>
            )}

            {/* Project Description */}
            {project.description && (
              <FadeInLeft delay={0.2}>
                <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    About This Project
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      color: theme.palette.text.primary,
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {project.description}
                  </Typography>
                </Paper>
              </FadeInLeft>
            )}

            {/* Technical Details */}
            <FadeInLeft delay={0.3}>
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  Technical Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                      Project Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                      {project.project_type?.toUpperCase() || 'Web Application'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                      Duration
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                      {project.duration_months ? `${project.duration_months} ${project.duration_months === 1 ? 'month' : 'months'}` : 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                      Category
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                      {project.category ? getCategoryDisplayName(project.category) : 'General'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                      Team Size
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                      {project.developers?.length || 1} {project.developers?.length === 1 ? 'developer' : 'developers'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </FadeInLeft>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <FadeInRight>
                <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Related Projects
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {relatedProjects.map((relatedProject) => (
                      <Card
                        key={relatedProject.id}
                        variant="outlined"
                        sx={{
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 12px ${theme.palette.primary.main}20`
                          }
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          {relatedProject.image_urls && relatedProject.image_urls[0] && (
                            <Box
                              component="img"
                              src={relatedProject.image_urls[0]}
                              alt={relatedProject.title}
                              sx={{
                                width: '100%',
                                height: 120,
                                objectFit: 'cover',
                                borderRadius: 1,
                                mb: 2
                              }}
                            />
                          )}
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, mb: 1 }}
                            component={Link}
                            to={`/project/${relatedProject.id}`}
                            color="inherit"
                            underline="hover"
                          >
                            {relatedProject.title}
                          </Typography>
                          {relatedProject.short_description && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.text.secondary,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {relatedProject.short_description}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                  <Divider sx={{ my: 3 }} />
                  <Button
                    variant="outlined"
                    fullWidth
                    component={Link}
                    to="/projects"
                  >
                    View All Projects
                  </Button>
                </Paper>
              </FadeInRight>
            )}

            {/* CTA Card */}
            <FadeInRight delay={0.2}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                  border: `1px solid ${theme.palette.primary.main}30`
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                  Need Similar Project?
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 3,
                    textAlign: 'center',
                    lineHeight: 1.6
                  }}
                >
                  Let's discuss your requirements and create something amazing together.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ContactPhoneIcon />}
                  onClick={handleGetQuote}
                  sx={{
                    mb: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                    }
                  }}
                >
                  Get Quote
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  component={Link}
                  to="/projects"
                >
                  View Portfolio
                </Button>
              </Paper>
            </FadeInRight>
          </Grid>
        </Grid>

        {/* Bottom CTA Section */}
        <FadeInUp delay={0.5}>
          <Paper
            sx={{
              mt: 6,
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.primary.main}08)`,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Ready to Start Your Project?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 4,
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Inspired by this project? Let's build something even better together.
                Get a free consultation and detailed project estimate.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ContactPhoneIcon />}
                    onClick={handleStartSimilarProject}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      }
                    }}
                  >
                    Start Similar Project
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/projects"
                    sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                  >
                    View More Projects
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Paper>
        </FadeInUp>
      </Container>

      {/* ФОРМА ОБРАТНОЙ СВЯЗИ */}
      <ContactForm
        open={isOpen}
        onClose={closeForm}
        initialProjectType={project?.project_type || ''}
      />
    </Box>
  );
};

export default ProjectDetailPage;