"use client";

import { useLanguage } from "../../hooks/useLanguage";

export default function AboutContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t("about.hero.title")}
          </h1>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            {t("about.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t("about.story.title")}
            </h2>
          </div>

          <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed space-y-6">
            <p className="text-xl text-center mb-8 text-gray-600">
              {t("about.story.introduction")}
            </p>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <p className="mb-6">{t("about.story.paragraph1")}</p>
              <p className="mb-6">{t("about.story.paragraph2")}</p>
              <p>{t("about.story.paragraph3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t("about.mission.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Students */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {t("about.mission.forStudents.title")}
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("about.mission.forStudents.description")}
              </p>
            </div>

            {/* For Families */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {t("about.mission.forFamilies.title")}
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("about.mission.forFamilies.description")}
              </p>
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
            {t("about.cta.title")}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("about.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/companions"
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-purple-700 hover:shadow-lg inline-block text-center"
            >
              {t("about.cta.browseCompanions")}
            </a>
            <a
              href="#contact"
              className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold transition-all hover:bg-purple-50"
            >
              {t("about.cta.contactUs")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
