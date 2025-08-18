// frontend/sligart-ui/src/components/Admin.js
import React from 'react';
import { Admin, Resource } from 'react-admin';
import authProvider from '../authProvider';
import dataProvider from '../dataProvider';

// Import custom components
import { DeveloperList, DeveloperEdit, DeveloperCreate, DeveloperShow } from './admin/developers';
import { ProjectList, ProjectEdit, ProjectCreate, ProjectShow } from './admin/projects';
import { TechnologyList, TechnologyEdit, TechnologyCreate } from './admin/technologies';
import { ServiceRequestList, ServiceRequestEdit, ServiceRequestShow } from './admin/serviceRequests';

const PortfolioAdmin = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    title="Portfolio Admin"
    loginPage={true}
  >
    <Resource
      name="developers"
      list={DeveloperList}
      edit={DeveloperEdit}
      create={DeveloperCreate}
      show={DeveloperShow}
      recordRepresentation="name"
    />
    <Resource
      name="projects"
      list={ProjectList}
      edit={ProjectEdit}
      create={ProjectCreate}
      show={ProjectShow}
      recordRepresentation="title"
    />
    <Resource
      name="technologies"
      list={TechnologyList}
      edit={TechnologyEdit}
      create={TechnologyCreate}
      recordRepresentation="name"
    />
    <Resource
      name="service-requests"
      list={ServiceRequestList}
      edit={ServiceRequestEdit}
      show={ServiceRequestShow}
      recordRepresentation="client_name"
    />
  </Admin>
);

export default PortfolioAdmin;