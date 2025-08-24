// frontend/frontend-app/src/components/home/ServicesSection.js
import React from 'react';
import { Container, Grid, Typography, CardContent, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CloudIcon from '@mui/icons-material/Cloud';

// Components
import FadeInUp from '../animations/FadeInUp';
import { Section, FlexCenter, HoverCard, GradientText } from '../styled/StyledComponents';

const ServiceCard = ({ feature, index, theme }) => (
  <Grid item xs={12} md={4} key={index}>
    <FadeInUp delay={index * 0.1}>
      <HoverCard
        clickable
        sx={{
          height: '100%',
          minHeight: 300,
          textAlign: 'center',
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${feature.color}, ${feature.color}80)`,
          }}
        />

        <CardContent sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mb: 3 }}>
              {feature.icon}
            </Box>
          </motion.div>

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
            sx={{
              color: theme.palette.text.secondary,
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {feature.description}
          </Typography>
        </CardContent>
      </HoverCard>
    </FadeInUp>
  </Grid>
);

const ServicesSection = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <CodeIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Web Development',
      description: 'Building modern web applications with cutting-edge technologies and best practices',
      color: theme.palette.primary.main,
    },
    {
      icon: <DesignServicesIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      title: 'UI/UX Design',
      description: 'Creating intuitive interfaces that users love to interact with',
      color: theme.palette.secondary.main,
    },
    {
      icon: <CloudIcon sx={{ fontSize: 48, color: theme.palette.primary.light }} />,
      title: 'DevOps & Hosting',
      description: 'Ensuring reliable infrastructure and security for your projects',
      color: theme.palette.primary.light,
    }
  ];

  return (
    <Section theme={theme}>
      <Container maxWidth="lg">
        <FadeInUp>
          <FlexCenter column sx={{ textAlign: 'center', mb: 6 }}>
            <GradientText
              variant="h2"
              theme={theme}
              sx={{ mb: 2 }}
            >
              What We Do
            </GradientText>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
              }}
            >
              Full development cycle from idea to launch and support
            </Typography>
          </FlexCenter>
        </FadeInUp>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <ServiceCard
              key={index}
              feature={feature}
              index={index}
              theme={theme}
            />
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default ServicesSection;