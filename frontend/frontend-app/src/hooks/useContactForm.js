// frontend/frontend-app/src/hooks/useContactForm.js
import { useState } from 'react';

export const useContactForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialData, setInitialData] = useState({});

  const openForm = (data = {}) => {
    setInitialData(data);
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
    setInitialData({});
  };

  return {
    isOpen,
    initialData,
    openForm,
    closeForm
  };
};