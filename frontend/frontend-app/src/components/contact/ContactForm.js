// frontend/frontend-app/src/components/contact/ContactForm.js - WITH REACT-HOOK-FORM
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
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

// Redux
import {
  submitContactForm,
  closeForm,
  selectContactFormState,
  clearError
} from '../../store/slices/contactSlice';

// Components
import SuccessAnimation from './SuccessAnimation';

const ContactForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const { isOpen, initialData, loading, submitted, error } = useSelector(selectContactFormState);

  // Form setup with react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      client_name: '',
      client_email: '',
      client_phone: '',
      company_name: '',
      project_type: '',
      budget_range: '',
      timeline: '',
      description: '',
    }
  });

  // Form options
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

  // Reset form when initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        client_name: initialData.client_name || '',
        client_email: initialData.client_email || '',
        client_phone: initialData.client_phone || '',
        company_name: initialData.company_name || '',
        project_type: initialData.project_type || '',
        budget_range: initialData.budget_range || '',
        timeline: initialData.timeline || '',
        description: initialData.description || '',
      });
    }
  }, [isOpen, initialData, reset]);

  // Clear error when form opens
  useEffect(() => {
    if (isOpen && error) {
      dispatch(clearError());
    }
  }, [isOpen, error, dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(submitContactForm(data)).unwrap();

      // Close form after 2 seconds
      setTimeout(() => {
        dispatch(closeForm());
        reset();
      }, 2000);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleClose = () => {
    if (!loading) {
      dispatch(closeForm());
      reset();
    }
  };

  // Custom scrollbar styles
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
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.primary.main} #f5f5f5`,
        }
      }}
    />
  );

  if (submitted) {
    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogContent sx={{ textAlign: 'center', py: 6 }}>
          <SuccessAnimation />
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
      {scrollbarStyles}
      <Dialog
        open={isOpen}
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
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          flexShrink: 0,
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

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <DialogContent
            className="custom-scrollbar"
            sx={{
              pt: 2,
              flex: 1,
              px: { xs: 2, sm: 3 },
              pb: 0,
              overflowY: 'scroll',
              overflowX: 'hidden',
              maxHeight: isMobile
                ? 'calc(100vh - 160px)'
                : 'calc(90vh - 160px)',
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
                  <Controller
                    name="client_name"
                    control={control}
                    rules={{ required: 'Name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Your Name *"
                        fullWidth
                        disabled={loading}
                        error={!!errors.client_name}
                        helperText={errors.client_name?.message}
                      />
                    )}
                  />

                  <Controller
                    name="client_email"
                    control={control}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email Address *"
                        type="email"
                        fullWidth
                        disabled={loading}
                        error={!!errors.client_email}
                        helperText={errors.client_email?.message}
                      />
                    )}
                  />

                  <Controller
                    name="client_phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Phone Number"
                        fullWidth
                        disabled={loading}
                      />
                    )}
                  />

                  <Controller
                    name="company_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Company Name"
                        fullWidth
                        disabled={loading}
                      />
                    )}
                  />
                </Box>
              </Box>

              {/* Project Details */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Project Details
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Controller
                    name="project_type"
                    control={control}
                    rules={{ required: 'Project type is required' }}
                    render={({ field }) => (
                      <FormControl fullWidth disabled={loading} error={!!errors.project_type}>
                        <InputLabel>Project Type *</InputLabel>
                        <Select {...field} label="Project Type *">
                          {projectTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.project_type && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                            {errors.project_type.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />

                  <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                    <Controller
                      name="budget_range"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth disabled={loading}>
                          <InputLabel>Budget Range</InputLabel>
                          <Select {...field} label="Budget Range">
                            {budgetRanges.map((budget) => (
                              <MenuItem key={budget.value} value={budget.value}>
                                {budget.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />

                    <Controller
                      name="timeline"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth disabled={loading}>
                          <InputLabel>Timeline</InputLabel>
                          <Select {...field} label="Timeline">
                            {timelines.map((timeline) => (
                              <MenuItem key={timeline.value} value={timeline.value}>
                                {timeline.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Box>

                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: 'Project description is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Project Description *"
                        multiline
                        rows={4}
                        placeholder="Tell us about your project, what you want to build, target audience, key features..."
                        fullWidth
                        disabled={loading}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                </Box>
              </Box>

              {/* What We Offer */}
              <Box sx={{
                p: 3,
                mb: 2,
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

          <DialogActions sx={{
            p: 3,
            pt: 2,
            flexShrink: 0,
            position: 'sticky',
            bottom: 0,
            backgroundColor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`,
            zIndex: 1,
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
              disabled={loading || !isValid}
              sx={{
                px: 4,
                py: 1.5,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: '#FFFFFF !important',
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  color: '#FFFFFF !important',
                },
                '&:disabled': {
                  color: 'rgba(255, 255, 255, 0.6) !important',
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