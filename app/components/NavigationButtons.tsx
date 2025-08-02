"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AuthButton from "./AuthButton";

export default function NavigationButtons() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isOnCreatePage = pathname === "/companion/create";

  return (
    <div className="flex items-center space-x-8">
      {/* Only show "成为陪伴师" button when not logged in */}
      {!session && (
        isOnCreatePage ? (
          <span className="bg-gray-400 text-white px-4 py-2 rounded-lg font-medium cursor-not-allowed">
            成为陪伴师
          </span>
        ) : (
          <Link
            href="/companion/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            成为陪伴师
          </Link>
        )
      )}
      
      {/* Authentication Button - shows login when not logged in, profile when logged in */}
      <AuthButton />
    </div>
  );
}