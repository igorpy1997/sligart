// frontend/frontend-app/src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  headerScrolled: false,
  drawerOpen: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setHeaderScrolled: (state, action) => {
      state.headerScrolled = action.payload;
    },
    openDrawer: (state) => {
      state.drawerOpen = true;
    },
    closeDrawer: (state) => {
      state.drawerOpen = false;
    },
    toggleDrawer: (state) => {
      state.drawerOpen = !state.drawerOpen;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const {
  setTheme,
  setHeaderScrolled,
  openDrawer,
  closeDrawer,
  toggleDrawer,
  addNotification,
  removeNotification,
  clearNotifications
} = uiSlice.actions;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectHeaderScrolled = (state) => state.ui.headerScrolled;
export const selectDrawerOpen = (state) => state.ui.drawerOpen;
export const selectNotifications = (state) => state.ui.notifications;

export default uiSlice.reducer;