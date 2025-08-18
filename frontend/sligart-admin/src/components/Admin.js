// frontend/sligart-admin/src/components/Admin.js
import React from 'react';
import { Admin, Resource } from 'react-admin';
import authProvider from '../authProvider';
import dataProvider from '../dataProvider';
import Login from './Login'; // Import our Login component

// Import icons
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import CodeIcon from '@mui/icons-material/Code';
import MailIcon from '@mui/icons-material/Mail';

// Import custom components
import { DeveloperList, DeveloperEdit, DeveloperCreate, DeveloperShow } from './admin/developers';
import { ProjectList, ProjectEdit, ProjectCreate, ProjectShow } from './admin/projects';
import { TechnologyList, TechnologyEdit, TechnologyCreate } from './admin/technologies';
import { ServiceRequestList, ServiceRequestEdit, ServiceRequestShow } from './admin/serviceRequests';

// Dashboard
const Dashboard = () => (
  <div style={{ padding: '20px' }}>
    <h2>Welcome to Portfolio Admin Panel</h2>
    <p>Select a resource from the menu to get started.</p>
  </div>
);

const PortfolioAdmin = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    loginPage={Login}
    dashboard={Dashboard}
    requireAuth
  >
    <Resource
      name="developers"
      list={DeveloperList}
      edit={DeveloperEdit}
      create={DeveloperCreate}
      show={DeveloperShow}
      recordRepresentation="name"
      icon={PersonIcon}
    />
    <Resource
      name="projects"
      list={ProjectList}
      edit={ProjectEdit}
      create={ProjectCreate}
      show={ProjectShow}
      recordRepresentation="title"
      icon={FolderIcon}
    />
    <Resource
      name="technologies"
      list={TechnologyList}
      edit={TechnologyEdit}
      create={TechnologyCreate}
      recordRepresentation="name"
      icon={CodeIcon}
    />
    <Resource
      name="service-requests"
      list={ServiceRequestList}
      edit={ServiceRequestEdit}
      show={ServiceRequestShow}
      recordRepresentation="client_name"
      icon={MailIcon}
      options={{ label: 'Service Requests' }}
    />
  </Admin>
);

export default PortfolioAdmin;