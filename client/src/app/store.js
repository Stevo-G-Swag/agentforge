import { configureStore } from '@reduxjs/toolkit';
import projectRequirementsReducer from '../features/projectRequirementsSlice';
import tasksReducer from '../features/tasksSlice';

export const store = configureStore({
  reducer: {
    projectRequirements: projectRequirementsReducer,
    tasks: tasksReducer,
  },
});