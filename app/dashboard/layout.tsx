"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Companions",
    href: "/dashboard/companions",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <header className="bg-white shadow-sm border-b z-10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold hover:opacity-80" style={{ color: "#47709B" }}>
                MiniTeach
              </Link>
              <span className="ml-4 text-gray-400">|</span>
              <span className="ml-4 text-lg font-medium text-gray-700">Dashboard</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:opacity-80 font-medium">
                Home
              </Link>
              <Link href="/companions" className="text-gray-700 hover:opacity-80 font-medium">
                All Companions
              </Link>
              <Link href="/about" className="text-gray-700 hover:opacity-80 font-medium">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Fixed Mobile Navigation */}
      <div className="xl:hidden bg-white border-b z-10 flex-shrink-0">
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Management</h2>
          <nav className="flex space-x-4 overflow-x-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  style={isActive ? { backgroundColor: "#47709B" } : {}}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Desktop Sidebar */}
        <div className="hidden xl:flex xl:flex-col w-64 bg-white shadow-sm border-r flex-shrink-0">
          <div className="p-6 flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Management</h2>
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    style={isActive ? { backgroundColor: "#47709B" } : {}}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Scrollable Main content */}
        <div className="flex-1 overflow-auto">
          <main className="p-4 sm:p-6 xl:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}