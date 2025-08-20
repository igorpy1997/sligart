// frontend/frontend-app/src/pages/DeveloperPage.js - ПОЛНАЯ ВЕРСИЯ
import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    Paper,
    Tab,
    Tabs,
    Typography,
    useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LaunchIcon from '@mui/icons-material/Launch';
import EmailIcon from '@mui/icons-material/Email';
import CodeIcon from '@mui/icons-material/Code';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// ИМПОРТЫ ДЛЯ ФОРМЫ
import ContactForm from '../components/ContactForm';
import { useContactForm } from '../hooks/useContactForm';

const DeveloperPage = () => {
    const {developerSlug} = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const [developer, setDeveloper] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    // ХУК ДЛЯ ФОРМЫ
    const { isOpen, openForm, closeForm } = useContactForm();

    useEffect(() => {
        const loadDeveloperData = async () => {
            try {
                setLoading(true);

                // Загружаем всех разработчиков для поиска по имени
                const developersResponse = await fetch('/api/public/developers?active_only=true&limit=50');
                if (!developersResponse.ok) {
                    throw new Error('Failed to load developers');
                }
                const developersData = await developersResponse.json();

                // Ищем разработчика по slug
                const targetDeveloper = developersData.find(dev => {
                    const slug = dev.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    return slug === developerSlug;
                });

                if (!targetDeveloper) {
                    throw new Error('Developer not found');
                }

                setDeveloper(targetDeveloper);

                // Загружаем проекты конкретного разработчика
                try {
                    const projectsResponse = await fetch(`/api/public/developers/${targetDeveloper.id}/projects?limit=20`);
                    if (projectsResponse.ok) {
                        const projectsData = await projectsResponse.json();
                        setProjects(projectsData);
                        console.log(`📂 Loaded ${projectsData.length} projects for ${targetDeveloper.name}`);
                    } else {
                        console.log('⚠️ No specific projects endpoint, showing all projects');
                        const allProjectsResponse = await fetch('/api/public/projects?limit=50');
                        if (allProjectsResponse.ok) {
                            const allProjects = await allProjectsResponse.json();
                            const developerProjects = allProjects.filter(project =>
                                project.developers && project.developers.some(dev => dev.id === targetDeveloper.id)
                            );
                            setProjects(developerProjects);
                            console.log(`📂 Filtered ${developerProjects.length} projects for ${targetDeveloper.name}`);
                        }
                    }
                } catch (projectError) {
                    console.error('Error loading projects:', projectError);
                    setProjects([]);
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (developerSlug) {
            loadDeveloperData();
        }
    }, [developerSlug]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // ФУНКЦИЯ ДЛЯ ОТКРЫТИЯ ФОРМЫ С ПРЕДЗАПОЛНЕННЫМИ ДАННЫМИ
    const handleStartProject = () => {
        openForm({
            project_type: 'web',
            description: `I'd like to discuss a project with ${developer?.name} (${developer?.specialization}). `,
            source: `developer_page_${developer?.id}`
        });
    };

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
                <CircularProgress size={60}/>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{py: 4}}>
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
                <Button onClick={() => navigate('/')} startIcon={<ArrowBackIcon/>}>
                    Back to Home
                </Button>
            </Container>
        );
    }

    if (!developer) {
        return (
            <Container maxWidth="md" sx={{py: 4}}>
                <Alert severity="warning">Developer not found</Alert>
            </Container>
        );
    }

    return (
        <Box sx={{minHeight: '100vh', backgroundColor: theme.palette.background.default}}>
            {/* Header с кнопкой назад */}
            <Box sx={{
                backgroundColor: theme.palette.background.paper,
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}>
                <Container maxWidth="lg" sx={{py: 2}}>
                    <Button
                        onClick={() => navigate('/')}
                        startIcon={<ArrowBackIcon/>}
                        sx={{color: theme.palette.text.secondary}}
                    >
                        Back to Home
                    </Button>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{py: 4}}>
                {/* Профиль разработчика */}
                <Paper sx={{p: 4, mb: 4, borderRadius: 3}}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={4} sx={{textAlign: {xs: 'center', md: 'left'}}}>
                            <Avatar
                                src={developer?.avatar_url}
                                sx={{
                                    width: 200,
                                    height: 200,
                                    margin: {xs: '0 auto', md: '0'},
                                    mb: 2,
                                    border: `4px solid ${theme.palette.primary.main}`,
                                }}
                            >
                                {!developer?.avatar_url && <PersonIcon sx={{fontSize: 80}}/>}
                            </Avatar>

                            {/* Социальные ссылки */}
                            <Box
                                sx={{display: 'flex', justifyContent: {xs: 'center', md: 'flex-start'}, gap: 1, mt: 2}}>
                                {developer?.github_url && (
                                    <IconButton
                                        component="a"
                                        href={developer.github_url}
                                        target="_blank"
                                        sx={{color: theme.palette.text.secondary}}
                                    >
                                        <GitHubIcon/>
                                    </IconButton>
                                )}
                                {developer?.linkedin_url && (
                                    <IconButton
                                        component="a"
                                        href={developer.linkedin_url}
                                        target="_blank"
                                        sx={{color: theme.palette.text.secondary}}
                                    >
                                        <LinkedInIcon/>
                                    </IconButton>
                                )}
                                {developer?.portfolio_url && (
                                    <IconButton
                                        component="a"
                                        href={developer.portfolio_url}
                                        target="_blank"
                                        sx={{color: theme.palette.text.secondary}}
                                    >
                                        <LaunchIcon/>
                                    </IconButton>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Typography variant="h3" sx={{fontWeight: 700, mb: 1}}>
                                {developer?.name}
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    color: theme.palette.secondary.main,
                                    fontWeight: 500,
                                    mb: 2
                                }}
                            >
                                {developer?.specialization}
                            </Typography>

                            {developer?.years_experience > 0 && (
                                <Typography variant="body1" sx={{color: theme.palette.text.secondary, mb: 2}}>
                                    {developer.years_experience} {developer.years_experience === 1 ? 'year' : 'years'} of
                                    experience
                                </Typography>
                            )}

                            {developer?.hourly_rate && (
                                <Typography variant="body1" sx={{color: theme.palette.text.secondary, mb: 2}}>
                                    Starting from ${developer.hourly_rate}/hour
                                </Typography>
                            )}

                            {developer?.bio && (
                                <Typography variant="body1" sx={{mb: 3, lineHeight: 1.6}}>
                                    {developer.bio}
                                </Typography>
                            )}

                            {/* Навыки */}
                            {developer?.skills && developer.skills.length > 0 && (
                                <Box>
                                    <Typography variant="h6" sx={{mb: 2, display: 'flex', alignItems: 'center'}}>
                                        <CodeIcon sx={{mr: 1}}/>
                                        Skills & Technologies
                                    </Typography>
                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                        {developer.skills.map((skill, index) => (
                                            <Chip
                                                key={index}
                                                label={skill}
                                                variant="outlined"
                                                sx={{
                                                    borderColor: theme.palette.primary.main,
                                                    color: theme.palette.primary.main,
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.primary.main + '10',
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* CTA - КНОПКА ОТКРЫТИЯ ФОРМЫ */}
                            <Box sx={{mt: 3}}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<EmailIcon/>}
                                    onClick={handleStartProject}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        '&:hover': {
                                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                                        }
                                    }}
                                >
                                    Start a Project
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Табы */}
                <Paper sx={{borderRadius: 3}}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            px: 2
                        }}
                    >
                        <Tab label="Projects"/>
                        <Tab label="About"/>
                    </Tabs>

                    {/* Контент табов */}
                    <Box sx={{p: 3}}>
                        {/* Таб с проектами */}
                        {activeTab === 0 && (
                            <Box>
                                <Typography variant="h5" sx={{mb: 3, fontWeight: 600}}>
                                    {developer?.name}'s Projects ({projects.length})
                                </Typography>

                                {projects.length > 0 ? (
                                    <Grid container spacing={3}>
                                        {projects.slice(0, 6).map((project) => (
                                            <Grid item xs={12} md={6} lg={4} key={project.id}>
                                                <Card
                                                    sx={{
                                                        height: '100%',
                                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: `0 8px 25px ${theme.palette.primary.main}20`
                                                        }
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Typography variant="h6" sx={{fontWeight: 600, mb: 1}}>
                                                            {project.title}
                                                        </Typography>
                                                        {project.short_description && (
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: theme.palette.text.secondary,
                                                                    mb: 2,
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 3,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    overflow: 'hidden'
                                                                }}
                                                            >
                                                                {project.short_description}
                                                            </Typography>
                                                        )}

                                                        <Box sx={{display: 'flex', gap: 1, mt: 2}}>
                                                            {project.github_url && (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    component="a"
                                                                    href={project.github_url}
                                                                    target="_blank"
                                                                    endIcon={<GitHubIcon/>}
                                                                >
                                                                    Code
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="small"
                                                                variant="text"
                                                                component={Link}
                                                                to={`/project/${project.id}`}
                                                                endIcon={<ArrowForwardIcon/>}
                                                                sx={{ml: 'auto'}}
                                                            >
                                                                View Project
                                                            </Button>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Typography variant="body1"
                                                sx={{color: theme.palette.text.secondary, textAlign: 'center', py: 4}}>
                                        {developer?.name ? `${developer.name} hasn't worked on any public projects yet.` : "No projects available at the moment"}
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {/* Таб с детальной информацией */}
                        {activeTab === 1 && (
                            <Box>
                                <Typography variant="h5" sx={{mb: 3, fontWeight: 600}}>
                                    About {developer?.name}
                                </Typography>

                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={8}>
                                        {developer?.bio ? (
                                            <Typography variant="body1" sx={{lineHeight: 1.8, mb: 3}}>
                                                {developer.bio}
                                            </Typography>
                                        ) : (
                                            <Typography variant="body1"
                                                        sx={{color: theme.palette.text.secondary, fontStyle: 'italic'}}>
                                                No detailed biography available yet.
                                            </Typography>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Paper variant="outlined" sx={{p: 3, borderRadius: 2}}>
                                            <Typography variant="h6" sx={{mb: 2, fontWeight: 600}}>
                                                Quick Facts
                                            </Typography>

                                            <Box sx={{mb: 2}}>
                                                <Typography variant="body2" sx={{color: theme.palette.text.secondary}}>
                                                    Specialization
                                                </Typography>
                                                <Typography variant="body1" sx={{fontWeight: 500}}>
                                                    {developer?.specialization || 'Developer'}
                                                </Typography>
                                            </Box>

                                            {developer?.years_experience > 0 && (
                                                <Box sx={{mb: 2}}>
                                                    <Typography variant="body2"
                                                                sx={{color: theme.palette.text.secondary}}>
                                                        Experience
                                                    </Typography>
                                                    <Typography variant="body1" sx={{fontWeight: 500}}>
                                                        {developer.years_experience} {developer.years_experience === 1 ? 'year' : 'years'}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {developer?.skills && developer.skills.length > 0 && (
                                                <Box>
                                                    <Typography variant="body2"
                                                                sx={{color: theme.palette.text.secondary, mb: 1}}>
                                                        Technologies ({developer.skills.length})
                                                    </Typography>
                                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                                        {developer.skills.slice(0, 8).map((skill, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={skill}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        ))}
                                                        {developer.skills.length > 8 && (
                                                            <Chip
                                                                label={`+${developer.skills.length - 8} more`}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{opacity: 0.7}}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Container>

            {/* ФОРМА ОБРАТНОЙ СВЯЗИ */}
            <ContactForm
                open={isOpen}
                onClose={closeForm}
                initialProjectType=""
            />
        </Box>
    );
};

export default DeveloperPage;