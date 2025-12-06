"use client";

import Link from "next/link";
import { useTranslation } from "@/app/i18n";

export default function AboutContent() {
  const { t, translations } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <span className="text-5xl mr-4">🌱</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {t(translations.about.pageTitle)}
            </h1>
          </div>
          <p className="text-xl text-white opacity-90 mb-8 max-w-4xl mx-auto leading-relaxed">
            {t(translations.about.heroSubtitle)}
            <br />
            {t(translations.about.heroSubtitle2)}
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t(translations.about.storyP1)}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t(translations.about.storyP2)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <span className="mr-3">🎯</span>
              {t(translations.about.missionTitle)}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {t(translations.about.mission1)}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {t(translations.about.mission2)}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-4">🏠</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {t(translations.about.mission3)}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-4">🎓</div>
                <h3 className="text-xl font-bold text-gray-800">
                  {t(translations.about.forStudents)}
                </h3>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-xl font-bold text-gray-800">
                  {t(translations.about.forParents)}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <span className="mr-3">✅</span>
              {t(translations.about.qualificationsTitle)}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="font-semibold text-gray-800">
                {t(translations.about.qual1)}
              </h3>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl mb-4">🇦🇺</div>
              <h3 className="font-semibold text-gray-800">{t(translations.about.qual2)}</h3>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="font-semibold text-gray-800">
                {t(translations.about.qual3)}
              </h3>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="font-semibold text-gray-800">
                {t(translations.about.qual4)}
              </h3>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl mb-4">🗣️</div>
              <h3 className="font-semibold text-gray-800">
                {t(translations.about.qual5)}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* What We Don't Do Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <span className="mr-3">👀</span>
              {t(translations.about.notTitle)}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 rounded-xl p-6 text-center border border-red-100">
              <div className="text-3xl mb-4">❌</div>
              <h3 className="font-semibold text-gray-800">{t(translations.about.not1)}</h3>
            </div>
            <div className="bg-red-50 rounded-xl p-6 text-center border border-red-100">
              <div className="text-3xl mb-4">❌</div>
              <h3 className="font-semibold text-gray-800">{t(translations.about.not2)}</h3>
            </div>
            <div className="bg-red-50 rounded-xl p-6 text-center border border-red-100">
              <div className="text-3xl mb-4">❌</div>
              <h3 className="font-semibold text-gray-800">
                {t(translations.about.not3)}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(135deg, #e6f3ff 0%, #f0f9ff 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            {t(translations.about.ctaTitle)}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t(translations.about.ctaSubtitle)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/companions"
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-purple-700 hover:shadow-lg inline-block text-center"
            >
              {t(translations.about.viewCompanions)}
            </Link>
            <Link
              href="/companion/create"
              className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold transition-all hover:bg-purple-50"
            >
              {t(translations.about.becomeCompanion)}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
