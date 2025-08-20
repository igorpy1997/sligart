// frontend/frontend-app/src/pages/ProjectDetailPage.js
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
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
  Paper,
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LaunchIcon from '@mui/icons-material/Launch';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion } from 'framer-motion';

import { FadeInUp, FadeInLeft, FadeInRight } from '../components/animations';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

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
        setProject(projectData);

        // Load related projects (same category)
        if (projectData.category) {
          const relatedResponse = await fetch(`/api/public/projects?category=${projectData.category}&limit=6`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            // Filter out current project
            const filtered = relatedData.filter(p => p.id !== parseInt(projectId));
            setRelatedProjects(filtered.slice(0, 3));
          }
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

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

  // Навигация по изображениям в модальном окне
  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (project?.image_urls && selectedImageIndex < project.image_urls.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
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
      {/* Header with back button */}
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
                {/* Tags */}
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

                {/* Title */}
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                  {project.title}
                </Typography>

                {/* Short Description */}
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

                {/* Action Buttons */}
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
                    href="mailto:hello@sligart.studio"
                    sx={{ px: 4 }}
                  >
                    Discuss Similar Project
                  </Button>
                </Box>
              </Grid>

              {/* Team Members */}
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
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Project Images - ОБНОВЛЕННЫЙ БЛОК */}
            {project.image_urls && project.image_urls.length > 0 && (
              <FadeInLeft>
                <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Project Gallery ({project.image_urls.length} photos)
                  </Typography>

                  {/* Отображаем все изображения */}
                  <ImageList variant="masonry" cols={project.image_urls.length === 1 ? 1 : 2} gap={16}>
                    {project.image_urls.map((image, index) => (
                      <ImageListItem key={index}>
                        <motion.img
                          src={image}
                          alt={`${project.title} ${index + 1}`}
                          loading="lazy"
                          style={{
                            borderRadius: 8,
                            cursor: 'pointer',
                            width: '100%',
                            height: 'auto'
                          }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => setSelectedImageIndex(index)}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
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
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <FadeInRight>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
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
          </Grid>
        </Grid>
      </Container>

      {/* Image Preview Dialog - ОБНОВЛЕННЫЙ БЛОК С НАВИГАЦИЕЙ */}
      <Dialog
        open={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { backgroundColor: 'transparent', boxShadow: 'none' }
        }}
      >
        <DialogContent sx={{ p: 1, position: 'relative' }}>
          {/* Кнопка закрытия */}
          <IconButton
            onClick={() => setSelectedImageIndex(null)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              zIndex: 2,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Навигация по изображениям */}
          {project?.image_urls && project.image_urls.length > 1 && (
            <>
              {/* Предыдущее изображение */}
              {selectedImageIndex > 0 && (
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 16,
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    zIndex: 2,
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                  }}
                >
                  <ArrowBackIosIcon />
                </IconButton>
              )}

              {/* Следующее изображение */}
              {selectedImageIndex < project.image_urls.length - 1 && (
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: 16,
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    zIndex: 2,
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                  }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              )}

              {/* Индикатор */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  zIndex: 2,
                  fontSize: '0.9rem'
                }}
              >
                {selectedImageIndex + 1} / {project.image_urls.length}
              </Box>
            </>
          )}

          {/* Изображение */}
          {project?.image_urls && selectedImageIndex !== null && (
            <Box
              component="img"
              src={project.image_urls[selectedImageIndex]}
              alt={`${project.title} ${selectedImageIndex + 1}`}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                maxHeight: '90vh',
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProjectDetailPage;