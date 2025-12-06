"use client";

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { toggleLanguage } from '@/app/store/languageSlice';

export default function LanguageToggle() {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.language.currentLanguage);

  const handleToggle = () => {
    dispatch(toggleLanguage());
    // Persist to localStorage
    const newLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
    if (typeof window !== 'undefined') {
      localStorage.setItem('miniteach-language', newLanguage);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm font-medium text-gray-700"
      aria-label={`Switch to ${currentLanguage === 'zh' ? 'English' : 'Chinese'}`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      <span>{currentLanguage === 'zh' ? 'EN' : '中文'}</span>
    </button>
  );
}
