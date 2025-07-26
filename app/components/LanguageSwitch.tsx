'use client'

import { useLanguage } from '../hooks/useLanguage'

export default function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="relative">
      <button
        onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
        title={t('language.switch')}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span>{language === 'en' ? t('language.chinese') : t('language.english')}</span>
      </button>
    </div>
  )
}