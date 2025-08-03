"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

interface AuthButtonProps {
  onMobileMenuClose?: () => void;
  isMobile?: boolean;
}

export default function AuthButton({
  onMobileMenuClose,
  isMobile = false,
}: AuthButtonProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    if (onMobileMenuClose) onMobileMenuClose();
  };

  if (!isHydrated) {
    // Placeholder during hydration
    return isMobile ? (
      <div className="mx-3 my-2 h-10 bg-gray-100 rounded-md animate-pulse"></div>
    ) : (
      <div className="w-24 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
    );
  }

  if (session) {
    if (isMobile) {
      return (
        <div className="space-y-2">
          <Link
            href="/companion/dashboard/profile"
            className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors duration-200"
            onClick={onMobileMenuClose}
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 text-sm font-semibold">
                {session.user?.name?.charAt(0) || "U"}
              </span>
            </div>
            {session.user?.name}
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 font-medium rounded-md transition-colors duration-200"
          >
            退出登录
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/companion/dashboard/profile"
          className="text-gray-700 hover:opacity-80 font-medium flex items-center"
        >
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
            <span className="text-blue-600 text-sm font-semibold">
              {session.user?.name?.charAt(0) || "U"}
            </span>
          </div>
          {session.user?.name}
        </Link>
      </div>
    );
  }

  // Not logged in
  if (isMobile) {
    return (
      <Link
        href="/companion/login"
        className="block mx-3 my-2 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors duration-200 text-center"
        onClick={onMobileMenuClose}
      >
        陪伴师登录
      </Link>
    );
  }

  return (
    <Link
      href="/companion/login"
      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
    >
      陪伴师登录
    </Link>
  );
}
