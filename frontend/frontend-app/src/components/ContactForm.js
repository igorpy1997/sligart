// frontend/frontend-app/src/components/ContactForm.js - ИСПРАВЛЕННАЯ ВЕРСИЯ БЕЗ ДВОЙНЫХ СКРОЛЛ-БАРОВ
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  GlobalStyles
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';

const ContactForm = ({ open, onClose, initialProjectType = '' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    company_name: '',
    project_type: initialProjectType,
    budget_range: '',
    timeline: '',
    description: '',
    requirements: {}
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Добавляем глобальные стили для красивого кастомного скролл-бара
  const scrollbarStyles = (
    <GlobalStyles
      styles={{
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f5f5f5',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: '10px',
            border: '2px solid #ffffff',
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            }
          },
          // Для Firefox
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.primary.main} #f5f5f5`,
        }
      }}
    />
  );

  const projectTypes = [
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'ecommerce', label: 'E-commerce Store' },
    { value: 'saas', label: 'SaaS Platform' },
    { value: 'corporate', label: 'Corporate Website' },
    { value: 'consultation', label: 'Technical Consultation' },
    { value: 'maintenance', label: 'Website Maintenance' },
    { value: 'other', label: 'Other' }
  ];

  const budgetRanges = [
    { value: '1k-5k', label: '$1,000 - $5,000' },
    { value: '5k-10k', label: '$5,000 - $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: '25k-50k', label: '$25,000 - $50,000' },
    { value: '50k+', label: '$50,000+' },
    { value: 'discuss', label: 'Let\'s discuss' }
  ];

  const timelines = [
    { value: 'asap', label: 'ASAP' },
    { value: '1-month', label: 'Within 1 month' },
    { value: '2-3-months', label: '2-3 months' },
    { value: '3-6-months', label: '3-6 months' },
    { value: '6+ months', label: '6+ months' },
    { value: 'flexible', label: 'Flexible timeline' }
  ];

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      const result = await response.json();
      console.log('✅ Contact form submitted:', result);

      setSubmitted(true);

      // Закрываем форму через 2 секунды
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({
          client_name: '',
          client_email: '',
          client_phone: '',
          company_name: '',
          project_type: '',
          budget_range: '',
          timeline: '',
          description: '',
          requirements: {}
        });
      }, 2000);

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (submitted) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogContent sx={{ textAlign: 'center', py: 6 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                color: 'white',
                fontSize: '2rem'
              }}
            >
              ✓
            </Box>
          </motion.div>

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Thank You!
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
            Your request has been submitted successfully.
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            We'll get back to you within 24 hours.
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      {/* ВОЗВРАЩАЕМ КАСТОМНЫЕ СТИЛИ СКРОЛЛ-БАРА */}
      {scrollbarStyles}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            maxHeight: isMobile ? '100vh' : '90vh',
            display: 'flex',
            flexDirection: 'column',
            // УБИРАЕМ ДЕФОЛТНЫЙ СКРОЛЛ У DIALOG
            overflow: 'hidden',
          }
        }}
      >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1,
        flexShrink: 0, // НЕ СЖИМАЕТСЯ
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            Let's Start Your Project
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Tell us about your idea and we'll get back to you within 24 hours
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{ ml: 2 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* КОНТЕНТ С КАСТОМНЫМ СКРОЛЛОМ */}
        <DialogContent
          className="custom-scrollbar"
          sx={{
            pt: 2,
            flex: 1,
            px: { xs: 2, sm: 3 },
            pb: 0, // УБИРАЕМ НИЖНИЙ ОТСТУП
            // ЯВНО ВКЛЮЧАЕМ СКРОЛЛ С КАСТОМНЫМИ СТИЛЯМИ
            overflowY: 'scroll',
            overflowX: 'hidden',
            // ОГРАНИЧИВАЕМ ВЫСОТУ ЧТОБЫ КНОПКИ ВСЕГДА БЫЛИ ВИДНЫ
            maxHeight: isMobile
              ? 'calc(100vh - 160px)' // МЕСТО ДЛЯ HEADER + КНОПОК
              : 'calc(90vh - 160px)',   // МЕСТО ДЛЯ HEADER + КНОПОК
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'grid', gap: 3 }}>
            {/* Personal Info */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Contact Information
              </Typography>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                <TextField
                  label="Your Name *"
                  value={formData.client_name}
                  onChange={handleChange('client_name')}
                  required
                  fullWidth
                  disabled={loading}
                />
                <TextField
                  label="Email Address *"
                  type="email"
                  value={formData.client_email}
                  onChange={handleChange('client_email')}
                  required
                  fullWidth
                  disabled={loading}
                />
                <TextField
                  label="Phone Number"
                  value={formData.client_phone}
                  onChange={handleChange('client_phone')}
                  fullWidth
                  disabled={loading}
                />
                <TextField
                  label="Company Name"
                  value={formData.company_name}
                  onChange={handleChange('company_name')}
                  fullWidth
                  disabled={loading}
                />
              </Box>
            </Box>

            {/* Project Details */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Project Details
              </Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <FormControl fullWidth required disabled={loading}>
                  <InputLabel>Project Type</InputLabel>
                  <Select
                    value={formData.project_type}
                    onChange={handleChange('project_type')}
                    label="Project Type"
                  >
                    {projectTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <FormControl fullWidth disabled={loading}>
                    <InputLabel>Budget Range</InputLabel>
                    <Select
                      value={formData.budget_range}
                      onChange={handleChange('budget_range')}
                      label="Budget Range"
                    >
                      {budgetRanges.map((budget) => (
                        <MenuItem key={budget.value} value={budget.value}>
                          {budget.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth disabled={loading}>
                    <InputLabel>Timeline</InputLabel>
                    <Select
                      value={formData.timeline}
                      onChange={handleChange('timeline')}
                      label="Timeline"
                    >
                      {timelines.map((timeline) => (
                        <MenuItem key={timeline.value} value={timeline.value}>
                          {timeline.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <TextField
                  label="Project Description *"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange('description')}
                  placeholder="Tell us about your project, what you want to build, target audience, key features..."
                  required
                  fullWidth
                  disabled={loading}
                />
              </Box>
            </Box>

            {/* What We Offer */}
            <Box sx={{
              p: 3,
              mb: 2, // ДОБАВЛЯЕМ ОТСТУП СНИЗУ ЧТОБЫ КНОПКИ НЕ ПЕРЕКРЫВАЛИ
              backgroundColor: theme.palette.primary.main + '08',
              borderRadius: 2,
              border: `1px solid ${theme.palette.primary.main}20`
            }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                ✨ What You Get:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {[
                  'Free consultation',
                  'Detailed project estimation',
                  '24h response time',
                  'Modern tech stack',
                  'Full support'
                ].map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.primary.main + '15',
                      color: theme.palette.primary.main,
                      fontWeight: 500
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        {/* КНОПКИ ВНИЗУ - ВСЕГДА ВИДНЫ */}
        <DialogActions sx={{
          p: 3,
          pt: 2,
          flexShrink: 0, // НЕ СЖИМАЕТСЯ
          position: 'sticky', // ПРИЛИПАЕТ К НИЗУ
          bottom: 0,
          backgroundColor: theme.palette.background.paper, // БЕЛЫЙ ФОН
          borderTop: `1px solid ${theme.palette.divider}`, // ВИЗУАЛЬНОЕ РАЗДЕЛЕНИЕ
          zIndex: 1, // ПОВЕРХ КОНТЕНТА
        }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.client_name || !formData.client_email || !formData.project_type || !formData.description}
            sx={{
              px: 4,
              py: 1.5,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: '#FFFFFF !important', // ПРИНУДИТЕЛЬНО БЕЛЫЙ ТЕКСТ
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                color: '#FFFFFF !important', // И ПРИ ХОВЕРЕ ТОЖЕ
              },
              '&:disabled': {
                color: 'rgba(255, 255, 255, 0.6) !important', // ДАЖЕ КОГДА DISABLED
              }
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Sending...
              </>
            ) : (
              'Send Request'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
    </>
  );
};

export default ContactForm;