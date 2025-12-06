"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n";

export default function GlobalFooter() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/companion/dashboard");
  const { t, translations } = useTranslation();

  if (isDashboard) {
    return (
      <footer className="bg-gray-100 text-gray-700 py-8 px-4 sm:px-6 lg:px-8 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="text-lg font-semibold mb-3 text-blue-600">
                MiniTeach
              </h5>
              <p className="text-gray-600 text-sm">{t(translations.footer.slogan)}</p>
            </div>
            <div>
              <h6 className="font-medium mb-3 text-gray-800">{t(translations.footer.contactUs)}</h6>
              <p className="text-gray-600 text-sm">
                {t(translations.footer.contactDesc)}
              </p>
            </div>
            <div>
              <h6 className="font-medium mb-3 text-gray-800">{t(translations.footer.help)}</h6>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {t(translations.footer.aboutUs)}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 mt-6 pt-6 text-center">
            <p className="text-gray-500 text-sm">{t(translations.footer.copyright)}</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5
              className="text-2xl font-bold mb-4"
              style={{ color: "#47709B" }}
            >
              MiniTeach
            </h5>
            <p className="text-gray-400">{t(translations.footer.slogan)}</p>
          </div>
          <div>
            <h6 className="font-semibold mb-4">{t(translations.footer.services)}</h6>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/companions"
                  className="hover:opacity-80"
                  style={{ color: "#AFC8DA" }}
                >
                  {t(translations.footer.findCompanion)}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:opacity-80"
                  style={{ color: "#AFC8DA" }}
                >
                  {t(translations.footer.aboutUs)}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold mb-4">{t(translations.footer.contactUs)}</h6>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="text-gray-400">
                  {t(translations.footer.contactDesc)}
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold mb-4">{t(translations.footer.followUs)}</h6>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="#"
                  className="hover:opacity-80"
                  style={{ color: "#AFC8DA" }}
                >
                  {t(translations.footer.facebook)}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:opacity-80"
                  style={{ color: "#AFC8DA" }}
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:opacity-80"
                  style={{ color: "#AFC8DA" }}
                >
                  {t(translations.footer.twitter)}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t(translations.footer.copyright)}</p>
        </div>
      </div>
    </footer>
  );
}
