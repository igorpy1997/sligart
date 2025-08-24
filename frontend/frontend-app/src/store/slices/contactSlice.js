// frontend/frontend-app/src/store/slices/contactSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as contactApi from '../../api/contactApi';

// Async thunks
export const submitContactForm = createAsyncThunk(
  'contact/submitContactForm',
  async (formData) => {
    const response = await contactApi.submitContactForm(formData);
    return response.data;
  }
);

const initialState = {
  isOpen: false,
  initialData: {},
  loading: false,
  submitted: false,
  error: null,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    openForm: (state, action) => {
      state.isOpen = true;
      state.initialData = action.payload || {};
      state.submitted = false;
      state.error = null;
    },
    closeForm: (state) => {
      state.isOpen = false;
      state.initialData = {};
      state.submitted = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.loading = false;
        state.submitted = true;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { openForm, closeForm, clearError } = contactSlice.actions;

// Selectors
export const selectContactFormState = (state) => state.contact;
export const selectIsContactFormOpen = (state) => state.contact.isOpen;
export const selectContactFormInitialData = (state) => state.contact.initialData;
export const selectContactFormLoading = (state) => state.contact.loading;
export const selectContactFormSubmitted = (state) => state.contact.submitted;
export const selectContactFormError = (state) => state.contact.error;

export default contactSlice.reducer;