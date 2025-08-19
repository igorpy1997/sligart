import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CloudIcon from '@mui/icons-material/Cloud';

// Простые анимационные компоненты
import {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  AnimatedCounter,
} from '../components/animations';

const HomePage = () => {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load stats from API
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/public/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('Failed to load stats');
          setStats({
            developers: 3,
            projects: 15,
            completed_projects: 12,
            years_experience: 3
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
        setStats({
          developers: 3,
          projects: 15,
          completed_projects: 12,
          years_experience: 3
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const features = [
    {
      icon: <CodeIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Web Development',
      description: 'Building modern web applications with cutting-edge technologies and best practices'
    },
    {
      icon: <DesignServicesIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      title: 'UI/UX Design',
      description: 'Creating intuitive interfaces that users love to interact with'
    },
    {
      icon: <CloudIcon sx={{ fontSize: 48, color: theme.palette.primary.light }} />,
      title: 'DevOps & Hosting',
      description: 'Ensuring reliable infrastructure and security for your projects'
    }
  ];

  // Dynamic stats display
  const getStatsDisplay = () => {
    if (!stats) return [];

    return [
      { number: stats.projects, label: 'Completed Projects', suffix: '+' },
      { number: stats.years_experience, label: 'Years Experience', suffix: '+' },
      { number: stats.completed_projects, label: 'Happy Clients', suffix: '+' },
      { number: 24, label: 'Hour Support', suffix: '/7' }
    ];
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: theme.palette.background.default,
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <FadeInLeft>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 700,
                    mb: 3,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                  }}
                >
                  Creating Digital Solutions for the Future
                </Typography>
              </FadeInLeft>

              <FadeInLeft delay={0.2}>
                <Typography
                  variant="h5"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 4,
                    lineHeight: 1.6,
                    fontWeight: 400,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                  }}
                >
                  A team of professionals who bring your ideas to life through modern,
                  scalable, and efficient IT solutions.
                </Typography>
              </FadeInLeft>

              <FadeInLeft delay={0.4}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    Start a Project
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/apitest"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    View Our Work
                  </Button>
                </Box>
              </FadeInLeft>
            </Grid>

            <Grid item xs={12} md={6}>
              <FadeInRight delay={0.3}>
                <Box
                  sx={{
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 6,
                      height: 400,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 3,
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        color: 'white',
                      }}
                    >
                      <Typography variant="h2">S</Typography>
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: theme.palette.text.primary,
                      }}
                    >
                      Sligart Studio
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        textAlign: 'center',
                        lineHeight: 1.6,
                      }}
                    >
                      Professional development team ready to bring your ideas to life
                    </Typography>
                  </Paper>
                </Box>
              </FadeInRight>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics */}
      <Box sx={{ py: 6, backgroundColor: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <FadeInUp>
              <Grid container spacing={4}>
                {getStatsDisplay().map((stat, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: theme.palette.primary.main,
                          mb: 1
                        }}
                      >
                        <AnimatedCounter
                          value={stat.number}
                          duration={2}
                          delay={index * 0.2}
                        />
                        {stat.suffix}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </FadeInUp>
          )}
        </Container>
      </Box>

      {/* Our Services */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <FadeInUp>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                What We Do
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                Full development cycle from idea to launch and support
              </Typography>
            </Box>
          </FadeInUp>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FadeInUp delay={index * 0.1}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 3 }}>
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: theme.palette.text.primary
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </FadeInUp>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 6,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="md">
          <FadeInUp>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                Ready to Start Your Project?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                Tell us about your idea and we'll help bring it to life. First consultation is free!
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  Discuss Project
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  View Portfolio
                </Button>
              </Box>
            </Box>
          </FadeInUp>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;