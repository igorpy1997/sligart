// frontend/frontend-app/src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices
import developersSlice from './slices/developersSlice';
import projectsSlice from './slices/projectsSlice';
import uiSlice from './slices/uiSlice';
import contactSlice from './slices/contactSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['ui'] // Only persist UI state
};

const rootReducer = {
  developers: developersSlice,
  projects: projectsSlice,
  ui: persistReducer(persistConfig, uiSlice),
  contact: contactSlice,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

