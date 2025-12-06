import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';
import languageReducer from './languageSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;