// frontend/frontend-app/src/api/contactApi.js
import apiClient from './client';

export const submitContactForm = async (formData) => {
  const response = await apiClient.post('/public/contact', formData);
  return response;
};