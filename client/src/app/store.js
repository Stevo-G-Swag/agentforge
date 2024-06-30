import { configureStore } from '@reduxjs/toolkit';
import projectRequirementsReducer from '../features/projectRequirementsSlice';

export const store = configureStore({
  reducer: {
    projectRequirements: projectRequirementsReducer,
  },
});