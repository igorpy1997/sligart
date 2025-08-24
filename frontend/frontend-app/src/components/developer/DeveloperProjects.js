// frontend/frontend-app/src/components/developer/DeveloperProjects.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const DeveloperProjects = ({ developer, projects }) => {
  const theme = useTheme();

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
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
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
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

                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    {project.github_url && (
                      <Button
                        size="small"
                        variant="outlined"
                        component="a"
                        href={project.github_url}
                        target="_blank"
                        endIcon={<GitHubIcon />}
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
                      sx={{ ml: 'auto' }}
                    >
                      View Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, textAlign: 'center', py: 4 }}>
          {developer?.name ? `${developer.name} hasn't worked on any public projects yet.` : "No projects available at the moment"}
        </Typography>
      )}
    </div>
  );
};

export default DeveloperProjects;