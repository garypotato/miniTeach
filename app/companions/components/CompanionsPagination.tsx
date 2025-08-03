"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/store/hooks";
import { setLoading } from "@/app/store/modalSlice";

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

interface CompanionsPaginationProps {
  companions: Companion[];
  currentPage: number;
  totalPages: number;
  totalCompanions: number;
  searchQuery?: string;
}

const extractTextFromHtml = (html: string) => {
  // Use consistent server/client approach
  return html
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&amp;/g, "&") // Decode HTML entities
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

const generatePageNumbers = (currentPage: number, totalPages: number) => {
  const pages: (number | string)[] = [];
  const showPages = 5; // Show 5 page numbers at most

  if (totalPages <= showPages) {
    // Show all pages if we have 5 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }
  }

  return pages;
};

export default function CompanionsPagination({
  companions,
  currentPage,
  totalPages,
  searchQuery = "",
}: CompanionsPaginationProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (searchQuery) params.set("search", searchQuery);

    const queryString = params.toString();
    return queryString ? `/companions?${queryString}` : "/companions";
  };

  return (
    <>
      {/* Companions List */}
      <div className="space-y-6 mb-12">
        {companions.map((companion, index) => (
          <div
            key={companion.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div
                    className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden relative"
                    style={{
                      background:
                        "linear-gradient(to bottom right, #AFC8DA, #e2eef7)",
                    }}
                  >
                    {companion.image?.src ? (
                      <Image
                        src={companion.image.src}
                        alt={companion.image.alt || companion.title}
                        fill
                        sizes="(max-width: 768px) 96px, 128px"
                        priority={index < 2} // Add priority to first 2 companions for LCP optimization
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span
                          className="text-2xl md:text-3xl font-bold"
                          style={{ color: "#47709B" }}
                        >
                          {companion.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Companion Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                          {companion.title}
                        </h3>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: "#AFC8DA",
                            color: "#47709B",
                          }}
                        >
                          儿童陪伴师
                        </span>
                      </div>

                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 leading-relaxed">
                          <span className="hidden md:inline">
                            {truncateText(
                              extractTextFromHtml(companion.body_html),
                              280
                            )}
                          </span>
                          <span className="hidden sm:inline md:hidden">
                            {truncateText(
                              extractTextFromHtml(companion.body_html),
                              180
                            )}
                          </span>
                          <span className="sm:hidden">
                            {truncateText(
                              extractTextFromHtml(companion.body_html),
                              120
                            )}
                          </span>
                        </p>
                      </div>

                      {/* Key Skills/Highlights */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          已认证
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          教育背景
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          灵活
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 md:ml-6">
                      <Link
                        href={`/companion/${companion.id}`}
                        className="inline-flex items-center justify-center px-6 py-3 text-white text-sm font-semibold rounded-lg transition-colors hover:opacity-90"
                        style={{ backgroundColor: "#47709B" }}
                      >
                        查看详情
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>

                      <button
                        className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium border-2 rounded-lg transition-colors hover:bg-gray-50"
                        style={{ borderColor: "#47709B", color: "#47709B" }}
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        收藏
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* List Item Number */}
            <div className="absolute top-4 left-4 md:relative md:top-0 md:left-0 md:hidden">
              <span
                className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full"
                style={{ backgroundColor: "#47709B" }}
              >
                {(currentPage - 1) * 8 + index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4 border-t pt-8">
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            {currentPage > 1 ? (
              <Link
                href={buildPageUrl(currentPage - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-1 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                上一页
              </Link>
            ) : (
              <span className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">
                <svg
                  className="w-4 h-4 mr-1 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                上一页
              </span>
            )}

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {pageNumbers.map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-sm text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={buildPageUrl(page as number)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? "text-white border-transparent"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                    style={
                      currentPage === page ? { backgroundColor: "#47709B" } : {}
                    }
                  >
                    {page}
                  </Link>
                )
              )}
            </div>

            {/* Next Button */}
            {currentPage < totalPages ? (
              <Link
                href={buildPageUrl(currentPage + 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                下一页
                <svg
                  className="w-4 h-4 ml-1 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ) : (
              <span className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">
                下一页
                <svg
                  className="w-4 h-4 ml-1 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            )}
          </div>

          {/* Quick Jump */}
          {totalPages > 5 && (
            <div className="text-center">
              <span className="text-sm text-gray-500 mr-2">跳转到页面:</span>
              <select
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  dispatch(
                    setLoading({ loading: true, message: "正在加载页面..." })
                  );
                  router.push(buildPageUrl(page));
                }}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  )
                )}
              </select>
            </div>
          )}
        </div>
      )}
    </>
  );
}
