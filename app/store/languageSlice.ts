import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { TranslationsType } from "../types/translations";

export type Language = "en" | "zh";

interface LanguageState {
  language: Language;
  translations: TranslationsType | Record<string, never>;
}

const initialState: LanguageState = {
  language: "zh",
  translations: {},
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("language", action.payload);
      }
    },
    setTranslations: (state, action: PayloadAction<TranslationsType>) => {
      state.translations = action.payload;
    },
    initializeLanguage: (state) => {
      // Initialize from localStorage
      if (typeof window !== "undefined") {
        const savedLanguage = localStorage.getItem("language") as Language;
        if (
          savedLanguage &&
          (savedLanguage === "en" || savedLanguage === "zh")
        ) {
          state.language = savedLanguage;
        }
      }
    },
  },
});

export const { setLanguage, setTranslations, initializeLanguage } =
  languageSlice.actions;
export default languageSlice.reducer;
