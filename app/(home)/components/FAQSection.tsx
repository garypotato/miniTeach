"use client";

import { useLanguage } from "../../hooks/useLanguage";

export default function FAQSection() {
  const { t } = useLanguage();

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">
            {t("faq.title")}
          </h3>
        </div>

        <div className="space-y-4">
          {/* Q1: How does the platform work? */}
          <details className="group border border-gray-200 rounded-lg">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50">
              <span>{t("faq.question1.title")}</span>
              <svg
                className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              <p className="mb-4">{t("faq.question1.description")}</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  <strong>{t("faq.question1.step1.title")}</strong>{" "}
                  {t("faq.question1.step1.description")}
                </li>
                <li>
                  <strong>{t("faq.question1.step2.title")}</strong>{" "}
                  {t("faq.question1.step2.description")}
                </li>
                <li>
                  <strong>{t("faq.question1.step3.title")}</strong>{" "}
                  {t("faq.question1.step3.description")}
                </li>
                <li>
                  <strong>{t("faq.question1.step4.title")}</strong>{" "}
                  {t("faq.question1.step4.description")}
                </li>
                <li>
                  <strong>{t("faq.question1.step5.title")}</strong>{" "}
                  {t("faq.question1.step5.description")}
                </li>
              </ol>
            </div>
          </details>

          {/* Q2: Is there a fee for using the platform? */}
          <details className="group border border-gray-200 rounded-lg">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50">
              <span>{t("faq.question2.title")}</span>
              <svg
                className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              <p>{t("faq.question2.description")}</p>
            </div>
          </details>

          {/* Q3: How are companions verified? */}
          <details className="group border border-gray-200 rounded-lg">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50">
              <span>{t("faq.question3.title")}</span>
              <svg
                className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              <p className="mb-3">{t("faq.question3.description")}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t("faq.question3.point1")}</li>
                <li>{t("faq.question3.point2")}</li>
                <li>{t("faq.question3.point3")}</li>
                <li>{t("faq.question3.point4")}</li>
              </ul>
              <p className="mt-3">{t("faq.question3.conclusion")}</p>
            </div>
          </details>

          {/* Q4: What happens after I request contact information? */}
          <details className="group border border-gray-200 rounded-lg">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50">
              <span>{t("faq.question4.title")}</span>
              <svg
                className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              <p className="mb-3">{t("faq.question4.description")}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t("faq.question4.point1")}</li>
                <li>{t("faq.question4.point2")}</li>
                <li>{t("faq.question4.point3")}</li>
              </ul>
              <p className="mt-3">{t("faq.question4.conclusion")}</p>
            </div>
          </details>

          {/* Q5: Can companions update their profiles? */}
          <details className="group border border-gray-200 rounded-lg">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50">
              <span>{t("faq.question5.title")}</span>
              <svg
                className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              <p>{t("faq.question5.description")}</p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
