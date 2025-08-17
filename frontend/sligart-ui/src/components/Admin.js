import React from 'react';
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

// Import custom components (создадим позже)
import { DeveloperList, DeveloperEdit, DeveloperCreate, DeveloperShow } from './admin/developers';
import { ProjectList, ProjectEdit, ProjectCreate, ProjectShow } from './admin/projects';
import { TechnologyList, TechnologyEdit, TechnologyCreate } from './admin/technologies';
import { ServiceRequestList, ServiceRequestEdit, ServiceRequestShow } from './admin/serviceRequests';

// Configure the data provider
const dataProvider = simpleRestProvider('/api/admin');

const PortfolioAdmin = () => (
  <Admin dataProvider={dataProvider} title="Portfolio Admin">
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