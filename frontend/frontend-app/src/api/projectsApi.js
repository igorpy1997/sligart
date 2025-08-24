// frontend/frontend-app/src/api/projectsApi.js
import apiClient from './client';

export const getProjects = async (params = {}) => {
  const response = await apiClient.get('/public/projects', { params });
  return response;
};

export const getProjectById = async (projectId) => {
  const response = await apiClient.get(`/public/projects/${projectId}`);
  return response;
};

export const getProjectCategories = async () => {
  const response = await apiClient.get('/public/projects/categories/list');
  return response;
};

export const getRelatedProjects = async (category, excludeId, limit = 6) => {
  const { data: allProjects } = await getProjects({ category, limit: 50 });
  const filtered = allProjects.filter(p => p.id !== parseInt(excludeId));
  return { data: filtered.slice(0, limit) };
};

export const getStats = async () => {
  const response = await apiClient.get('/public/stats');
  return response;
};