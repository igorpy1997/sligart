import React from 'react';
import {
  List, Datagrid, TextField, EmailField, NumberField, BooleanField, DateField,
  Edit, SimpleForm, TextInput, NumberInput, BooleanInput, ArrayInput, SimpleFormIterator,
  Create, Show, SimpleShowLayout, ArrayField, SingleFieldList, ChipField,
  Filter, SearchInput, SelectInput
} from 'react-admin';

const DeveloperFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <BooleanInput source="is_active" />
    <NumberInput source="years_experience_gte" label="Min Experience" />
  </Filter>
);

export const DeveloperList = (props) => (
  <List {...props} filters={<DeveloperFilter />} perPage={25}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <NumberField source="years_experience" />
      <NumberField source="hourly_rate" />
      <BooleanField source="is_active" />
      <DateField source="created_at" />
    </Datagrid>
  </List>
);

export const DeveloperEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="email" type="email" required />
      <TextInput source="bio" multiline rows={4} />
      <TextInput source="avatar_url" />
      <TextInput source="github_url" />
      <TextInput source="linkedin_url" />
      <TextInput source="portfolio_url" />
      <NumberInput source="years_experience" />
      <NumberInput source="hourly_rate" />
      <ArrayInput source="skills">
        <SimpleFormIterator>
          <TextInput source="" label="Skill" />
        </SimpleFormIterator>
      </ArrayInput>
      <BooleanInput source="is_active" />
    </SimpleForm>
  </Edit>
);

export const DeveloperCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="email" type="email" required />
      <TextInput source="bio" multiline rows={4} />
      <TextInput source="avatar_url" />
      <TextInput source="github_url" />
      <TextInput source="linkedin_url" />
      <TextInput source="portfolio_url" />
      <NumberInput source="years_experience" defaultValue={0} />
      <NumberInput source="hourly_rate" />
      <ArrayInput source="skills">
        <SimpleFormIterator>
          <TextInput source="" label="Skill" />
        </SimpleFormIterator>
      </ArrayInput>
      <BooleanInput source="is_active" defaultValue={true} />
    </SimpleForm>
  </Create>
);

// Компонент для отображения массива строк
const SkillsField = ({ record }) => (
  <span>
    {record && record.skills && record.skills.map((skill, index) => (
      <span key={index} style={{
        backgroundColor: '#e0e0e0',
        padding: '2px 6px',
        borderRadius: '4px',
        margin: '2px',
        fontSize: '12px'
      }}>
        {skill}
      </span>
    ))}
  </span>
);

export const DeveloperShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="bio" />
      <TextField source="avatar_url" />
      <TextField source="github_url" />
      <TextField source="linkedin_url" />
      <TextField source="portfolio_url" />
      <NumberField source="years_experience" />
      <NumberField source="hourly_rate" />
      <SkillsField label="Skills" />
      <BooleanField source="is_active" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
);