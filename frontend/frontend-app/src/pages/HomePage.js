// frontend/frontend-app/src/pages/HomePage.js - WITH REDUX
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

// Redux
import { fetchStats, selectProjectsStats } from '../store/slices/projectsSlice';
import { openForm } from '../store/slices/contactSlice';

// Components
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import ServicesSection from '../components/home/ServicesSection';
import CTASection from '../components/home/CTASection';
import ContactForm from '../components/contact/ContactForm';

// Animations
import FadeInUp from '../components/animations/FadeInUp';

// Styled components
import { FlexCenter } from '../components/styled/StyledComponents';

const HomePage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const stats = useSelector(selectProjectsStats);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const handleStartProjectClick = () => {
    dispatch(openForm({
      project_type: 'web',
      source: 'hero_section'
    }));
  };

  const handleDiscussProjectClick = () => {
    dispatch(openForm({
      project_type: '',
      source: 'cta_section'
    }));
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <HeroSection onStartProject={handleStartProjectClick} />

      <StatsSection stats={stats} />

      <ServicesSection />

      <CTASection onDiscussProject={handleDiscussProjectClick} />

      <ContactForm />
    </Box>
  );
};

export default HomePage;