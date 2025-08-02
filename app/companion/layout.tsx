"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CompanionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if this is a protected route (dashboard)
  const isProtectedRoute = pathname?.startsWith("/companion/dashboard");

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (isProtectedRoute && !session) {
      router.push("/companion/login");
    }
  }, [session, status, router, isProtectedRoute]);

  // Show loading for protected routes while checking auth
  if (isProtectedRoute && status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // If not a protected route (like login), render with GlobalHeader
  if (!isProtectedRoute) {
    return (
      <div className="min-h-screen flex flex-col pt-16">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  // If protected route but no session, don't render anything (will redirect)
  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/companion/login" });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="bg-gray-50 pt-16">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-16 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white p-2 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/70 bg-opacity-50 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
      />

      <div className="flex">
        {/* Left Sidebar - Desktop */}
        <div className="hidden lg:block fixed top-16 left-0 w-64 bg-white shadow-lg z-40">
          <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* User Info */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {session.user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user?.name || "陪伴师"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(session.user as { email?: string })?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/companion/dashboard/profile"
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      pathname === "/companion/dashboard/profile"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    个人档案
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Sign Out */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                退出登录
              </button>
            </div>
          </div>
        </div>

        {/* Left Sidebar - Mobile */}
        <div
          className={`lg:hidden fixed top-16 left-0 w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Navigation */}
            <nav className="flex-1 p-6 border-t">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/companion/dashboard/profile"
                    onClick={closeMobileMenu}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      pathname === "/companion/dashboard/profile"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    个人档案
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Sign Out */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                退出登录
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 px-4 lg:px-0">{children}</div>
      </div>
    </div>
  );
}
