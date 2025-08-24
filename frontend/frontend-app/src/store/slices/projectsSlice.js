// frontend/frontend-app/src/store/slices/projectsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as projectsApi from '../../api/projectsApi';

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params = {}) => {
    const response = await projectsApi.getProjects(params);
    return response.data;
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId) => {
    const response = await projectsApi.getProjectById(projectId);
    return response.data;
  }
);

export const fetchProjectCategories = createAsyncThunk(
  'projects/fetchProjectCategories',
  async () => {
    const response = await projectsApi.getProjectCategories();
    return response.data;
  }
);

export const fetchRelatedProjects = createAsyncThunk(
  'projects/fetchRelatedProjects',
  async ({ category, excludeId, limit = 6 }) => {
    const response = await projectsApi.getRelatedProjects(category, excludeId, limit);
    return response.data;
  }
);

export const fetchStats = createAsyncThunk(
  'projects/fetchStats',
  async () => {
    const response = await projectsApi.getStats();
    return response.data;
  }
);

const initialState = {
  list: [],
  currentProject: null,
  relatedProjects: [],
  categories: [],
  stats: null,
  loading: false,
  error: null,
  filters: {
    category: 'all',
    search: '',
  }
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.relatedProjects = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch categories
      .addCase(fetchProjectCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories || [];
      })
      // Fetch related projects
      .addCase(fetchRelatedProjects.fulfilled, (state, action) => {
        state.relatedProjects = action.payload;
      })
      // Fetch stats
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        // Fallback stats if API fails
        state.stats = {
          developers: 3,
          projects: 15,
          completed_projects: 12,
          years_experience: 3
        };
      });
  }
});

export const { setFilters, clearCurrentProject, clearError } = projectsSlice.actions;

// Selectors
export const selectProjects = (state) => state.projects.list;
export const selectCurrentProject = (state) => state.projects.currentProject;
export const selectRelatedProjects = (state) => state.projects.relatedProjects;
export const selectProjectCategories = (state) => state.projects.categories;
export const selectProjectsLoading = (state) => state.projects.loading;
export const selectProjectsError = (state) => state.projects.error;
export const selectProjectsStats = (state) => state.projects.stats;
export const selectProjectsFilters = (state) => state.projects.filters;

export default projectsSlice.reducer;