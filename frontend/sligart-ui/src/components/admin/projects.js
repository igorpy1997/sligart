import React from 'react';
import {
  List, Datagrid, TextField, BooleanField, DateField, NumberField,
  Edit, SimpleForm, TextInput, BooleanInput, NumberInput, SelectInput, ArrayInput, SimpleFormIterator,
  Create, Show, SimpleShowLayout, ArrayField, SingleFieldList, ChipField,
  Filter, SearchInput, ReferenceArrayInput, AutocompleteArrayInput
} from 'react-admin';

const ProjectFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput source="status" choices={[
      { id: 'active', name: 'Active' },
      { id: 'archived', name: 'Archived' },
      { id: 'draft', name: 'Draft' }
    ]} />
    <SelectInput source="project_type" choices={[
      { id: 'web', name: 'Web' },
      { id: 'mobile', name: 'Mobile' },
      { id: 'desktop', name: 'Desktop' }
    ]} />
    <BooleanInput source="featured" />
  </Filter>
);

export const ProjectList = (props) => (
  <List {...props} filters={<ProjectFilter />} perPage={25}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="status" />
      <TextField source="project_type" />
      <BooleanField source="featured" />
      <NumberField source="duration_months" />
      <DateField source="created_at" />
    </Datagrid>
  </List>
);

export const ProjectEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="title" required />
      <TextInput source="short_description" multiline rows={2} />
      <TextInput source="description" multiline rows={6} />
      <TextInput source="demo_url" />
      <TextInput source="github_url" />
      <ArrayInput source="image_urls">
        <SimpleFormIterator>
          <TextInput label="Image URL" />
        </SimpleFormIterator>
      </ArrayInput>
      <SelectInput source="status" choices={[
        { id: 'active', name: 'Active' },
        { id: 'archived', name: 'Archived' },
        { id: 'draft', name: 'Draft' }
      ]} />
      <SelectInput source="project_type" choices={[
        { id: 'web', name: 'Web Application' },
        { id: 'mobile', name: 'Mobile App' },
        { id: 'desktop', name: 'Desktop Application' },
        { id: 'api', name: 'API/Backend' },
        { id: 'other', name: 'Other' }
      ]} />
      <BooleanInput source="featured" />
      <NumberInput source="duration_months" />
      <SelectInput source="budget_range" choices={[
        { id: '1k-5k', name: '$1k - $5k' },
        { id: '5k-10k', name: '$5k - $10k' },
        { id: '10k-25k', name: '$10k - $25k' },
        { id: '25k+', name: '$25k+' }
      ]} />
      <ReferenceArrayInput source="developer_ids" reference="developers">
        <AutocompleteArrayInput />
      </ReferenceArrayInput>
      <ReferenceArrayInput source="technology_ids" reference="technologies">
        <AutocompleteArrayInput />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);

export const ProjectCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" required />
      <TextInput source="short_description" multiline rows={2} />
      <TextInput source="description" multiline rows={6} />
      <TextInput source="demo_url" />
      <TextInput source="github_url" />
      <ArrayInput source="image_urls">
        <SimpleFormIterator>
          <TextInput label="Image URL" />
        </SimpleFormIterator>
      </ArrayInput>
      <SelectInput source="status" choices={[
        { id: 'active', name: 'Active' },
        { id: 'archived', name: 'Archived' },
        { id: 'draft', name: 'Draft' }
      ]} defaultValue="draft" />
      <SelectInput source="project_type" choices={[
        { id: 'web', name: 'Web Application' },
        { id: 'mobile', name: 'Mobile App' },
        { id: 'desktop', name: 'Desktop Application' },
        { id: 'api', name: 'API/Backend' },
        { id: 'other', name: 'Other' }
      ]} />
      <BooleanInput source="featured" defaultValue={false} />
      <NumberInput source="duration_months" />
      <SelectInput source="budget_range" choices={[
        { id: '1k-5k', name: '$1k - $5k' },
        { id: '5k-10k', name: '$5k - $10k' },
        { id: '10k-25k', name: '$10k - $25k' },
        { id: '25k+', name: '$25k+' }
      ]} />
      <ReferenceArrayInput source="developer_ids" reference="developers">
        <AutocompleteArrayInput />
      </ReferenceArrayInput>
      <ReferenceArrayInput source="technology_ids" reference="technologies">
        <AutocompleteArrayInput />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
);

export const ProjectShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="short_description" />
      <TextField source="description" />
      <TextField source="demo_url" />
      <TextField source="github_url" />
      <ArrayField source="image_urls">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
      <TextField source="status" />
      <TextField source="project_type" />
      <BooleanField source="featured" />
      <NumberField source="duration_months" />
      <TextField source="budget_range" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
);