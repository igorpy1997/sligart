import React, { useState, useEffect } from 'react';
import {
  List, Datagrid, TextField, EmailField, NumberField, BooleanField, DateField,
  Edit, SimpleForm, TextInput, NumberInput, BooleanInput, ArrayInput, SimpleFormIterator,
  Create, Show, SimpleShowLayout, ArrayField, SingleFieldList, ChipField,
  Filter, SearchInput, SelectInput, ImageField, ImageInput, useDataProvider,
  useNotify, useRefresh, Loading, CreateButton, TopToolbar
} from 'react-admin';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

// Кастомный топ бар с кнопкой создания
const DeveloperListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

// Кастомный компонент списка с drag and drop
const DraggableDeveloperList = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
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
      console.log('Loaded developers:', data);
      setDevelopers(data);
    } catch (error) {
      console.error('Error fetching developers:', error);
      notify('Error loading developers', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const onDragEnd = async (result) => {
    console.log('Drag ended:', result);

    if (!result.destination) {
      console.log('No destination');
      return;
    }

    if (result.source.index === result.destination.index) {
      console.log('Same position');
      return;
    }

    // Создаем новый массив с переставленными элементами
    const reorderedDevelopers = Array.from(developers);
    const [movedDeveloper] = reorderedDevelopers.splice(result.source.index, 1);
    reorderedDevelopers.splice(result.destination.index, 0, movedDeveloper);

    // Обновляем order_priority для всех элементов
    const updatedDevelopers = reorderedDevelopers.map((dev, index) => ({
      ...dev,
      order_priority: index,
    }));

    console.log('Updated order:', updatedDevelopers.map(d => ({ id: d.id, name: d.name, order: d.order_priority })));

    // Локально обновляем состояние для мгновенного отклика
    setDevelopers(updatedDevelopers);

    // Отправляем обновления в API
    try {
      // Обновляем каждого разработчика отдельно
      for (const dev of updatedDevelopers) {
        await dataProvider.update('developers', {
          id: dev.id,
          data: { order_priority: dev.order_priority },
          previousData: dev
        });
      }

      console.log('Order updated successfully');
      notify('Developer order updated!', { type: 'success' });

      // Перезагружаем данные через небольшое время
      setTimeout(() => {
        refresh();
      }, 1000);
    } catch (error) {
      console.error('Error updating order:', error);
      notify('Failed to update order', { type: 'error' });
      // Если ошибка, возвращаем к исходному состоянию
      fetchDevelopers();
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Developers (Drag to Reorder)
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="developer-list">
          {(provided, snapshot) => (
            <Table
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                backgroundColor: snapshot.isDraggingOver ? '#f5f5f5' : 'white',
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 50 }}>Drag</TableCell>
                  <TableCell sx={{ width: 60 }}>ID</TableCell>
                  <TableCell sx={{ width: 80 }}>Avatar</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell sx={{ width: 100 }}>Experience</TableCell>
                  <TableCell sx={{ width: 100 }}>Rate</TableCell>
                  <TableCell sx={{ width: 80 }}>Order</TableCell>
                  <TableCell sx={{ width: 80 }}>Active</TableCell>
                  <TableCell sx={{ width: 120 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {developers.map((developer, index) => (
                  <Draggable
                    key={developer.id}
                    draggableId={developer.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          backgroundColor: snapshot.isDragging ? '#e3f2fd' : 'white',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                          },
                        }}
                      >
                        <TableCell
                          {...provided.dragHandleProps}
                          sx={{
                            cursor: 'grab',
                            '&:active': { cursor: 'grabbing' },
                            textAlign: 'center',
                          }}
                        >
                          <DragIndicatorIcon color="action" />
                        </TableCell>
                        <TableCell>{developer.id}</TableCell>
                        <TableCell>
                          <AvatarField record={developer} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {developer.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {developer.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={developer.specialization}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{developer.years_experience} years</TableCell>
                        <TableCell>
                          {developer.hourly_rate ? `$${developer.hourly_rate}/h` : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={developer.order_priority}
                            size="small"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={developer.is_active ? 'Active' : 'Inactive'}
                            size="small"
                            color={developer.is_active ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => window.location.href = `#/developers/${developer.id}/show`}
                            title="View"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => window.location.href = `#/developers/${developer.id}`}
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    </Paper>
  );
};

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
  return (
    <List {...props} actions={<DeveloperListActions />} filters={<DeveloperFilter />}>
      <Box sx={{ p: 2 }}>
        <DraggableDeveloperList />
      </Box>
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