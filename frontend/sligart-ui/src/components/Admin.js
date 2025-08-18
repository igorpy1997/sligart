// frontend/sligart-ui/src/components/Admin.js
import React from 'react';
import { Admin, Resource } from 'react-admin';
import authProvider from '../authProvider';
import dataProvider from '../dataProvider';

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

// Simple Login Page for now
const SimpleLoginPage = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0'
  }}>
    <div style={{
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2>Portfolio Admin</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        authProvider.login({
          username: formData.get('username'),
          password: formData.get('password')
        }).then(() => {
          window.location.reload();
        }).catch(() => {
          alert('Login failed');
        });
      }}>
        <div style={{ marginBottom: '15px' }}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            style={{
              padding: '10px',
              width: '200px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            style={{
              padding: '10px',
              width: '200px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#3f51b5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Login
        </button>
      </form>
      <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        Test: admin / admin123
      </p>
    </div>
  </div>
);

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
    loginPage={SimpleLoginPage}
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