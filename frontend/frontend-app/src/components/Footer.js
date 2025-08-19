import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';

const Footer = () => {
  const theme = useTheme();

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <GitHubIcon />,
      url: 'https://github.com/sligart',
      label: 'GitHub'
    },
    {
      icon: <LinkedInIcon />,
      url: 'https://linkedin.com/company/sligart',
      label: 'LinkedIn'
    },
    {
      icon: <TelegramIcon />,
      url: 'https://t.me/sligart',
      label: 'Telegram'
    }
  ];

  const contactInfo = [
    {
      icon: <EmailIcon />,
      text: 'hello@sligart.studio',
      link: 'mailto:hello@sligart.studio'
    },
    {
      icon: <PhoneIcon />,
      text: '+48 123 456 789',
      link: 'tel:+48123456789'
    },
    {
      icon: <LocationOnIcon />,
      text: 'Katowice, Poland',
      link: null
    }
  ];

  const services = [
    'Web Development',
    'Mobile Apps',
    'UI/UX Design',
    'API Development',
    'DevOps & Hosting',
    'Technical Consulting'
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
        mt: 'auto',
        pt: 6,
        pb: 3
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Логотип и описание */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    S
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Sligart Studio
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                Мы создаем современные веб-решения, которые помогают бизнесу расти.
                От идеи до реализации - ваш надежный партнер в мире IT.
              </Typography>

              {/* Социальные сети */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    component={Link}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        color: 'white',
                        backgroundColor: theme.palette.secondary.main,
                      }
                    }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Услуги */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Наши услуги
            </Typography>
            <Box>
              {services.map((service, index) => (
                <Link
                  key={index}
                  href="#"
                  sx={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    mb: 1,
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'white',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {service}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Контакты */}
          <Grid item xs={12} sm={6} md={5}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Связаться с нами
            </Typography>
            <Box>
              {contactInfo.map((contact, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      color: theme.palette.secondary.main,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {contact.icon}
                  </Box>
                  {contact.link ? (
                    <Link
                      href={contact.link}
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        '&:hover': {
                          color: 'white',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {contact.text}
                    </Link>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                      {contact.text}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>

            {/* CTA */}
            <Box
              sx={{
                mt: 3,
                p: 2,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                border: `1px solid ${theme.palette.secondary.main}`
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Есть проект?
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                Обсудим ваши идеи и воплотим их в жизнь
              </Typography>
              <Link
                href="mailto:hello@sligart.studio"
                sx={{
                  color: theme.palette.secondary.main,
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Написать нам →
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', my: 3 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            © {currentYear} Sligart Studio. Все права защищены.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;