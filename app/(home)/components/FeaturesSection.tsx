"use client";

import { useLanguage } from "../../hooks/useLanguage";

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      title: t("features.educationStudents.title"),
      description: t("features.educationStudents.description"),
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      title: t("features.qualityValue.title"),
      description: t("features.qualityValue.description"),
      color: "from-green-500 to-teal-600",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: t("features.legalSafe.title"),
      description: t("features.legalSafe.description"),
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: t("features.flexible.title"),
      description: t("features.flexible.description"),
      color: "from-orange-500 to-red-600",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      title: t("features.bilingual.title"),
      description: t("features.bilingual.description"),
      color: "from-indigo-500 to-blue-600",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
      title: t("features.interactiveLearning.title"),
      description: t("features.interactiveLearning.description"),
      color: "from-teal-500 to-green-600",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Features Grid - Modern Layout */}
        <div className="mb-16">
          {/* Hero Feature Card */}
          <div className="mb-12">
            <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 overflow-hidden">
              {/* Decorative pattern background */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #8B5CF6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #3B82F6 0%, transparent 50%)`,
                    backgroundSize: "60px 60px",
                  }}
                ></div>
              </div>

              <div className="relative z-10 text-center">
                {/* Badge style header */}
                <div className="inline-flex items-center justify-center mb-8">
                  <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-50 rounded-full px-6 py-3 border border-gray-200 shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-md">
                      <div className="text-white text-sm font-bold">MT</div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-700">
                        Mini-Teach Platform
                      </div>
                      <div className="text-xs text-gray-500">
                        Features & Benefits
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {t("features.title")}
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                  {t("features.subtitle")}
                </p>

                {/* Feature highlights */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                  <div className="flex items-center bg-purple-50 rounded-full px-4 py-2 border border-purple-100">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-purple-700">
                      Verified Companions
                    </span>
                  </div>
                  <div className="flex items-center bg-blue-50 rounded-full px-4 py-2 border border-blue-100">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-blue-700">
                      Safe & Secure
                    </span>
                  </div>
                  <div className="flex items-center bg-teal-50 rounded-full px-4 py-2 border border-teal-100">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-teal-700">
                      24/7 Support
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-8 right-8 w-4 h-4 bg-purple-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute bottom-8 left-8 w-3 h-3 bg-blue-200 rounded-full opacity-50 animate-bounce"></div>
              <div className="absolute top-1/2 right-6 w-2 h-2 bg-teal-200 rounded-full opacity-40 animate-ping"></div>
            </div>
          </div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 xl:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 xl:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Floating particles */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-300 rounded-full opacity-0 group-hover:opacity-60 animate-ping transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-300 rounded-full opacity-0 group-hover:opacity-40 animate-pulse transition-opacity duration-700"></div>

                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 xl:w-16 xl:h-16 rounded-xl md:rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4 md:mb-5 xl:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
                  >
                    <div className="w-5 h-5 md:w-6 md:h-6">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3 xl:mb-4 group-hover:text-purple-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="mt-4 md:mt-5 xl:mt-6 flex items-center text-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-xs md:text-sm font-semibold mr-2">
                      Learn More
                    </span>
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
