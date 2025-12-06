"use client";

import { useTranslation } from "@/app/i18n";

export default function FAQSection() {
  const { t, translations } = useTranslation();

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">{t(translations.faq.title)}</h3>
        </div>

        <div className="space-y-4">
          {/* Q1: Is there a fee for using the platform? */}
          <details className="group border border-gray-200 rounded-lg">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50">
              <span>{t(translations.faq.q1.question)}</span>
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
              <p>
                {t(translations.faq.q1.answer)}
              </p>
            </div>
          </details>

          {/* Q2: How are companions verified? */}
          <details className="group border border-gray-200 rounded-lg">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50">
              <span>{t(translations.faq.q2.question)}</span>
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
              <p className="mb-3">
                {t(translations.faq.q2.answerIntro)}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t(translations.faq.q2.answerList.item1)}</li>
                <li>{t(translations.faq.q2.answerList.item2)}</li>
                <li>{t(translations.faq.q2.answerList.item3)}</li>
                <li>{t(translations.faq.q2.answerList.item4)}</li>
              </ul>
              <p className="mt-3">
                {t(translations.faq.q2.answerOutro)}
              </p>
            </div>
          </details>

          {/* Q3: What happens after I request contact information? */}
          <details className="group border border-gray-200 rounded-lg">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50">
              <span>{t(translations.faq.q3.question)}</span>
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
              <p className="mb-3">{t(translations.faq.q3.answerIntro)}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t(translations.faq.q3.answerList.item1)}</li>
                <li>{t(translations.faq.q3.answerList.item2)}</li>
                <li>{t(translations.faq.q3.answerList.item3)}</li>
              </ul>
              <p className="mt-3">
                {t(translations.faq.q3.answerOutro)}
              </p>
            </div>
          </details>

          {/* Q4: Can companions update their profiles? */}
          <details className="group border border-gray-200 rounded-lg">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50">
              <span>{t(translations.faq.q4.question)}</span>
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
              <p>
                {t(translations.faq.q4.answer)}
              </p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
