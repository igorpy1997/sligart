import React from 'react';
import {
  List, Datagrid, TextField, BooleanField, DateField, NumberField,
  Edit, SimpleForm, TextInput, BooleanInput, NumberInput, SelectInput, ArrayInput, SimpleFormIterator,
  Create, Show, SimpleShowLayout,
  Filter, SearchInput
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
          <TextInput source="" label="Image URL" />
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
          <TextInput source="" label="Image URL" />
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
    </SimpleForm>
  </Create>
);

// Компонент для отображения массива URL изображений
const ImageUrlsField = ({ record }) => (
  <div>
    {record && record.image_urls && record.image_urls.map((url, index) => (
      <div key={index} style={{ margin: '5px 0' }}>
        <a href={url} target="_blank" rel="noopener noreferrer" style={{
          fontSize: '12px',
          color: '#1976d2',
          textDecoration: 'none'
        }}>
          {url.length > 50 ? `${url.substring(0, 50)}...` : url}
        </a>
      </div>
    ))}
  </div>
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
      <ImageUrlsField label="Image URLs" />
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