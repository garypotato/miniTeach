"use client";

import Link from "next/link";
import { useLanguage } from "../../hooks/useLanguage";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
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
  );
}
