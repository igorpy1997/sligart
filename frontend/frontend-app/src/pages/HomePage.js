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
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CloudIcon from '@mui/icons-material/Cloud';

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
          // Fallback to default stats
          setStats({
            developers: 3,
            projects: 15,
            completed_projects: 12,
            years_experience: 3
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback to default stats
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
      description: 'Building modern web applications with cutting-edge technologies'
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
      { number: `${stats.projects}+`, label: 'Completed Projects' },
      { number: `${stats.years_experience}+`, label: 'Years Experience' },
      { number: `${stats.completed_projects}+`, label: 'Happy Clients' },
      { number: '24/7', label: 'Support' }
    ];
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
            opacity: 0.6
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${theme.palette.secondary.main}15, ${theme.palette.primary.light}15)`,
            opacity: 0.4
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 3,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Creating Digital Solutions for the Future
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 4,
                  lineHeight: 1.6,
                  fontWeight: 400
                }}
              >
                A team of professionals who bring your ideas to life through modern,
                scalable, and efficient IT solutions.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
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
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      backgroundColor: theme.palette.primary.main + '10'
                    }
                  }}
                >
                  View Our Work
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    right: -20,
                    bottom: -20,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                    borderRadius: 4,
                    zIndex: -1
                  }
                }}
              >
                {/* Placeholder for team image - you'll replace this */}
                <Box
                  sx={{
                    height: 400,
                    background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.primary.light}30)`,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px dashed ${theme.palette.primary.main}40`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* TODO: Replace with actual team photo */}
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="h4" sx={{ color: theme.palette.primary.main, mb: 2 }}>
                      📸
                    </Typography>
                    <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                      Team Photo
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Studio team photo placeholder
                    </Typography>
                  </Box>
                </Box>
              </Box>
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
                      {stat.number}
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
          )}
        </Container>
      </Box>

      {/* Our Services */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
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

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 8px 25px ${theme.palette.primary.main}20`
                    }
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
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, mb: 3 }}
            >
              Ready to Start Your Project?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                lineHeight: 1.6
              }}
            >
              Tell us about your idea and we'll help bring it to life.
              First consultation is free!
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  }
                }}
              >
                Discuss Project
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                View Portfolio
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;