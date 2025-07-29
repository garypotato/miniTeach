"use client";

import Link from "next/link";
import { ImageGallery } from "./ImageGallery";
import MetafieldsDisplay from "../../components/MetafieldsDisplay";
import { useLanguage } from "../../hooks/useLanguage";
import { Companion, CompanionImage } from "../../types/companion";

interface CompanionDetailContentProps {
  companion: Companion;
  images: CompanionImage[];
}

export default function CompanionDetailContent({
  companion,
  images,
}: CompanionDetailContentProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <ImageGallery images={images} companionTitle={companion.title} />

        {/* Companion Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {companion.title}
            </h1>
            <div className="flex items-center space-x-4 mb-6">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: "#AFC8DA", color: "#47709B" }}
              >
                {t("companionDetail.childCompanion")}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {t("companionDetail.available")}
              </span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t("companionDetail.aboutMe")}
            </h3>
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: companion.body_html }}
            />
          </div>

          {/* Companion Details with Metafields */}
          {companion.metafields && (
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {t("companionDetail.qualifications")}
              </h3>
              <MetafieldsDisplay metafields={companion.metafields} />
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t("companionDetail.contactUs")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("companionDetail.contactDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 text-white px-6 py-3 rounded-full font-semibold transition-colors hover:opacity-90"
                style={{ backgroundColor: "#47709B" }}
              >
                {t("companionDetail.getContactInfo")}
              </button>
              <Link
                href="/companions"
                className="flex-1 border-2 px-6 py-3 rounded-full font-semibold transition-colors hover:bg-gray-50 text-center"
                style={{ borderColor: "#47709B", color: "#47709B" }}
              >
                {t("nav.allCompanions")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Companions */}
      <section className="py-16 mt-16 bg-white border-t rounded-2xl">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {t("companions.title")}
          </h3>
          <p className="text-lg text-gray-600">{t("companions.description")}</p>
        </div>
        <div className="text-center">
          <Link
            href="/companions"
            className="inline-flex items-center text-white px-8 py-3 rounded-full font-semibold transition-colors hover:opacity-90"
            style={{ backgroundColor: "#47709B" }}
          >
            {t("nav.allCompanions")}
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
