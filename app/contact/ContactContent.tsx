"use client";

import Image from "next/image";
import { useTranslation } from "@/app/i18n";

export default function ContactContent() {
  const { t, translations } = useTranslation();

  const cities = [
    { key: 'sydney', label: t(translations.contact.cities.sydney) },
    { key: 'melbourne', label: t(translations.contact.cities.melbourne) },
    { key: 'brisbane', label: t(translations.contact.cities.brisbane) },
    { key: 'goldCoast', label: t(translations.contact.cities.goldCoast) },
    { key: 'adelaide', label: t(translations.contact.cities.adelaide) },
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t(translations.contact.pageTitle)}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t(translations.contact.pageSubtitle)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* WeChat Contact Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 order-2 lg:order-1">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t(translations.contact.wechatTitle)}
              </h2>

              <p className="text-gray-600 mb-8">
                {t(translations.contact.wechatSubtitle)}
              </p>

              {/* WeChat QR Code */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-gray-100">
                  <Image
                    src="/weChat_code.jpg"
                    alt={t(translations.contact.wechatAlt)}
                    width={280}
                    height={280}
                    className="rounded-lg"
                    priority
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500">
                {t(translations.contact.wechatNote)}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {t(translations.contact.serviceTitle)}
              </h2>

              <div className="space-y-8">
                {/* Privacy Protection */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3">{t(translations.contact.privacyTitle)}</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {t(translations.contact.privacyDesc)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verification */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3">{t(translations.contact.verificationTitle)}</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {t(translations.contact.verificationDesc)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Process */}
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3">{t(translations.contact.consultationTitle)}</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {t(translations.contact.consultationDesc)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Areas */}
                <div className="border-t pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t(translations.contact.serviceAreaTitle)}</h3>
                      <p className="text-gray-600 mb-2">{t(translations.contact.serviceAreaSubtitle)}</p>
                      <div className="flex flex-wrap gap-2">
                        {cities.map((city) => (
                          <span key={city.key} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            {city.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Help */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">{t(translations.contact.needHelp)}</h3>
              <div className="space-y-3 text-sm">
                <p>✨ <strong>{t(translations.contact.helpParents)}</strong> {t(translations.contact.helpParentsDesc)}</p>
                <p>🌟 <strong>{t(translations.contact.helpCompanions)}</strong> {t(translations.contact.helpCompanionsDesc)}</p>
                <p>🎯 <strong>{t(translations.contact.helpPartners)}</strong> {t(translations.contact.helpPartnersDesc)}</p>
                <p>❓ <strong>{t(translations.contact.helpOther)}</strong> {t(translations.contact.helpOtherDesc)}</p>
              </div>
              <p className="mt-6 text-blue-100">
                {t(translations.contact.helpFooter)}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 lg:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {t(translations.contact.faqTitle)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t(translations.contact.faqQ1)}
              </h3>
              <p className="text-gray-600 text-sm">
                {t(translations.contact.faqA1)}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t(translations.contact.faqQ2)}
              </h3>
              <p className="text-gray-600 text-sm">
                {t(translations.contact.faqA2)}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t(translations.contact.faqQ3)}
              </h3>
              <p className="text-gray-600 text-sm">
                {t(translations.contact.faqA3)}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t(translations.contact.faqQ4)}
              </h3>
              <p className="text-gray-600 text-sm">
                {t(translations.contact.faqA4)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
