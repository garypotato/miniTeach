"use client";

import { useLanguage } from "../../hooks/useLanguage";
import Image from "next/image";

export default function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left side - Actual SVG illustration */}
          <div className="order-2 lg:order-1 flex items-center">
            <div className="relative w-full">
              {/* Main illustration container with actual SVG */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/features-illustration.svg"
                  alt={t("features.imageAlt")}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Additional floating elements for extra visual appeal */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-200 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-200 rounded-full opacity-70 animate-pulse delay-1000"></div>
              <div className="absolute top-1/4 -right-3 w-5 h-5 bg-yellow-200 rounded-full opacity-60 animate-pulse delay-500"></div>
            </div>
          </div>

          {/* Right side - Detailed content based on platform.md */}
          <div className="order-1 lg:order-2 flex flex-col justify-center">
            <div className="mb-6">
              <h2
                className="text-2xl lg:text-3xl font-bold mb-3 leading-tight"
                style={{ color: "#8FA89E" }}
              >
                {t("features.title")}
              </h2>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                {t("features.subtitle")}
              </p>
            </div>

            <div className="space-y-4">
              {/* Feature 1 - Education Students Only */}
              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className="text-base lg:text-lg font-semibold mb-1"
                    style={{ color: "#47709B" }}
                  >
                    {t("features.educationStudents.title")}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                    {t("features.educationStudents.description")}
                  </p>
                </div>
              </div>

              {/* Feature 2 - High Quality Great Value */}
              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className="text-base lg:text-lg font-semibold mb-1"
                    style={{ color: "#47709B" }}
                  >
                    {t("features.qualityValue.title")}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                    {t("features.qualityValue.description")}
                  </p>
                </div>
              </div>

              {/* Feature 3 - Legal Visas & Safe Backgrounds */}
              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className="text-base lg:text-lg font-semibold mb-1"
                    style={{ color: "#47709B" }}
                  >
                    {t("features.legalSafe.title")}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                    {t("features.legalSafe.description")}
                  </p>
                </div>
              </div>

              {/* Feature 4 - Flexible & Commitment-Free */}
              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className="text-base lg:text-lg font-semibold mb-1"
                    style={{ color: "#47709B" }}
                  >
                    {t("features.flexible.title")}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                    {t("features.flexible.description")}
                  </p>
                </div>
              </div>

              {/* Feature 5 - Bilingual Support */}
              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className="text-base lg:text-lg font-semibold mb-1"
                    style={{ color: "#47709B" }}
                  >
                    {t("features.bilingual.title")}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                    {t("features.bilingual.description")}
                  </p>
                </div>
              </div>

              {/* Feature 6 - Interactive Learning */}
              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className="text-base lg:text-lg font-semibold mb-1"
                    style={{ color: "#47709B" }}
                  >
                    {t("features.interactiveLearning.title")}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                    {t("features.interactiveLearning.description")}
                  </p>
                </div>
              </div>
            </div>

            {/* Call to action with platform note */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <svg
                        className="w-6 h-6"
                        style={{ color: "#47709B" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {t("features.cta.title")}
                    </h4>
                    <p className="text-gray-600 text-xs leading-relaxed mb-2">
                      {t("features.cta.description")}
                    </p>
                    <div className="bg-white rounded-lg px-3 py-1 inline-block shadow-sm">
                      <p
                        className="text-xs font-semibold"
                        style={{ color: "#47709B" }}
                      >
                        💝 {t("features.cta.note")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
