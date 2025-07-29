"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSwitch from "./LanguageSwitch";
import { useLanguage } from "../hooks/useLanguage";

export default function GlobalHeader() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold hover:opacity-80"
              style={{ color: "#47709B" }}
            >
              MiniTeach
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link
              href="/"
              className="text-gray-700 hover:opacity-80 font-medium"
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/companions"
              className="text-gray-700 hover:opacity-80 font-medium"
            >
              {t("nav.allCompanions")}
            </Link>
            <LanguageSwitch />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <LanguageSwitch />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:opacity-80 focus:outline-none focus:opacity-80"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Overlay */}
        <div
          className={`md:hidden absolute top-16 left-0 right-0 z-50 bg-white border-t shadow-lg transform transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/companions"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.allCompanions")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
