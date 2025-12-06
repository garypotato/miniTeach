"use client";

import { useTranslation } from "@/app/i18n";

export default function CreatePageHeader() {
  const { t, translations } = useTranslation();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t(translations.companionCreatePage.createProfile)}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {t(translations.companionCreatePage.joinCommunity)}
          </p>
          <p className="text-gray-500">
            {t(translations.companionCreatePage.formDesc)}
          </p>
        </div>
      </div>
    </div>
  );
}
