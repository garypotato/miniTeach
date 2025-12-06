"use client";

import { useAppSelector } from '@/app/store/hooks';
import { translations } from './translations';
import type { Language } from '@/app/store/languageSlice';

type TranslationValue = { zh: string; en: string };

export function useTranslation() {
  const currentLanguage = useAppSelector((state) => state.language.currentLanguage);

  // Helper function to get a translation value
  const t = <T extends TranslationValue>(value: T): string => {
    return value[currentLanguage];
  };

  // Get translation by path (e.g., 'nav.home')
  const getTranslation = (path: string): string => {
    const keys = path.split('.');
    let result: unknown = translations;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = (result as Record<string, unknown>)[key];
      } else {
        return path; // Return path if not found
      }
    }

    if (result && typeof result === 'object' && 'zh' in result && 'en' in result) {
      return (result as TranslationValue)[currentLanguage];
    }

    return path;
  };

  return {
    t,
    getTranslation,
    currentLanguage,
    translations,
  };
}

// Export a simple helper for server components that need static translations
export function getStaticTranslation(value: TranslationValue, language: Language): string {
  return value[language];
}
