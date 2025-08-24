// frontend/frontend-app/src/components/project/ProjectGrid.js
import React from 'react';
import { Grid } from '@mui/material';
import { StaggerContainer } from '../animations';
import ProjectCard from './ProjectCard';

const ProjectGrid = ({ projects }) => {
  return (
    <StaggerContainer staggerDelay={0.1}>
      <Grid container spacing={3}>
        {projects.map((project, index) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <ProjectCard project={project} index={index} />
          </Grid>
        ))}
      </Grid>
    </StaggerContainer>
  );
};

export default ProjectGrid;