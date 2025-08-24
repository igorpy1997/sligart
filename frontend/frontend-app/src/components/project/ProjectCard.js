import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  AvatarGroup,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ProjectCard = ({ project, index }) => {
  const theme = useTheme();

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'ecommerce': 'E-commerce',
      'corporate': 'Corporate',
      'saas': 'SaaS Platform',
      'portfolio': 'Portfolio',
      'blog': 'Blog/CMS',
      'social': 'Social Network',
      'education': 'Education',
      'healthcare': 'Healthcare',
      'fintech': 'Fintech',
      'gaming': 'Gaming',
      'dashboard': 'Dashboard',
      'marketplace': 'Marketplace',
      'booking': 'Booking System'
    };
    return categoryMap[category] || category?.charAt(0).toUpperCase() + category?.slice(1);
  };

  const getProjectTypeColor = (type) => {
    const colors = {
      'web': theme.palette.primary.main,
      'mobile': theme.palette.secondary.main,
      'desktop': theme.palette.info.main,
      'api': theme.palette.success.main,
      'other': theme.palette.warning.main
    };
    return colors[type] || theme.palette.grey[500];
  };

  return (
    <motion.div
      whileHover={{
        y: -8,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 12px 24px ${theme.palette.primary.main}20`,
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Category and Type */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {project.category && (
              <Chip
                label={getCategoryDisplayName(project.category)}
                size="small"
                sx={{
                  backgroundColor: theme.palette.primary.main + '15',
                  color: theme.palette.primary.main,
                  fontWeight: 500
                }}
              />
            )}
            {project.project_type && (
              <Chip
                label={project.project_type.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: getProjectTypeColor(project.project_type) + '15',
                  color: getProjectTypeColor(project.project_type),
                  fontWeight: 500
                }}
              />
            )}
          </div>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
              color: theme.palette.text.primary
            }}
          >
            {project.title}
          </Typography>

          {/* Description */}
          {project.short_description && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.5
              }}
            >
              {project.short_description}
            </Typography>
          )}

          {/* Duration */}
          {project.duration_months && (
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary, mb: 2 }}
            >
              Duration: {project.duration_months} {project.duration_months === 1 ? 'month' : 'months'}
            </Typography>
          )}

          {/* Developers */}
          {project.developers && project.developers.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                Team:
              </Typography>
              <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                {project.developers.map((dev) => (
                  <Avatar
                    key={dev.id}
                    src={dev.avatar_url}
                    alt={dev.name}
                    sx={{ width: 32, height: 32 }}
                    title={`${dev.name} - ${dev.specialization}`}
                  />
                ))}
              </AvatarGroup>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
            {project.github_url && (
              <Button
                size="small"
                variant="outlined"
                component="a"
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<GitHubIcon />}
                sx={{ fontSize: '0.8rem' }}
              >
                Code
              </Button>
            )}
            <Button
              size="small"
              variant="text"
              component={Link}
              to={`/project/${project.id}`}
              endIcon={<ArrowForwardIcon />}
              sx={{ fontSize: '0.8rem', ml: 'auto' }}
            >
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;