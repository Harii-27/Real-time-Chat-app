import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './Slice';

export const store = configureStore({
  reducer: {
    message: messageReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppActions = typeof store.dispatch;