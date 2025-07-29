"use client";

import Link from "next/link";
import { useLanguage } from "../hooks/useLanguage";

export default function GlobalFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5
              className="text-2xl font-bold mb-4"
              style={{ color: "#47709B" }}
            >
              {t("footer.company")}
            </h5>
            <p className="text-gray-400">{t("footer.description")}</p>
          </div>
          <div>
            <h6 className="font-semibold mb-4">{t("footer.services")}</h6>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/companions"
                  className="hover:opacity-80"
                  style={{ color: "#AFC8DA" }}
                >
                  {t("footer.findCompanions")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold mb-4">{t("footer.contact")}</h6>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="text-gray-400">
                  {t("footer.contactMessage")}
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold mb-4">{t("footer.connect")}</h6>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="#"
                  className="hover:opacity-80"
                  style={{ color: "#AFC8DA" }}
                >
                  {t("footer.facebook")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:opacity-80"
                  style={{ color: "#AFC8DA" }}
                >
                  {t("footer.instagram")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:opacity-80"
                  style={{ color: "#AFC8DA" }}
                >
                  {t("footer.twitter")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
