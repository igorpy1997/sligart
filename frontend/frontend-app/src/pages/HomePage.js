import React, {useEffect, useState} from 'react';
import {Box, Button, CardContent, CircularProgress, Container, Grid, Typography, useTheme,} from '@mui/material';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CloudIcon from '@mui/icons-material/Cloud';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

// Импорт анимаций
import {AnimatedCounter, FadeInLeft, FadeInRight, FadeInUp,} from '../components/animations';

// Импорт стилизованных компонентов
import {
    DecorativeBlob,
    FlexCenter,
    FloatingElement,
    GlassCard,
    GradientButton,
    GradientText,
    HeroSection,
    HoverCard,
    Section,
} from '../components/styled/StyledComponents';

// НОВЫЕ ИМПОРТЫ
import ContactForm from '../components/ContactForm';
import { useContactForm } from '../hooks/useContactForm';

const HomePage = () => {
    const theme = useTheme();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // ИСПОЛЬЗУЕМ ХУК ДЛЯ ФОРМЫ
    const { isOpen, openForm, closeForm } = useContactForm();

    // Load stats from API
    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await fetch('/api/public/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                } else {
                    console.error('Failed to load stats');
                    setStats({
                        developers: 3,
                        projects: 15,
                        completed_projects: 12,
                        years_experience: 3
                    });
                }
            } catch (error) {
                console.error('Error loading stats:', error);
                setStats({
                    developers: 3,
                    projects: 15,
                    completed_projects: 12,
                    years_experience: 3
                });
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    const features = [
        {
            icon: <CodeIcon sx={{fontSize: 48, color: theme.palette.primary.main}}/>,
            title: 'Web Development',
            description: 'Building modern web applications with cutting-edge technologies and best practices',
            color: theme.palette.primary.main,
        },
        {
            icon: <DesignServicesIcon sx={{fontSize: 48, color: theme.palette.secondary.main}}/>,
            title: 'UI/UX Design',
            description: 'Creating intuitive interfaces that users love to interact with',
            color: theme.palette.secondary.main,
        },
        {
            icon: <CloudIcon sx={{fontSize: 48, color: theme.palette.primary.light}}/>,
            title: 'DevOps & Hosting',
            description: 'Ensuring reliable infrastructure and security for your projects',
            color: theme.palette.primary.light,
        }
    ];

    // Dynamic stats display
    const getStatsDisplay = () => {
        if (!stats) return [];

        return [
            {number: stats.projects, label: 'Completed Projects', suffix: '+'},
            {number: stats.years_experience, label: 'Years Experience', suffix: '+'},
            {number: stats.completed_projects, label: 'Happy Clients', suffix: '+'},
            {number: 24, label: 'Hour Support', suffix: '/7'}
        ];
    };

    // ФУНКЦИИ ДЛЯ ОТКРЫТИЯ ФОРМЫ
    const handleStartProjectClick = () => {
        openForm({
            project_type: 'web', // Задаем начальный тип проекта
            source: 'hero_section'
        });
    };

    const handleDiscussProjectClick = () => {
        openForm({
            project_type: '', // Пользователь сам выберет
            source: 'cta_section'
        });
    };

    return (
        <Box sx={{position: 'relative', overflow: 'hidden'}}>
            {/* Декоративные блобы */}
            <DecorativeBlob className="blob-1" size="300px"/>
            <DecorativeBlob className="blob-2" size="250px"/>
            <DecorativeBlob className="blob-3" size="200px"/>

            {/* Hero Section */}
            <HeroSection theme={theme}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <FadeInLeft>
                                <GradientText
                                    variant="h1"
                                    theme={theme}
                                    sx={{
                                        fontSize: {xs: '2.5rem', md: '3.5rem'},
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
                                        fontSize: {xs: '1.1rem', md: '1.25rem'},
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
                                        endIcon={<ArrowForwardIcon/>}
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            minWidth: 180,
                                        }}
                                        onClick={handleStartProjectClick} // ЗАМЕНИЛИ HREF НА ONCLICK
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
                                                whileHover={{scale: 1.1}}
                                                transition={{duration: 0.3}}
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
                                                    <Typography variant="h2" sx={{fontWeight: 700}}>S</Typography>
                                                </Box>
                                            </motion.div>

                                            <GradientText
                                                variant="h4"
                                                theme={theme}
                                                sx={{mb: 2}}
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
            </HeroSection>

            {/* Statistics */}
            <Section gradient theme={theme}>
                <Container maxWidth="lg">
                    {loading ? (
                        <FlexCenter sx={{p: 4}}>
                            <CircularProgress/>
                        </FlexCenter>
                    ) : (
                        <FadeInUp>
                            <Grid container spacing={4}>
                                {getStatsDisplay().map((stat, index) => (
                                    <Grid item xs={6} md={3} key={index}>
                                        <motion.div
                                            whileHover={{scale: 1.05}}
                                            transition={{duration: 0.2}}
                                        >
                                            <FlexCenter column sx={{textAlign: 'center'}}>
                                                <GradientText
                                                    variant="h3"
                                                    theme={theme}
                                                    sx={{mb: 1}}
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
                                                    sx={{color: theme.palette.text.secondary}}
                                                >
                                                    {stat.label}
                                                </Typography>
                                            </FlexCenter>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </FadeInUp>
                    )}
                </Container>
            </Section>

            {/* Our Services */}
            <Section theme={theme}>
                <Container maxWidth="lg">
                    <FadeInUp>
                        <FlexCenter column sx={{textAlign: 'center', mb: 6}}>
                            <GradientText
                                variant="h2"
                                theme={theme}
                                sx={{mb: 2}}
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
                                                whileHover={{scale: 1.1, rotate: 5}}
                                                transition={{duration: 0.3}}
                                            >
                                                <Box sx={{mb: 3}}>
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
                        ))}
                    </Grid>
                </Container>
            </Section>

            {/* CTA Section */}
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
                        <GlassCard sx={{p: 6, textAlign: 'center', position: 'relative'}}>
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
                                initial={{scale: 0.9}}
                                whileInView={{scale: 1}}
                                transition={{duration: 0.5, ease: "easeOut"}}
                            >
                                <GradientText
                                    variant="h3"
                                    theme={theme}
                                    sx={{mb: 2}}
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

                                <FlexCenter gap={3} sx={{flexWrap: 'wrap'}}>
                                    <motion.div
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        <GradientButton
                                            theme={theme}
                                            size="large"
                                            startIcon={<ContactPhoneIcon/>} // ИЗМЕНИЛИ ИКОНКУ
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                minWidth: 180,
                                            }}
                                            onClick={handleDiscussProjectClick} // ЗАМЕНИЛИ HREF НА ONCLICK
                                        >
                                            Discuss Project
                                        </GradientButton>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
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

            {/* ДОБАВЛЯЕМ ФОРМУ ОБРАТНОЙ СВЯЗИ */}
            <ContactForm
                open={isOpen}
                onClose={closeForm}
            />
        </Box>
    );
};

export default HomePage;