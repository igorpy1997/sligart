import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CloudIcon from '@mui/icons-material/Cloud';

const HomePage = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <CodeIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Веб-разработка',
      description: 'Создаем современные веб-приложения с использованием последних технологий'
    },
    {
      icon: <DesignServicesIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      title: 'UI/UX Дизайн',
      description: 'Проектируем интуитивные интерфейсы, которые любят пользователи'
    },
    {
      icon: <CloudIcon sx={{ fontSize: 48, color: theme.palette.primary.light }} />,
      title: 'DevOps & Hosting',
      description: 'Обеспечиваем надежную инфраструктуру и безопасность ваших проектов'
    }
  ];

  const stats = [
    { number: '50+', label: 'Завершенных проектов' },
    { number: '3+', label: 'Лет опыта' },
    { number: '20+', label: 'Довольных клиентов' },
    { number: '24/7', label: 'Поддержка' }
  ];

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
        {/* Декоративные элементы */}
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
                Создаем digital-решения будущего
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
                Команда профессионалов, которая воплощает ваши идеи в современные,
                масштабируемые и эффективные IT-решения.
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
                  Начать проект
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
                  Наши работы
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
                {/* Placeholder для команды */}
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
                  {/* Временный placeholder - здесь будет фото команды */}
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="h4" sx={{ color: theme.palette.primary.main, mb: 2 }}>
                      📸
                    </Typography>
                    <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                      Фото команды
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Место для общего фото студии
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Статистика */}
      <Box sx={{ py: 6, backgroundColor: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
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
        </Container>
      </Box>

      {/* Наши услуги */}
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
              Что мы делаем
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Полный цикл разработки от идеи до запуска и поддержки
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
              Готовы начать проект?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                lineHeight: 1.6
              }}
            >
              Расскажите нам о своей идее, и мы поможем воплотить её в жизнь.
              Первая консультация — бесплатно!
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
                Обсудить проект
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
                Посмотреть портфолио
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;