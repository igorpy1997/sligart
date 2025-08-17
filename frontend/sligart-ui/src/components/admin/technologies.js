import React from 'react';
import {
  List, Datagrid, TextField, DateField,
  Edit, SimpleForm, TextInput, SelectInput,
  Create, Filter, SearchInput
} from 'react-admin';

const TechnologyFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput source="category" choices={[
      { id: 'frontend', name: 'Frontend' },
      { id: 'backend', name: 'Backend' },
      { id: 'database', name: 'Database' },
      { id: 'devops', name: 'DevOps' },
      { id: 'mobile', name: 'Mobile' },
      { id: 'other', name: 'Other' }
    ]} />
  </Filter>
);

export const TechnologyList = (props) => (
  <List {...props} filters={<TechnologyFilter />} perPage={50}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="category" />
      <TextField source="color" />
      <DateField source="created_at" />
    </Datagrid>
  </List>
);

export const TechnologyEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" required />
      <SelectInput source="category" choices={[
        { id: 'frontend', name: 'Frontend' },
        { id: 'backend', name: 'Backend' },
        { id: 'database', name: 'Database' },
        { id: 'devops', name: 'DevOps' },
        { id: 'mobile', name: 'Mobile' },
        { id: 'design', name: 'Design' },
        { id: 'testing', name: 'Testing' },
        { id: 'other', name: 'Other' }
      ]} />
      <TextInput source="icon_url" label="Icon URL" />
      <TextInput source="color" label="Color (hex)" placeholder="#3178c6" />
    </SimpleForm>
  </Edit>
);

export const TechnologyCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" required />
      <SelectInput source="category" choices={[
        { id: 'frontend', name: 'Frontend' },
        { id: 'backend', name: 'Backend' },
        { id: 'database', name: 'Database' },
        { id: 'devops', name: 'DevOps' },
        { id: 'mobile', name: 'Mobile' },
        { id: 'design', name: 'Design' },
        { id: 'testing', name: 'Testing' },
        { id: 'other', name: 'Other' }
      ]} />
      <TextInput source="icon_url" label="Icon URL" />
      <TextInput source="color" label="Color (hex)" placeholder="#3178c6" />
    </SimpleForm>
  </Create>
);