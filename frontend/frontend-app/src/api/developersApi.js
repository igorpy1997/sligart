// frontend/frontend-app/src/api/developersApi.js
import apiClient from './client';

export const getDevelopers = async (params = {}) => {
  const response = await apiClient.get('/public/developers', { params });
  return response;
};

export const getDeveloperBySlug = async (slug) => {
  // First get all developers, then find by slug
  const { data: developers } = await getDevelopers({ active_only: true, limit: 50 });

  const developer = developers.find(dev => {
    const devSlug = dev.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return devSlug === slug;
  });

  if (!developer) {
    throw new Error('Developer not found');
  }

  return { data: developer };
};

export const getDeveloperProjects = async (developerId) => {
  try {
    // Try specific developer projects endpoint first
    const response = await apiClient.get(`/public/developers/${developerId}/projects`, {
      params: { limit: 20 }
    });
    return response;
  } catch (error) {
    // Fallback: get all projects and filter
    console.log('No specific projects endpoint, filtering all projects');
    const { data: allProjects } = await apiClient.get('/public/projects', {
      params: { limit: 50 }
    });

    const developerProjects = allProjects.filter(project =>
      project.developers && project.developers.some(dev => dev.id === developerId)
    );

    return { data: developerProjects };
  }
};