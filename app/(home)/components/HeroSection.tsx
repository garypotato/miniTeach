"use client";

import Link from "next/link";
import { useTranslation } from "@/app/i18n";

export default function HeroSection() {
  const { t, translations } = useTranslation();

  return (
    <section
      className="relative py-20 px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          {t(translations.hero.title1)}
          <span className="block text-white opacity-90">{t(translations.hero.title2)}</span>
        </h2>
        <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
          {t(translations.hero.subtitle)}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/companions"
            className="bg-white text-purple-700 px-8 py-3 rounded-full font-semibold transition-all hover:bg-gray-100 hover:shadow-lg inline-block text-center"
          >
            {t(translations.hero.browseCompanions)}
          </Link>
          <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-white hover:text-purple-700">
            {t(translations.hero.learnMore)}
          </button>
        </div>
      </div>
    </section>
  );
}
