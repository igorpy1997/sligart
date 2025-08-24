// frontend/frontend-app/src/components/index.js - UPDATED
// Layout components
export { default as Header } from './layout/Header';
export { default as Footer } from './layout/Footer';

// Base components
export { default as Logo } from './Logo';

// Contact components
export { default as ContactForm } from './contact/ContactForm';
export { default as FloatingContactButton } from './contact/FloatingContactButton';
export { default as SuccessAnimation } from './contact/SuccessAnimation';

// Developer components
export { default as DeveloperHeader } from './developer/DeveloperHeader';
export { default as DeveloperProfile } from './developer/DeveloperProfile';
export { default as DeveloperTabs } from './developer/DeveloperTabs';
export { default as DeveloperProjects } from './developer/DeveloperProjects';
export { default as DeveloperAbout } from './developer/DeveloperAbout';

// Home components
export { default as HeroSection } from './home/HeroSection';
export { default as StatsSection } from './home/StatsSection';
export { default as ServicesSection } from './home/ServicesSection';
export { default as CTASection } from './home/CTASection';

// Project components
export { default as ProjectCard } from './project/ProjectCard';
export { default as ProjectGallery } from './project/ProjectGallery';
export { default as ProjectFilters } from './project/ProjectFilters';
export { default as ProjectGrid } from './project/ProjectGrid';

// Animation components (re-export from animations/index.js)
export * from './animations';

// Styled components (re-export from styled/index.js)
export * from './styled';