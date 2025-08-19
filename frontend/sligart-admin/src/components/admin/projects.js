// frontend/sligart-admin/src/components/admin/projects.js
import React from 'react';
import {
  List, Datagrid, TextField, BooleanField, DateField, NumberField,
  Edit, SimpleForm, TextInput, BooleanInput, NumberInput, SelectInput, ArrayInput, SimpleFormIterator,
  Create, Show, SimpleShowLayout, ReferenceArrayInput, AutocompleteArrayInput,
  Filter, SearchInput, ReferenceArrayField, SingleFieldList, ChipField, ImageInput, ImageField
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
      { id: 'desktop', name: 'Desktop' },
      { id: 'api', name: 'API/Backend' },
      { id: 'other', name: 'Other' }
    ]} />
    <SelectInput source="category" choices={[
      { id: 'ecommerce', name: 'E-commerce' },
      { id: 'corporate', name: 'Corporate' },
      { id: 'saas', name: 'SaaS' },
      { id: 'portfolio', name: 'Portfolio' },
      { id: 'blog', name: 'Blog/CMS' },
      { id: 'social', name: 'Social Network' },
      { id: 'education', name: 'Education' },
      { id: 'healthcare', name: 'Healthcare' },
      { id: 'fintech', name: 'Fintech' },
      { id: 'gaming', name: 'Gaming' },
      { id: 'dashboard', name: 'Dashboard' },
      { id: 'marketplace', name: 'Marketplace' },
      { id: 'booking', name: 'Booking System' },
      { id: 'other', name: 'Other' }
    ]} />
    <BooleanInput source="featured" />
  </Filter>
);

// Кастомный компонент для отображения разработчиков
const DevelopersField = ({ record }) => (
  <div>
    {record && record.developer_ids && record.developer_ids.length > 0 ? (
      <span>{record.developer_ids.length} developer(s)</span>
    ) : (
      <span style={{ color: '#999' }}>No developers</span>
    )}
  </div>
);

// Кастомный инпут для загрузки фотографий проекта
const ProjectPhotosInput = (props) => {
  return (
    <div>
      <ImageInput
        source="project_photos"
        label="Project Photos"
        accept="image/*"
        multiple
        placeholder={<p>Drop images here, or click to select multiple photos</p>}
        {...props}
      >
        <ImageField source="src" title="title" />
      </ImageInput>

      {/* Показываем текущие фото если есть */}
      <ArrayInput source="image_urls" label="Current Photos">
        <SimpleFormIterator>
          <TextInput source="" label="Photo URL" disabled />
        </SimpleFormIterator>
      </ArrayInput>
    </div>
  );
};

export const ProjectList = (props) => (
  <List {...props} filters={<ProjectFilter />} perPage={25}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="category" />
      <TextField source="status" />
      <TextField source="project_type" />
      <BooleanField source="featured" />
      <DevelopersField label="Developers" />
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

      <ProjectPhotosInput />

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

      <SelectInput source="category" choices={[
        { id: 'ecommerce', name: 'E-commerce' },
        { id: 'corporate', name: 'Corporate Website' },
        { id: 'saas', name: 'SaaS Platform' },
        { id: 'portfolio', name: 'Portfolio' },
        { id: 'blog', name: 'Blog/CMS' },
        { id: 'social', name: 'Social Network' },
        { id: 'education', name: 'Education Platform' },
        { id: 'healthcare', name: 'Healthcare' },
        { id: 'fintech', name: 'Fintech' },
        { id: 'gaming', name: 'Gaming' },
        { id: 'dashboard', name: 'Dashboard/Analytics' },
        { id: 'marketplace', name: 'Marketplace' },
        { id: 'booking', name: 'Booking System' },
        { id: 'other', name: 'Other' }
      ]} />

      <BooleanInput source="featured" />
      <NumberInput source="duration_months" />

      <SelectInput source="budget_range" choices={[
        { id: '1k-5k', name: '$1k - $5k' },
        { id: '5k-10k', name: '$5k - $10k' },
        { id: '10k-25k', name: '$10k - $25k' },
        { id: '25k-50k', name: '$25k - $50k' },
        { id: '50k+', name: '$50k+' }
      ]} />

      {/* Выбор разработчиков */}
      <ReferenceArrayInput source="developer_ids" reference="developers">
        <AutocompleteArrayInput
          optionText="name"
          label="Developers"
          helperText="Select developers who worked on this project"
        />
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

      <ProjectPhotosInput />

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

      <SelectInput source="category" choices={[
        { id: 'ecommerce', name: 'E-commerce' },
        { id: 'corporate', name: 'Corporate Website' },
        { id: 'saas', name: 'SaaS Platform' },
        { id: 'portfolio', name: 'Portfolio' },
        { id: 'blog', name: 'Blog/CMS' },
        { id: 'social', name: 'Social Network' },
        { id: 'education', name: 'Education Platform' },
        { id: 'healthcare', name: 'Healthcare' },
        { id: 'fintech', name: 'Fintech' },
        { id: 'gaming', name: 'Gaming' },
        { id: 'dashboard', name: 'Dashboard/Analytics' },
        { id: 'marketplace', name: 'Marketplace' },
        { id: 'booking', name: 'Booking System' },
        { id: 'other', name: 'Other' }
      ]} />

      <BooleanInput source="featured" defaultValue={false} />
      <NumberInput source="duration_months" />

      <SelectInput source="budget_range" choices={[
        { id: '1k-5k', name: '$1k - $5k' },
        { id: '5k-10k', name: '$5k - $10k' },
        { id: '10k-25k', name: '$10k - $25k' },
        { id: '25k-50k', name: '$25k - $50k' },
        { id: '50k+', name: '$50k+' }
      ]} />

      {/* Выбор разработчиков */}
      <ReferenceArrayInput source="developer_ids" reference="developers">
        <AutocompleteArrayInput
          optionText="name"
          label="Developers"
          helperText="Select developers who worked on this project"
        />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
);

// Компонент для отображения массива URL изображений
const ImageUrlsField = ({ record }) => (
  <div>
    {record && record.image_urls && record.image_urls.length > 0 ? (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {record.image_urls.map((url, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <img
              src={url}
              alt={`Project ${index + 1}`}
              style={{
                width: '150px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Photo {index + 1}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <span style={{ color: '#999' }}>No photos</span>
    )}
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
      <ImageUrlsField label="Project Photos" />
      <TextField source="status" />
      <TextField source="project_type" />
      <TextField source="category" />
      <BooleanField source="featured" />
      <NumberField source="duration_months" />
      <TextField source="budget_range" />

      {/* Отображение разработчиков */}
      <ReferenceArrayField source="developer_ids" reference="developers" label="Developers">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ReferenceArrayField>

      <DateField source="created_at" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
);