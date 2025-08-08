"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import AuthButton from "./AuthButton";

export default function MobileMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const isOnCreatePage = pathname === "/companion/create";

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden">
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
            首页
          </Link>
          <Link
            href="/companions"
            className="block px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            所有陪伴师
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            关于我们
          </Link>
          <Link
            href="/contact"
            className="block px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            联系我们
          </Link>
          {/* Only show "成为陪伴师" button when not logged in */}
          {!session && (
            isOnCreatePage ? (
              <span className="block mx-3 my-2 px-3 py-2 bg-gray-400 text-white font-medium rounded-md text-center cursor-not-allowed">
                成为陪伴师
              </span>
            ) : (
              <Link
                href="/companion/create"
                className="block mx-3 my-2 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium rounded-md transition-colors duration-200 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                成为陪伴师
              </Link>
            )
          )}
          
          {/* Mobile Authentication */}
          <div className="border-t border-gray-200 pt-3 mt-3">
            <AuthButton onMobileMenuClose={() => setIsMobileMenuOpen(false)} isMobile={true} />
          </div>
        </div>
      </div>
    </>
  );
}