import React from 'react';
import { Container, Grid, CircularProgress, useTheme, Typography } from '@mui/material'; // Добавлен импорт Typography
import { motion } from 'framer-motion';

// Components
import FadeInUp from '../animations/FadeInUp';
import AnimatedCounter from '../animations/AnimatedCounter';
import { Section, FlexCenter, GradientText } from '../styled/StyledComponents';

const StatCard = ({ stat, index, theme }) => (
  <Grid item xs={6} md={3} key={index}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <FlexCenter column sx={{ textAlign: 'center' }}>
        <GradientText
          variant="h3"
          theme={theme}
          sx={{ mb: 1 }}
        >
          <AnimatedCounter
            value={stat.number}
            duration={2}
            delay={index * 0.2}
          />
          {stat.suffix}
        </GradientText>
        <Typography
          variant="body1"
          sx={{ color: theme.palette.text.secondary }}
        >
          {stat.label}
        </Typography>
      </FlexCenter>
    </motion.div>
  </Grid>
);

const StatsSection = ({ stats }) => {
  const theme = useTheme();

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
    <Section gradient theme={theme}>
      <Container maxWidth="lg">
        {!stats ? (
          <FlexCenter sx={{ p: 4 }}>
            <CircularProgress />
          </FlexCenter>
        ) : (
          <FadeInUp>
            <Grid container spacing={4}>
              {getStatsDisplay().map((stat, index) => (
                <StatCard
                  key={index}
                  stat={stat}
                  index={index}
                  theme={theme}
                />
              ))}
            </Grid>
          </FadeInUp>
        )}
      </Container>
    </Section>
  );
};

export default StatsSection;