import { createSlice } from '@reduxjs/toolkit';

export const projectRequirementsSlice = createSlice({
  name: 'projectRequirements',
  initialState: {
    requirements: []
  },
  reducers: {
    addRequirement: (state, action) => {
      state.requirements.push(action.payload);
    },
    updateRequirement: (state, action) => {
      const index = state.requirements.findIndex(req => req.id === action.payload.id);
      if (index !== -1) {
        state.requirements[index] = action.payload;
      }
    },
    removeRequirement: (state, action) => {
      state.requirements = state.requirements.filter(req => req.id !== action.payload.id);
    }
  }
});

export const { addRequirement, updateRequirement, removeRequirement } = projectRequirementsSlice.actions;

export default projectRequirementsSlice.reducer;