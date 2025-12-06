"use client";

import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from './store';
import { setLanguage, Language } from './languageSlice';

function LanguageInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize language from localStorage on mount
    const savedLanguage = localStorage.getItem('miniteach-language') as Language | null;
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      store.dispatch(setLanguage(savedLanguage));
    }
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LanguageInitializer>{children}</LanguageInitializer>
    </Provider>
  );
}