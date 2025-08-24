// frontend/frontend-app/src/store/slices/developersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as developersApi from '../../api/developersApi';

// Async thunks
export const fetchDevelopers = createAsyncThunk(
  'developers/fetchDevelopers',
  async (params = {}) => {
    const response = await developersApi.getDevelopers(params);
    return response.data;
  }
);

export const fetchDeveloperBySlug = createAsyncThunk(
  'developers/fetchDeveloperBySlug',
  async (slug) => {
    const response = await developersApi.getDeveloperBySlug(slug);
    return response.data;
  }
);

export const fetchDeveloperProjects = createAsyncThunk(
  'developers/fetchDeveloperProjects',
  async (developerId) => {
    const response = await developersApi.getDeveloperProjects(developerId);
    return response.data;
  }
);

const initialState = {
  list: [],
  currentDeveloper: null,
  currentDeveloperProjects: [],
  loading: false,
  error: null,
  stats: {
    total: 0,
    active: 0,
  }
};

const developersSlice = createSlice({
  name: 'developers',
  initialState,
  reducers: {
    clearCurrentDeveloper: (state) => {
      state.currentDeveloper = null;
      state.currentDeveloperProjects = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch developers
      .addCase(fetchDevelopers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevelopers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.stats.total = action.payload.length;
        state.stats.active = action.payload.filter(dev => dev.is_active).length;
      })
      .addCase(fetchDevelopers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch developer by slug
      .addCase(fetchDeveloperBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeveloperBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDeveloper = action.payload;
      })
      .addCase(fetchDeveloperBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch developer projects
      .addCase(fetchDeveloperProjects.fulfilled, (state, action) => {
        state.currentDeveloperProjects = action.payload;
      });
  }
});

export const { clearCurrentDeveloper, clearError } = developersSlice.actions;

// Selectors
export const selectDevelopers = (state) => state.developers.list;
export const selectCurrentDeveloper = (state) => state.developers.currentDeveloper;
export const selectCurrentDeveloperProjects = (state) => state.developers.currentDeveloperProjects;
export const selectDevelopersLoading = (state) => state.developers.loading;
export const selectDevelopersError = (state) => state.developers.error;
export const selectDevelopersStats = (state) => state.developers.stats;

export default developersSlice.reducer;