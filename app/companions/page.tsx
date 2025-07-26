import Link from "next/link";
import { notFound } from "next/navigation";
import CompanionsPagination from "./components/CompanionsPagination";
import SearchFilter from "./components/SearchFilter";

interface Companion {
  id: number;
  title: string;
  body_html: string;
  handle: string;
  image?: {
    src: string;
    alt: string | null;
  };
}

interface CompanionsPageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

async function getAllCompanions(): Promise<Companion[]> {
  try {
    const response = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ collection_id: "491355177275" }),
      cache: "no-store",
    });

    const data = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching companions:", error);
    return [];
  }
}

export default async function CompanionsPage({
  searchParams,
}: CompanionsPageProps) {
  const { page: pageParam, search: searchParam } = await searchParams;
  const page = parseInt(pageParam || "1", 10);
  const searchQuery = searchParam || "";
  const companionsPerPage = 8;

  if (page < 1) {
    notFound();
  }

  const allCompanions = await getAllCompanions();

  // Filter companions based on search query
  const filteredCompanions = searchQuery.trim()
    ? allCompanions.filter((companion) =>
        companion.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    : allCompanions;

  const totalPages = Math.ceil(filteredCompanions.length / companionsPerPage);

  if (page > totalPages && totalPages > 0) {
    notFound();
  }

  const startIndex = (page - 1) * companionsPerPage;
  const endIndex = startIndex + companionsPerPage;
  const currentCompanions = filteredCompanions.slice(startIndex, endIndex);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
      }}
    >
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:opacity-80 font-medium"
              >
                Home
              </Link>
              <Link
                href="/companions"
                className="font-medium"
                style={{ color: "#47709B" }}
              >
                All Companions
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:opacity-80 font-medium"
              >
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:opacity-80">
                  Home
                </Link>
              </li>
              <li>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li>
                <span className="text-gray-700 font-medium">
                  All Companions
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            All Our Companions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through our complete collection of qualified child companions
            and educators. Find the perfect match for your child's needs.
          </p>
        </div>

        {/* Search Filter */}
        <SearchFilter initialSearch={searchQuery} />

        {currentCompanions.length === 0 ? (
          <div className="text-center py-12">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#AFC8DA" }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: "#47709B" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No companions found
            </h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any companions at the moment.
            </p>
            <Link
              href="/"
              className="inline-flex items-center text-white px-6 py-3 rounded-full font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: "#47709B" }}
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <CompanionsPagination
              companions={currentCompanions}
              currentPage={page}
              totalPages={totalPages}
              totalCompanions={filteredCompanions.length}
              searchQuery={searchQuery}
            />
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5
                className="text-2xl font-bold mb-4"
                style={{ color: "#47709B" }}
              >
                MiniTeach
              </h5>
              <p className="text-gray-400">
                Connecting families with qualified child companions and
                educators.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Services</h6>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/companions"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    Find Companions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Support</h6>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/help"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/safety"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    Safety
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Connect</h6>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="#"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    Facebook
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
                    Twitter
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MiniTeach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
