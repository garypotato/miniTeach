"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AuthButton from "./AuthButton";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "@/app/i18n";

export default function NavigationButtons() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isOnCreatePage = pathname === "/companion/create";
  const { t, translations } = useTranslation();

  return (
    <div className="flex items-center space-x-4">
      {/* Only show "Become Companion" button when not logged in */}
      {!session && (
        isOnCreatePage ? (
          <span className="bg-gray-400 text-white px-4 py-2 rounded-lg font-medium cursor-not-allowed">
            {t(translations.nav.becomeCompanion)}
          </span>
        ) : (
          <Link
            href="/companion/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {t(translations.nav.becomeCompanion)}
          </Link>
        )
      )}

      {/* Authentication Button - shows login when not logged in, profile when logged in */}
      <AuthButton />

      {/* Language Toggle - at the end */}
      <LanguageToggle />
    </div>
  );
}