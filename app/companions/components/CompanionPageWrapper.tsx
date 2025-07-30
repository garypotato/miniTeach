"use client";

import Link from "next/link";

import { Companion } from "../../types/companion";

interface CompanionPageWrapperProps {
  children: React.ReactNode;
  selectedCities: string[];
  filteredCompanions: Companion[];
  companionsWithLocation: Companion[];
  allCompanions: Companion[];
}

export default function CompanionPageWrapper({
  children,
  selectedCities,
  filteredCompanions,
  companionsWithLocation,
  allCompanions,
}: CompanionPageWrapperProps) {
  const showNoResults = filteredCompanions.length === 0;

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
      }}
    >
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:opacity-80">
                  首页
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
                <span className="text-gray-700 font-medium">所有伙伴</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">所有伙伴</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            浏览我们完整的合格儿童伙伴和教育工作者收藏。为您的孩子找到完美匹配。
          </p>
        </div>

        {showNoResults ? (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              未找到伙伴
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                {selectedCities.length > 0 &&
                companionsWithLocation.length === 0
                  ? `位置筛选目前不可用，因为伙伴位置数据正在更新中。 ${allCompanions.length} 个伙伴可用，但还没有位置信息。`
                  : selectedCities.length > 0
                  ? `在所选城市中未找到伙伴: ${selectedCities.join(
                      ", "
                    )}。尝试扩展您的搜索或移除位置筛选。`
                  : "我们无法找到符合您搜索条件的伙伴。"}
              </p>

              {selectedCities.length > 0 &&
                companionsWithLocation.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mx-auto max-w-md">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <p className="text-sm text-yellow-800">
                        <strong>位置筛选暂时禁用</strong>
                        <br />
                        伙伴位置数据正在更新
                      </p>
                    </div>
                  </div>
                )}
            </div>

            <div className="mt-6 space-x-4">
              {selectedCities.length > 0 && (
                <Link
                  href="/companions"
                  className="inline-flex items-center text-white px-6 py-3 rounded-full font-semibold transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#47709B" }}
                >
                  清除筛选并查看全部
                </Link>
              )}
              <Link
                href="/"
                className="inline-flex items-center border-2 px-6 py-3 rounded-full font-semibold transition-colors hover:bg-gray-50"
                style={{ borderColor: "#47709B", color: "#47709B" }}
              >
                返回首页
              </Link>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
