import React, { useState, useEffect } from 'react';
import {
  List, Datagrid, TextField, EmailField, NumberField, BooleanField, DateField,
  Edit, SimpleForm, TextInput, NumberInput, BooleanInput, ArrayInput, SimpleFormIterator,
  Create, Show, SimpleShowLayout, ArrayField, SingleFieldList, ChipField,
  Filter, SearchInput, SelectInput, ImageField, ImageInput, useDataProvider
} from 'react-admin';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const DeveloperFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <BooleanInput source="is_active" />
    <NumberInput source="years_experience_gte" label="Min Experience" />
    <SelectInput source="specialization" choices={[
      { id: 'Frontend Developer', name: 'Frontend Developer' },
      { id: 'Backend Developer', name: 'Backend Developer' },
      { id: 'Full-Stack Developer', name: 'Full-Stack Developer' },
      { id: 'Mobile Developer', name: 'Mobile Developer' },
      { id: 'DevOps Engineer', name: 'DevOps Engineer' },
      { id: 'UI/UX Designer', name: 'UI/UX Designer' },
      { id: 'Software Developer', name: 'Software Developer' },
      { id: 'Data Engineer', name: 'Data Engineer' },
      { id: 'QA Engineer', name: 'QA Engineer' },
      { id: 'Technical Lead', name: 'Technical Lead' },
    ]} />
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

export const DeveloperList = (props) => {
  const dataProvider = useDataProvider();
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Загрузка developers с сортировкой по order_priority
  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const { data } = await dataProvider.getList('developers', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'order_priority', order: 'ASC' },
        filter: {},
      });
      setDevelopers(data);
    } catch (error) {
      console.error('Error fetching developers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedDevelopers = Array.from(developers);
    const [movedDeveloper] = reorderedDevelopers.splice(result.source.index, 1);
    reorderedDevelopers.splice(result.destination.index, 0, movedDeveloper);

    // Обновляем order_priority (0,1,2...)
    const updatedDevelopers = reorderedDevelopers.map((dev, index) => ({
      id: dev.id,
      order_priority: index,
    }));

    setDevelopers(reorderedDevelopers); // Локально обновляем

    // Отправляем обновления в API
    try {
      await dataProvider.updateMany('developers', { ids: updatedDevelopers.map(d => d.id), data: updatedDevelopers });
      console.log('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      fetchDevelopers(); // Если ошибка, перезагружаем
    }
  };

  return (
    <List {...props} filters={<DeveloperFilter />} perPage={25}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="developer-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <Datagrid bulkActionButtons={false} rowClick="show">
                  <TextField source="id" />
                  <AvatarField label="Avatar" />
                  <TextField source="name" />
                  <EmailField source="email" />
                  <TextField source="specialization" />
                  <NumberField source="years_experience" />
                  <NumberField source="hourly_rate" />
                  <NumberField source="order_priority" label="Order Priority" />
                  <BooleanField source="is_active" />
                  <DateField source="created_at" />
                  {/* Добавляем колонку для перетаскивания */}
                  <Box>
                    <DragIndicatorIcon sx={{ cursor: 'grab' }} />
                  </Box>
                </Datagrid>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </List>
  );
};

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
      <NumberInput source="years_experience" defaultValue={0} />
      <NumberInput source="hourly_rate" />
      <SelectInput
        source="specialization"
        choices={[
          { id: 'Frontend Developer', name: 'Frontend Developer' },
          { id: 'Backend Developer', name: 'Backend Developer' },
          { id: 'Full-Stack Developer', name: 'Full-Stack Developer' },
          { id: 'Mobile Developer', name: 'Mobile Developer' },
          { id: 'DevOps Engineer', name: 'DevOps Engineer' },
          { id: 'UI/UX Designer', name: 'UI/UX Designer' },
          { id: 'Software Developer', name: 'Software Developer' },
          { id: 'Data Engineer', name: 'Data Engineer' },
          { id: 'QA Engineer', name: 'QA Engineer' },
          { id: 'Technical Lead', name: 'Technical Lead' },
        ]}
        required
      />
      <ArrayInput source="skills">
        <SimpleFormIterator>
          <TextInput source="" label="Skill" />
        </SimpleFormIterator>
      </ArrayInput>
      <BooleanInput source="is_active" />
      <NumberInput source="order_priority" label="Order Priority (lower = higher in list)" defaultValue={0} />
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
      <SelectInput
        source="specialization"
        choices={[
          { id: 'Frontend Developer', name: 'Frontend Developer' },
          { id: 'Backend Developer', name: 'Backend Developer' },
          { id: 'Full-Stack Developer', name: 'Full-Stack Developer' },
          { id: 'Mobile Developer', name: 'Mobile Developer' },
          { id: 'DevOps Engineer', name: 'DevOps Engineer' },
          { id: 'UI/UX Designer', name: 'UI/UX Designer' },
          { id: 'Software Developer', name: 'Software Developer' },
          { id: 'Data Engineer', name: 'Data Engineer' },
          { id: 'QA Engineer', name: 'QA Engineer' },
          { id: 'Technical Lead', name: 'Technical Lead' },
        ]}
        defaultValue="Full-Stack Developer"
        required
      />
      <ArrayInput source="skills">
        <SimpleFormIterator>
          <TextInput source="" label="Skill" />
        </SimpleFormIterator>
      </ArrayInput>
      <BooleanInput source="is_active" defaultValue={true} />
      <NumberInput source="order_priority" label="Order Priority (lower = higher in list)" defaultValue={0} />
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
      <TextField source="specialization" />
      <SkillsField label="Skills" />
      <NumberField source="order_priority" label="Order Priority" />
      <BooleanField source="is_active" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
);