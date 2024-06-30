import { createSlice } from '@reduxjs/toolkit';

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    pending: [],
    inProgress: [],
    completed: []
  },
  reducers: {
    addTask: (state, action) => {
      state.pending.push(action.payload);
    },
    updateTaskStatus: (state, action) => {
      const { id, newStatus } = action.payload;
      const task = state.pending.find(task => task.id === id) || state.inProgress.find(task => task.id === id);
      if (task) {
        state[newStatus].push(task);
        state[task.status].splice(state[task.status].indexOf(task), 1);
        task.status = newStatus;
      }
    }
  }
});

export const { addTask, updateTaskStatus } = tasksSlice.actions;
export default tasksSlice.reducer;