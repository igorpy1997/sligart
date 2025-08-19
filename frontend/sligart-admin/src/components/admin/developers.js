import React from 'react';
import {
  List, Datagrid, TextField, EmailField, NumberField, BooleanField, DateField,
  Edit, SimpleForm, TextInput, NumberInput, BooleanInput, ArrayInput, SimpleFormIterator,
  Create, Show, SimpleShowLayout, ArrayField, SingleFieldList, ChipField,
  Filter, SearchInput, SelectInput, ImageField, ImageInput
} from 'react-admin';

const DeveloperFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <BooleanInput source="is_active" />
    <NumberInput source="years_experience_gte" label="Min Experience" />
  </Filter>
);

// Кастомный компонент для отображения аватара в списке
const AvatarField = ({ record }) => (
  record && record.avatar_url ? (
    <img
      src={record.avatar_url}
      alt="Avatar"
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        objectFit: 'cover'
      }}
    />
  ) : (
    <div style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: '#e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      color: '#666'
    }}>
      No Photo
    </div>
  )
);

// Кастомный инпут для загрузки аватара
const AvatarInput = (props) => {
  return (
    <div>
      <ImageInput
        source="avatar_file"
        label="Avatar"
        accept="image/*"
        placeholder={<p>Drop an image here, or click to select one</p>}
        {...props}
      >
        <ImageField source="src" title="title" />
      </ImageInput>

      {/* Показываем текущий аватар если есть */}
      <TextInput
        source="avatar_url"
        label="Current Avatar URL"
        disabled
        helperText="This field will be updated automatically when you upload a new avatar"
      />
    </div>
  );
};

export const DeveloperList = (props) => (
  <List {...props} filters={<DeveloperFilter />} perPage={25}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <AvatarField label="Avatar" />
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
      <AvatarInput />
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
      <AvatarInput />
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
      <ImageField source="avatar_url" label="Avatar" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="bio" />
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