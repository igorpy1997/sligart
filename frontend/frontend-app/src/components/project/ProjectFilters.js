// frontend/frontend-app/src/components/project/ProjectFilters.js
import React from 'react';
import { Paper, Tabs, Tab } from '@mui/material';

const ProjectFilters = ({ selectedCategory, categories, onCategoryChange }) => {
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
    return categoryMap[category.id] || category.id.charAt(0).toUpperCase() + category.id.slice(1);
  };

  return (
    <Paper sx={{ mb: 4, borderRadius: 3 }}>
      <Tabs
        value={selectedCategory}
        onChange={onCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          px: 2,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
          }
        }}
      >
        <Tab label="All Projects" value="all" />
        {categories.map((category) => (
          <Tab
            key={category.id}
            label={`${getCategoryDisplayName(category)} (${category.count})`}
            value={category.id}
          />
        ))}
      </Tabs>
    </Paper>
  );
};

export default ProjectFilters;