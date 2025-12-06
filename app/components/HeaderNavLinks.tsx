"use client";

import Link from "next/link";
import { useTranslation } from "@/app/i18n";

export default function HeaderNavLinks() {
  const { t, translations } = useTranslation();

  return (
    <>
      <Link
        href="/"
        className="text-gray-700 hover:opacity-80 font-medium"
      >
        {t(translations.nav.home)}
      </Link>
      <Link
        href="/companions"
        className="text-gray-700 hover:opacity-80 font-medium"
      >
        {t(translations.nav.allCompanions)}
      </Link>
      <Link
        href="/resources"
        className="text-gray-700 hover:opacity-80 font-medium"
      >
        {t(translations.nav.resources)}
      </Link>
      <Link
        href="/about"
        className="text-gray-700 hover:opacity-80 font-medium"
      >
        {t(translations.nav.aboutUs)}
      </Link>
      <Link
        href="/contact"
        className="text-gray-700 hover:opacity-80 font-medium"
      >
        {t(translations.nav.contactUs)}
      </Link>
    </>
  );
}
