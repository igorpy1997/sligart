// frontend/sligart-admin/src/components/admin/projects.js
import React, { useState } from 'react';
import {
  List, Datagrid, TextField, BooleanField, DateField, NumberField,
  Edit, SimpleForm, TextInput, BooleanInput, NumberInput, SelectInput, ArrayInput, SimpleFormIterator,
  Create, Show, SimpleShowLayout, ReferenceArrayInput, AutocompleteArrayInput,
  Filter, SearchInput, ReferenceArrayField, SingleFieldList, ChipField, ImageInput, ImageField,
  useRecordContext, useNotify, useRefresh
} from 'react-admin';
import { Button, Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

// В файле frontend/sligart-admin/src/components/admin/projects.js

// Улучшенный компонент для загрузки фотографий с защитой от race condition
const SimplePhotoUploader = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [uploading, setUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]); // Очередь загрузки

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const token = localStorage.getItem('token');
    if (!token) {
      notify('No auth token found', { type: 'error' });
      return;
    }

    // Проверяем, что не идет другая загрузка
    if (uploading) {
      notify('⏳ Please wait for current upload to finish', { type: 'warning' });
      return;
    }

    setUploading(true);

    try {
      console.log(`🚀 Uploading ${files.length} photos for project ${record.id}`);

      // Создаем FormData ОДИН РАЗ для всех файлов
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('photos', file);
      });

      const response = await fetch(`/api/admin/projects/${record.id}/photos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📸 Upload result:', result);

        notify(`✅ Uploaded ${result.uploaded_urls?.length || files.length} photos! Total: ${result.total_images}`, {
          type: 'success'
        });

        // Небольшая задержка перед обновлением для гарантии записи в БД
        setTimeout(() => {
          refresh();
        }, 500);
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      notify(`❌ Upload failed: ${error.message}`, { type: 'error' });
    } finally {
      setUploading(false);
      // Сбрасываем input
      event.target.value = '';
    }
  };

  const handleDeletePhoto = async (photoUrl) => {
    const token = localStorage.getItem('token');
    if (!token) {
      notify('No auth token found', { type: 'error' });
      return;
    }

    // Проверяем, что не идет загрузка
    if (uploading) {
      notify('⏳ Please wait for upload to finish before deleting', { type: 'warning' });
      return;
    }

    try {
      console.log(`🗑️ Deleting photo: ${photoUrl}`);

      const response = await fetch(`/api/admin/projects/${record.id}/photos?photo_url=${encodeURIComponent(photoUrl)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        notify('🗑️ Photo deleted successfully', { type: 'success' });
        setTimeout(() => {
          refresh();
        }, 300);
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      notify(`❌ Delete failed: ${error.message}`, { type: 'error' });
    }
  };

  if (!record?.id) {
    return (
      <Typography color="text.secondary">
        Save the project first to manage photos
      </Typography>
    );
  }

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, my: 2 }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <PhotoLibraryIcon />
        Manage Project Photos
        {uploading && <span style={{ color: '#ff9800' }}>⏳ Uploading...</span>}
      </Typography>

      {/* Текущие фотографии */}
      {record?.image_urls && record.image_urls.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Current Photos ({record.image_urls.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {record.image_urls.map((url, index) => (
              <Card key={index} sx={{ width: 150 }}>
                <Box
                  component="img"
                  src={url}
                  alt={`Photo ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: 100,
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ p: 1, textAlign: 'center' }}>
                  <IconButton
                    color="error"
                    onClick={() => handleDeletePhoto(url)}
                    size="small"
                    title="Delete photo"
                    disabled={uploading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      ) : (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No photos uploaded yet
        </Typography>
      )}

      {/* Загрузка новых фотографий */}
      <Box>
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          disabled={uploading}
          sx={{ mb: 1 }}
        >
          {uploading ? 'Uploading...' : 'Upload Photos'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </Button>
        <Typography variant="caption" display="block" color="text.secondary">
          Select multiple image files to upload. Wait for each upload to complete.
        </Typography>

        {uploading && (
          <Typography variant="caption" display="block" sx={{ color: '#ff9800', mt: 1 }}>
            ⚠️ Upload in progress. Please wait before adding more photos.
          </Typography>
        )}
      </Box>
    </Box>
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

      {/* Простой загрузчик фотографий */}
      <SimplePhotoUploader />

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

      {/* Для создания используем стандартный ImageInput */}
      <ImageInput
        source="project_photos"
        label="Project Photos"
        accept="image/*"
        multiple
        placeholder={<p>Drop images here, or click to select multiple photos</p>}
      >
        <ImageField source="src" title="title" />
      </ImageInput>

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