// frontend/frontend-app/src/components/developer/DeveloperProfile.js
import React from 'react';
import {
  Paper,
  Grid,
  Avatar,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LaunchIcon from '@mui/icons-material/Launch';
import CodeIcon from '@mui/icons-material/Code';
import PersonIcon from '@mui/icons-material/Person';

const DeveloperProfile = ({ developer, onStartProject }) => {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Avatar
            src={developer?.avatar_url}
            sx={{
              width: 200,
              height: 200,
              margin: { xs: '0 auto', md: '0' },
              mb: 2,
              border: `4px solid ${theme.palette.primary.main}`,
            }}
          >
            {!developer?.avatar_url && <PersonIcon sx={{ fontSize: 80 }} />}
          </Avatar>

          {/* Social Links */}
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 1, mt: 2 }}>
            {developer?.github_url && (
              <IconButton
                component="a"
                href={developer.github_url}
                target="_blank"
                sx={{ color: theme.palette.text.secondary }}
              >
                <GitHubIcon />
              </IconButton>
            )}
            {developer?.linkedin_url && (
              <IconButton
                component="a"
                href={developer.linkedin_url}
                target="_blank"
                sx={{ color: theme.palette.text.secondary }}
              >
                <LinkedInIcon />
              </IconButton>
            )}
            {developer?.portfolio_url && (
              <IconButton
                component="a"
                href={developer.portfolio_url}
                target="_blank"
                sx={{ color: theme.palette.text.secondary }}
              >
                <LaunchIcon />
              </IconButton>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
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
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
              {developer.years_experience} {developer.years_experience === 1 ? 'year' : 'years'} of experience
            </Typography>
          )}

          {developer?.hourly_rate && (
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
              Starting from ${developer.hourly_rate}/hour
            </Typography>
          )}

          {developer?.bio && (
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {developer.bio}
            </Typography>
          )}

          {/* Skills */}
          {developer?.skills && developer.skills.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <CodeIcon sx={{ mr: 1 }} />
                Skills & Technologies
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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

          {/* CTA Button */}
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<EmailIcon />}
              onClick={onStartProject}
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
  );
};

export default DeveloperProfile;