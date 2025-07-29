"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import CompanionsSection from "./CompanionsSection";
import { useLanguage } from "../hooks/useLanguage";

interface Companion {
  id: number;
  title: string;
  body_html: string;
  handle: string;
  image?: {
    src: string;
    alt: string | null;
  };
}

interface HomePageProps {
  initialCompanions: Companion[];
}

export default function HomePage({ initialCompanions }: HomePageProps) {
  const { t } = useLanguage();
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const updateLineHeights = () => {
      stepRefs.current.forEach((stepElement, index) => {
        if (stepElement && index < 4) {
          // Only for steps 1-4 (they have lines)
          const contentElement = stepElement.querySelector(
            ".step-content"
          ) as HTMLElement;
          const lineElement = stepElement.querySelector(
            ".connection-line"
          ) as HTMLElement;

          if (contentElement && lineElement) {
            const contentHeight = contentElement.offsetHeight;
            const circleHeight = 48; // 12 * 4 = 48px (w-12 h-12)
            const minLineHeight = 16; // Minimum line height
            const calculatedHeight = Math.max(
              minLineHeight,
              contentHeight - circleHeight + 16
            );

            lineElement.style.height = `${calculatedHeight}px`;
          }
        }
      });
    };

    // Update on mount and window resize
    updateLineHeights();
    window.addEventListener("resize", updateLineHeights);

    // Cleanup
    return () => window.removeEventListener("resize", updateLineHeights);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
      }}
    >
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t("hero.title")}
            <span className="block" style={{ color: "#47709B" }}>
              {t("hero.subtitle")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t("hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/companions"
              className="text-white px-8 py-3 rounded-full font-semibold transition-colors hover:opacity-90 inline-block text-center"
              style={{ backgroundColor: "#47709B" }}
            >
              {t("hero.browseCompanions")}
            </Link>
            <button
              className="border-2 px-8 py-3 rounded-full font-semibold transition-colors hover:bg-gray-50"
              style={{ borderColor: "#47709B", color: "#47709B" }}
            >
              {t("hero.learnMore")}
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("howItWorks.title")}
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("howItWorks.subtitle")}
            </p>
          </div>

          <div className="relative">
            {/* Large Desktop Layout - Horizontal Flow (1280px+) */}
            <div className="hidden xl:block">
              <div className="flex items-start justify-between relative">
                {/* Connection Lines */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 -translate-y-1/2 z-0"></div>

                {/* Step 1 */}
                <div className="relative bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100 w-52 h-80 z-10">
                  <div className="text-center h-full flex flex-col">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-2xl font-bold"
                        style={{ color: "#47709B" }}
                      >
                        1
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("howItWorks.steps.registration.title")}
                    </h4>
                    <p className="text-sm text-gray-600 flex-1">
                      {t("howItWorks.steps.registration.description")}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100 w-52 h-80 z-10">
                  <div className="text-center h-full flex flex-col">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-2xl font-bold"
                        style={{ color: "#47709B" }}
                      >
                        2
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("howItWorks.steps.verification.title")}
                    </h4>
                    <p className="text-sm text-gray-600 flex-1">
                      {t("howItWorks.steps.verification.description")}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100 w-52 h-80 z-10">
                  <div className="text-center h-full flex flex-col">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-2xl font-bold"
                        style={{ color: "#47709B" }}
                      >
                        3
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("howItWorks.steps.browsing.title")}
                    </h4>
                    <p className="text-sm text-gray-600 flex-1">
                      {t("howItWorks.steps.browsing.description")}
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100 w-52 h-80 z-10">
                  <div className="text-center h-full flex flex-col">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-2xl font-bold"
                        style={{ color: "#47709B" }}
                      >
                        4
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("howItWorks.steps.contact.title")}
                    </h4>
                    <p className="text-sm text-gray-600 flex-1">
                      {t("howItWorks.steps.contact.description")}
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100 w-52 h-80 z-10">
                  <div className="text-center h-full flex flex-col">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-2xl font-bold"
                        style={{ color: "#47709B" }}
                      >
                        5
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("howItWorks.steps.connection.title")}
                    </h4>
                    <p className="text-sm text-gray-600 flex-1">
                      {t("howItWorks.steps.connection.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medium Desktop Layout - 2x3 Grid (1024px - 1279px) */}
            <div className="hidden lg:block xl:hidden">
              <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
                {/* Row 1 - Steps 1 & 2 */}
                <div className="relative bg-white p-4 rounded-lg shadow-md border border-blue-100 h-44">
                  <div className="text-center h-full flex flex-col">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-xl font-bold"
                        style={{ color: "#47709B" }}
                      >
                        1
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-gray-900 mb-2">
                      {t("howItWorks.steps.registration.title")}
                    </h4>
                    <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                      {t("howItWorks.steps.registration.description")}
                    </p>
                  </div>
                </div>

                <div className="relative bg-white p-4 rounded-lg shadow-md border border-blue-100 h-44">
                  <div className="text-center h-full flex flex-col">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-xl font-bold"
                        style={{ color: "#47709B" }}
                      >
                        2
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-gray-900 mb-2">
                      {t("howItWorks.steps.verification.title")}
                    </h4>
                    <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                      {t("howItWorks.steps.verification.description")}
                    </p>
                  </div>
                </div>

                {/* Row 2 - Steps 3 & 4 */}
                <div className="relative bg-white p-4 rounded-lg shadow-md border border-blue-100 h-44">
                  <div className="text-center h-full flex flex-col">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-xl font-bold"
                        style={{ color: "#47709B" }}
                      >
                        3
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-gray-900 mb-2">
                      {t("howItWorks.steps.browsing.title")}
                    </h4>
                    <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                      {t("howItWorks.steps.browsing.description")}
                    </p>
                  </div>
                </div>

                <div className="relative bg-white p-4 rounded-lg shadow-md border border-blue-100 h-44">
                  <div className="text-center h-full flex flex-col">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-xl font-bold"
                        style={{ color: "#47709B" }}
                      >
                        4
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-gray-900 mb-2">
                      {t("howItWorks.steps.contact.title")}
                    </h4>
                    <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                      {t("howItWorks.steps.contact.description")}
                    </p>
                  </div>
                </div>

                {/* Row 3 - Step 5 centered */}
                <div className="col-span-2 flex justify-center">
                  <div className="relative bg-white p-4 rounded-lg shadow-md border border-blue-100 h-44 w-64">
                    <div className="text-center h-full flex flex-col">
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                        style={{ backgroundColor: "#AFC8DA" }}
                      >
                        <span
                          className="text-xl font-bold"
                          style={{ color: "#47709B" }}
                        >
                          5
                        </span>
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">
                        {t("howItWorks.steps.connection.title")}
                      </h4>
                      <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                        {t("howItWorks.steps.connection.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile & Tablet Layout - Vertical Flow */}
            <div className="lg:hidden">
              <div className="space-y-4">
                {/* Step 1 */}
                <div
                  ref={(el) => {
                    stepRefs.current[0] = el;
                  }}
                  className="relative"
                >
                  <div className="flex items-start step-content">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-lg font-bold"
                        style={{ color: "#47709B" }}
                      >
                        1
                      </span>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {t("howItWorks.steps.registration.title")}
                      </h4>
                      <p className="text-gray-600">
                        {t("howItWorks.steps.registration.description")}
                      </p>
                    </div>
                  </div>
                  {/* Dynamic connection line */}
                  <div
                    className="connection-line absolute left-6 top-12 w-0.5 bg-blue-300 transform -translate-x-0.5"
                    style={{ height: "40px" }}
                  ></div>
                </div>

                {/* Step 2 */}
                <div
                  ref={(el) => {
                    stepRefs.current[1] = el;
                  }}
                  className="relative"
                >
                  <div className="flex items-start step-content">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-lg font-bold"
                        style={{ color: "#47709B" }}
                      >
                        2
                      </span>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {t("howItWorks.steps.verification.title")}
                      </h4>
                      <p className="text-gray-600">
                        {t("howItWorks.steps.verification.description")}
                      </p>
                    </div>
                  </div>
                  {/* Dynamic connection line */}
                  <div
                    className="connection-line absolute left-6 top-12 w-0.5 bg-blue-300 transform -translate-x-0.5"
                    style={{ height: "40px" }}
                  ></div>
                </div>

                {/* Step 3 */}
                <div
                  ref={(el) => {
                    stepRefs.current[2] = el;
                  }}
                  className="relative"
                >
                  <div className="flex items-start step-content">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-lg font-bold"
                        style={{ color: "#47709B" }}
                      >
                        3
                      </span>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {t("howItWorks.steps.browsing.title")}
                      </h4>
                      <p className="text-gray-600">
                        {t("howItWorks.steps.browsing.description")}
                      </p>
                    </div>
                  </div>
                  {/* Dynamic connection line */}
                  <div
                    className="connection-line absolute left-6 top-12 w-0.5 bg-blue-300 transform -translate-x-0.5"
                    style={{ height: "40px" }}
                  ></div>
                </div>

                {/* Step 4 */}
                <div
                  ref={(el) => {
                    stepRefs.current[3] = el;
                  }}
                  className="relative"
                >
                  <div className="flex items-start step-content">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-lg font-bold"
                        style={{ color: "#47709B" }}
                      >
                        4
                      </span>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {t("howItWorks.steps.contact.title")}
                      </h4>
                      <p className="text-gray-600">
                        {t("howItWorks.steps.contact.description")}
                      </p>
                    </div>
                  </div>
                  {/* Dynamic connection line */}
                  <div
                    className="connection-line absolute left-6 top-12 w-0.5 bg-blue-300 transform -translate-x-0.5"
                    style={{ height: "40px" }}
                  ></div>
                </div>

                {/* Step 5 */}
                <div
                  ref={(el) => {
                    stepRefs.current[4] = el;
                  }}
                  className="relative"
                >
                  <div className="flex items-start step-content">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-lg font-bold"
                        style={{ color: "#47709B" }}
                      >
                        5
                      </span>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {t("howItWorks.steps.connection.title")}
                      </h4>
                      <p className="text-gray-600">
                        {t("howItWorks.steps.connection.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-50 border border-blue-200">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-blue-800 font-medium">
                {t("howItWorks.note")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companions - Client Component */}
      <CompanionsSection initialCompanions={initialCompanions} />

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t("features.title")}
            </h3>
            <p className="text-lg text-gray-600">{t("features.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#AFC8DA" }}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: "#47709B" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {t("features.verified.title")}
              </h4>
              <p className="text-gray-600">
                {t("features.verified.description")}
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#AFC8DA" }}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: "#47709B" }}
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
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {t("features.personalized.title")}
              </h4>
              <p className="text-gray-600">
                {t("features.personalized.description")}
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#AFC8DA" }}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: "#47709B" }}
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
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {t("features.educational.title")}
              </h4>
              <p className="text-gray-600">
                {t("features.educational.description")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
