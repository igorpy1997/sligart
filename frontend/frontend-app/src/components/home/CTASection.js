// frontend/frontend-app/src/components/home/CTASection.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

// Components
import FadeInUp from '../animations/FadeInUp';
import { Section, FlexCenter, GlassCard, GradientText } from '../styled/StyledComponents';

const CTASection = ({ onDiscussProject }) => {
  const theme = useTheme();

  return (
    <Section
      gradient
      theme={theme}
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="md">
        <FadeInUp>
          <GlassCard sx={{ p: 6, textAlign: 'center', position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                left: -20,
                width: 40,
                height: 40,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: '50%',
                opacity: 0.3,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -15,
                right: -15,
                width: 30,
                height: 30,
                background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                borderRadius: '50%',
                opacity: 0.3,
              }}
            />

            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <GradientText
                variant="h3"
                theme={theme}
                sx={{ mb: 2 }}
              >
                Ready to Start Your Project?
              </GradientText>

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

              <FlexCenter gap={3} sx={{ flexWrap: 'wrap' }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ContactPhoneIcon />}
                    onClick={onDiscussProject}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      minWidth: 180,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      }
                    }}
                  >
                    Discuss Project
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
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      borderWidth: 2,
                      minWidth: 180,
                      '&:hover': {
                        borderWidth: 2,
                        background: `${theme.palette.primary.main}10`,
                      }
                    }}
                  >
                    View Portfolio
                  </Button>
                </motion.div>
              </FlexCenter>
            </motion.div>
          </GlassCard>
        </FadeInUp>
      </Container>
    </Section>
  );
};

export default CTASection;