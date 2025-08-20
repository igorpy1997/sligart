// frontend/sligart-admin/src/components/admin/serviceRequests.js - УЛУЧШЕННАЯ ВЕРСИЯ
import React from 'react';
import {
  List, Datagrid, TextField, DateField, EmailField,
  Edit, SimpleForm, TextInput, SelectInput, ReferenceInput, AutocompleteInput,
  Show, SimpleShowLayout, Filter, SearchInput, useRecordContext,
  FunctionField, ChipField
} from 'react-admin';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Paper,
  Divider
} from '@mui/material';

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

// Красивый компонент для отображения статуса
const StatusField = ({ record }) => {
  const getStatusColor = (status) => {
    const colors = {
      'new': '#1976d2',
      'contacted': '#ed6c02',
      'in_progress': '#2e7d32',
      'completed': '#388e3c',
      'rejected': '#d32f2f'
    };
    return colors[status] || '#757575';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'new': 'New',
      'contacted': 'Contacted',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'rejected': 'Rejected'
    };
    return labels[status] || status;
  };

  return (
    <Chip
      label={getStatusLabel(record?.status)}
      size="small"
      sx={{
        backgroundColor: getStatusColor(record?.status) + '20',
        color: getStatusColor(record?.status),
        fontWeight: 500,
        border: `1px solid ${getStatusColor(record?.status)}40`
      }}
    />
  );
};

// Красивый компонент для отображения приоритета
const PriorityField = ({ record }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      'low': '#4caf50',
      'medium': '#ff9800',
      'high': '#f44336'
    };
    return colors[priority] || '#757575';
  };

  return (
    <Chip
      label={record?.priority?.toUpperCase()}
      size="small"
      variant="outlined"
      sx={{
        borderColor: getPriorityColor(record?.priority),
        color: getPriorityColor(record?.priority),
        fontWeight: 600
      }}
    />
  );
};

// Красивый компонент для отображения типа проекта
const ProjectTypeField = ({ record }) => {
  const getTypeIcon = (type) => {
    const icons = {
      'web': '🌐',
      'mobile': '📱',
      'consultation': '💬',
      'maintenance': '🔧',
      'ecommerce': '🛒',
      'saas': '☁️',
      'other': '📋'
    };
    return icons[type] || '📋';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <span>{getTypeIcon(record?.project_type)}</span>
      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
        {record?.project_type?.replace('_', ' ')}
      </Typography>
    </Box>
  );
};

// Компонент для красивого отображения бюджета
const BudgetField = ({ record }) => {
  const getBudgetDisplay = (range) => {
    const ranges = {
      '1k-5k': '$1K - $5K',
      '5k-10k': '$5K - $10K',
      '10k-25k': '$10K - $25K',
      '25k-50k': '$25K - $50K',
      '50k+': '$50K+',
      'discuss': 'Let\'s discuss'
    };
    return ranges[range] || range || 'Not specified';
  };

  return (
    <Typography variant="body2" sx={{
      fontWeight: 500,
      color: record?.budget_range ? '#1976d2' : '#757575'
    }}>
      {getBudgetDisplay(record?.budget_range)}
    </Typography>
  );
};

export const ServiceRequestList = (props) => (
  <List {...props} filters={<ServiceRequestFilter />} perPage={25} sort={{ field: 'created_at', order: 'DESC' }}>
    <Datagrid rowClick="show" sx={{
      '& .RaDatagrid-headerCell': {
        fontWeight: 600,
        backgroundColor: '#f5f5f5'
      }
    }}>
      <TextField source="id" label="ID" />
      <TextField source="client_name" label="Client" />
      <EmailField source="client_email" label="Email" />
      <ProjectTypeField label="Project Type" />
      <BudgetField label="Budget" />
      <StatusField label="Status" />
      <PriorityField label="Priority" />
      <DateField source="created_at" label="Created" showTime />
    </Datagrid>
  </List>
);

