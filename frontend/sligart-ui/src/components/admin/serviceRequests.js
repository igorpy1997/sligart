import React from 'react';
import {
  List, Datagrid, TextField, DateField, EmailField,
  Edit, SimpleForm, TextInput, SelectInput, ReferenceInput, AutocompleteInput,
  Show, SimpleShowLayout, Filter, SearchInput
} from 'react-admin';

const ServiceRequestFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput source="status" choices={[
      { id: 'new', name: 'New' },
      { id: 'contacted', name: 'Contacted' },
      { id: 'in_progress', name: 'In Progress' },
      { id: 'completed', name: 'Completed' },
      { id: 'rejected', name: 'Rejected' }
    ]} />
    <SelectInput source="priority" choices={[
      { id: 'low', name: 'Low' },
      { id: 'medium', name: 'Medium' },
      { id: 'high', name: 'High' }
    ]} />
    <SelectInput source="project_type" choices={[
      { id: 'web', name: 'Web Development' },
      { id: 'mobile', name: 'Mobile App' },
      { id: 'consultation', name: 'Consultation' },
      { id: 'maintenance', name: 'Maintenance' },
      { id: 'other', name: 'Other' }
    ]} />
  </Filter>
);

export const ServiceRequestList = (props) => (
  <List {...props} filters={<ServiceRequestFilter />} perPage={25} sort={{ field: 'created_at', order: 'DESC' }}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="client_name" />
      <EmailField source="client_email" />
      <TextField source="project_type" />
      <TextField source="status" />
      <TextField source="priority" />
      <DateField source="created_at" />
    </Datagrid>
  </List>
);

export const ServiceRequestEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="client_name" required />
      <TextInput source="client_email" type="email" required />
      <TextInput source="client_phone" />
      <TextInput source="company_name" />
      <SelectInput source="project_type" choices={[
        { id: 'web', name: 'Web Development' },
        { id: 'mobile', name: 'Mobile App' },
        { id: 'desktop', name: 'Desktop Application' },
        { id: 'api', name: 'API Development' },
        { id: 'consultation', name: 'Consultation' },
        { id: 'maintenance', name: 'Maintenance' },
        { id: 'other', name: 'Other' }
      ]} />
      <SelectInput source="budget_range" choices={[
        { id: 'under-1k', name: 'Under $1,000' },
        { id: '1k-5k', name: '$1,000 - $5,000' },
        { id: '5k-10k', name: '$5,000 - $10,000' },
        { id: '10k-25k', name: '$10,000 - $25,000' },
        { id: 'over-25k', name: 'Over $25,000' }
      ]} />
      <TextInput source="timeline" />
      <TextInput source="description" multiline rows={4} />
      <SelectInput source="status" choices={[
        { id: 'new', name: 'New' },
        { id: 'contacted', name: 'Contacted' },
        { id: 'in_progress', name: 'In Progress' },
        { id: 'completed', name: 'Completed' },
        { id: 'rejected', name: 'Rejected' }
      ]} />
      <SelectInput source="priority" choices={[
        { id: 'low', name: 'Low' },
        { id: 'medium', name: 'Medium' },
        { id: 'high', name: 'High' }
      ]} />
      <ReferenceInput source="developer_id" reference="developers" allowEmpty>
        <AutocompleteInput />
      </ReferenceInput>
      <TextInput source="notes" multiline rows={3} />
    </SimpleForm>
  </Edit>
);

export const ServiceRequestShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="client_name" />
      <EmailField source="client_email" />
      <TextField source="client_phone" />
      <TextField source="company_name" />
      <TextField source="project_type" />
      <TextField source="budget_range" />
      <TextField source="timeline" />
      <TextField source="description" />
      <TextField source="status" />
      <TextField source="priority" />
      <TextField source="notes" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
);