import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'zh' | 'en';

export interface LanguageState {
  currentLanguage: Language;
}

// Try to get saved language from localStorage (will be done in provider)
const initialState: LanguageState = {
  currentLanguage: 'en', // Default to English
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload;
    },
    toggleLanguage: (state) => {
      state.currentLanguage = state.currentLanguage === 'zh' ? 'en' : 'zh';
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;

export default languageSlice.reducer;
