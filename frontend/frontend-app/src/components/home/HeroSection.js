// frontend/frontend-app/src/components/home/HeroSection.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Typography, Button, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Animations
import FadeInLeft from '../animations/FadeInLeft';
import FadeInRight from '../animations/FadeInRight';

// Styled components
import {
  HeroSection as StyledHeroSection,
  GradientText,
  GradientButton,
  GlassCard,
  FloatingElement,
  DecorativeBlob
} from '../styled/StyledComponents';

const HeroSection = ({ onStartProject }) => {
  const theme = useTheme();

  return (
    <StyledHeroSection theme={theme}>
      <DecorativeBlob className="blob-1" size="300px" />
      <DecorativeBlob className="blob-2" size="250px" />
      <DecorativeBlob className="blob-3" size="200px" />

      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <FadeInLeft>
              <GradientText
                variant="h1"
                theme={theme}
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 3,
                  lineHeight: 1.2,
                }}
              >
                Creating Digital Solutions for the Future
              </GradientText>
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
              <Box sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                <GradientButton
                  theme={theme}
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={onStartProject}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    minWidth: 180,
                  }}
                >
                  Start a Project
                </GradientButton>

                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/projects"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    minWidth: 180,
                  }}
                >
                  View Our Work
                </Button>
              </Box>
            </FadeInLeft>
          </Grid>

          <Grid item xs={12} md={6}>
            <FadeInRight delay={0.3}>
              <FloatingElement theme={theme}>
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <GlassCard
                    elevation={3}
                    sx={{
                      p: 6,
                      height: 400,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 3,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                          color: 'white',
                          boxShadow: `0 10px 30px ${theme.palette.primary.main}40`,
                        }}
                      >
                        <Typography variant="h2" sx={{ fontWeight: 700 }}>S</Typography>
                      </Box>
                    </motion.div>

                    <GradientText
                      variant="h4"
                      theme={theme}
                      sx={{ mb: 2 }}
                    >
                      Sligart Studio
                    </GradientText>

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
                  </GlassCard>
                </motion.div>
              </FloatingElement>
            </FadeInRight>
          </Grid>
        </Grid>
      </Container>
    </StyledHeroSection>
  );
};

export default HeroSection;