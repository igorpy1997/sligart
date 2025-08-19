import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import Logo from './Logo';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <GitHubIcon />, url: 'https://github.com/sligart', label: 'GitHub' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com/company/sligart', label: 'LinkedIn' },
    { icon: <TelegramIcon />, url: 'https://t.me/sligart', label: 'Telegram' }
  ];

  const contactInfo = [
    { icon: <EmailIcon />, text: 'hello@sligart.studio', link: 'mailto:hello@sligart.studio' },
    { icon: <PhoneIcon />, text: '+48 123 456 789', link: 'tel:+48123456789' },
    { icon: <LocationOnIcon />, text: 'Katowice, Poland', link: null }
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
        mt: 'auto',
        pt: 4,
        pb: 2
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Logo and description */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Logo size={36} showText={true} textVariant="h6" logoPath="/logo-white.svg" />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, maxWidth: 400 }}>
              Professional web development services. From concept to deployment - we deliver quality solutions.
            </Typography>

            {/* Social media */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component={Link}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': { color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Contact
            </Typography>
            <Box>
              {contactInfo.map((contact, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Box sx={{ color: 'rgba(255,255,255,0.7)', mr: 1.5, fontSize: '1.2rem' }}>
                    {contact.icon}
                  </Box>
                  {contact.link ? (
                    <Link
                      href={contact.link}
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        '&:hover': { color: 'white', textDecoration: 'underline' }
                      }}
                    >
                      {contact.text}
                    </Link>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                      {contact.text}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', my: 2 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
            © {currentYear} Sligart Studio. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;