import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./languageSlice";
import modalReducer from "./modalSlice";

export const store = configureStore({
  reducer: {
    language: languageReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
