'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './redux'
import { setLanguage, setTranslations, initializeLanguage, Language } from '../store/languageSlice'

export const useLanguage = () => {
  const dispatch = useAppDispatch()
  const { language, translations } = useAppSelector((state) => state.language)

  useEffect(() => {
    // Initialize language from localStorage on first load
    dispatch(initializeLanguage())
  }, [dispatch])

  useEffect(() => {
    // Load translations when language changes
    const loadTranslations = async () => {
      try {
        const translationsModule = await import(`../translations/${language}`)
        dispatch(setTranslations(translationsModule.default))
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error)
      }
    }

    loadTranslations()
  }, [language, dispatch])

  const changeLanguage = (lang: Language) => {
    dispatch(setLanguage(lang))
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: unknown = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  return {
    language,
    setLanguage: changeLanguage,
    t
  }
}