export const ServiceRequestEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
        📋 Request Details (Read Only)
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextInput source="client_name" disabled fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="client_email" type="email" disabled fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="client_phone" disabled fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="company_name" disabled fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="project_type" disabled fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="budget_range" disabled fullWidth />
        </Grid>
      </Grid>

      <TextInput source="timeline" disabled fullWidth sx={{ mb: 2 }} />
      <TextInput source="description" multiline rows={4} disabled fullWidth sx={{ mb: 3 }} />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
        ⚙️ Management (Editable)
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <SelectInput source="status" choices={[
            { id: 'new', name: '🆕 New' },
            { id: 'contacted', name: '📞 Contacted' },
            { id: 'in_progress', name: '⚡ In Progress' },
            { id: 'completed', name: '✅ Completed' },
            { id: 'rejected', name: '❌ Rejected' }
          ]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectInput source="priority" choices={[
            { id: 'low', name: '🔵 Low' },
            { id: 'medium', name: '🟡 Medium' },
            { id: 'high', name: '🔴 High' }
          ]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ReferenceInput source="developer_id" reference="developers" allowEmpty>
            <AutocompleteInput optionText="name" label="👨‍💻 Assign to Developer" />
          </ReferenceInput>
        </Grid>
      </Grid>

      <TextInput source="notes" multiline rows={3} fullWidth sx={{ mt: 2 }}
        helperText="💡 Add internal notes about this request" />
    </SimpleForm>
  </Edit>
);

// Красивый компонент для детального просмотра
const ServiceRequestShowLayout = () => {
  const record = useRecordContext();

  if (!record) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Client Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              👤 Client Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Name</Typography>
                <Typography variant="body1" fontWeight={500}>{record.client_name}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography variant="body1" color="primary">{record.client_email}</Typography>
              </Box>
              {record.client_phone && (
                <Box>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{record.client_phone}</Typography>
                </Box>
              )}
              {record.company_name && (
                <Box>
                  <Typography variant="body2" color="text.secondary">Company</Typography>
                  <Typography variant="body1">{record.company_name}</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Project Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              📋 Project Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Type</Typography>
                <ProjectTypeField record={record} />
              </Box>
              {record.budget_range && (
                <Box>
                  <Typography variant="body2" color="text.secondary">Budget</Typography>
                  <BudgetField record={record} />
                </Box>
              )}
              {record.timeline && (
                <Box>
                  <Typography variant="body2" color="text.secondary">Timeline</Typography>
                  <Typography variant="body1">{record.timeline}</Typography>
                </Box>
              )}
              <Box>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <StatusField record={record} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Priority</Typography>
                <PriorityField record={record} />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              📝 Project Description
            </Typography>
            <Typography variant="body1" sx={{
              lineHeight: 1.6,
              backgroundColor: '#f8f9fa',
              p: 2,
              borderRadius: 1,
              border: '1px solid #e9ecef'
            }}>
              {record.description}
            </Typography>
          </Paper>
        </Grid>

        {/* Management Info */}
        {(record.notes || record.developer_id) && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                ⚙️ Management
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {record.developer_id && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">Assigned Developer</Typography>
                    <Typography variant="body1">Developer ID: {record.developer_id}</Typography>
                  </Box>
                )}
                {record.notes && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">Internal Notes</Typography>
                    <Typography variant="body1" sx={{
                      backgroundColor: '#fff3cd',
                      p: 2,
                      borderRadius: 1,
                      border: '1px solid #ffeaa7'
                    }}>
                      {record.notes}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Timestamps */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              ⏰ Timeline
            </Typography>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Created</Typography>
                <Typography variant="body1">{new Date(record.created_at).toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                <Typography variant="body1">{new Date(record.updated_at).toLocaleString()}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export const ServiceRequestShow = (props) => (
  <Show {...props} component="div">
    <ServiceRequestShowLayout />
  </Show>
);