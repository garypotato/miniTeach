"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useModal } from "@/app/contexts/ModalContext";

interface SearchFilterProps {
  initialSearch: string;
  initialCities: string[];
}

const AUSTRALIAN_CITIES = ["Sydney", "Melbourne", "Brisbane", "Adelaide"];

export default function SearchFilter({
  initialSearch,
  initialCities,
}: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { modalOpen, modalType, isLoading, openModal, closeModal, setLoading } = useModal();

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [selectedCities, setSelectedCities] = useState<string[]>(initialCities);
  const [tempSearchInput, setTempSearchInput] = useState(initialSearch);
  const [tempSelectedCities, setTempSelectedCities] =
    useState<string[]>(initialCities);

  useEffect(() => {
    setSearchInput(initialSearch);
    setSelectedCities(initialCities);
    setTempSearchInput(initialSearch);
    setTempSelectedCities(initialCities);
    setLoading(false); // Reset loading when new data arrives
  }, [initialSearch, initialCities, setLoading]);

  const handleSearch = (
    name: string = searchInput,
    cities: string[] = selectedCities
  ) => {
    setLoading(true, "正在搜索伙伴...");
    const params = new URLSearchParams(searchParams);

    if (name.trim()) {
      params.set("search", name.trim());
    } else {
      params.delete("search");
    }

    if (cities.length > 0) {
      params.set("cities", cities.join(","));
    } else {
      params.delete("cities");
    }

    // Reset to page 1 when searching
    params.delete("page");

    const queryString = params.toString();
    const newUrl = queryString ? `/companions?${queryString}` : "/companions";

    router.push(newUrl);
  };

  const handleApplyFilters = () => {
    setSearchInput(tempSearchInput);
    setSelectedCities(tempSelectedCities);
    handleSearch(tempSearchInput, tempSelectedCities);
    closeModal();
  };

  const handleCityToggle = (city: string) => {
    const newSelectedCities = tempSelectedCities.includes(city)
      ? tempSelectedCities.filter((c) => c !== city)
      : [...tempSelectedCities, city];

    setTempSelectedCities(newSelectedCities);
  };

  const handleClearFilters = () => {
    setTempSearchInput("");
    setTempSelectedCities([]);
  };

  const handleClear = () => {
    setLoading(true, "Clearing filters...");
    setSearchInput("");
    setSelectedCities([]);
    setTempSearchInput("");
    setTempSelectedCities([]);
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.delete("cities");
    params.delete("page");

    const queryString = params.toString();
    const newUrl = queryString ? `/companions?${queryString}` : "/companions";

    router.push(newUrl);
  };

  const openFilterModal = () => {
    setTempSearchInput(searchInput);
    setTempSelectedCities(selectedCities);
    openModal("filter");
  };

  const hasActiveFilters = searchInput || selectedCities.length > 0;

  return (
    <div className="mb-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Search Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            找到您的完美陪伴者
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            在澳大利亚寻找有经验的儿童陪伴者
          </p>

          {/* Main Search Button */}
          <button
            onClick={openFilterModal}
            disabled={isLoading}
            className="group relative inline-flex items-center space-x-4 px-8 py-4 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ backgroundColor: "var(--primary-blue)" }}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                <span>搜索中...</span>
              </>
            ) : (
              <>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>搜索陪伴者</span>
                <svg
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform"
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
              </>
            )}

            {hasActiveFilters && !isLoading && (
              <div className="absolute -top-2 -right-2 inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-red-500 rounded-full border-4 border-white shadow-lg">
                {(searchInput ? 1 : 0) + selectedCities.length}
              </div>
            )}
          </button>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div
            className={`transition-all duration-300 ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v6.586a1 1 0 01-1.447.894l-4-2A1 1 0 018 18.586v-4.586a1 1 0 00-.293-.707L1.293 7.293A1 1 0 011 6.586V4z"
                    />
                  </svg>
                  <span>当前筛选</span>
                </h3>
                <button
                  onClick={handleClear}
                  disabled={isLoading}
                  className="flex items-center space-x-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>清除全部</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {searchInput && (
                  <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                    <svg
                      className="h-4 w-4 mr-2"
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
                    <span>
                      名称: &ldquo;{searchInput}&rdquo;
                    </span>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        setSearchInput("");
                        handleSearch("", selectedCities);
                      }}
                      className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                {selectedCities.map((city) => (
                  <div
                    key={city}
                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                  >
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>
                      地点: {city}
                    </span>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        const newCities = selectedCities.filter(
                          (c) => c !== city
                        );
                        setSelectedCities(newCities);
                        handleSearch(searchInput, newCities);
                      }}
                      className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats or Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  实时搜索
                </p>
                <p className="text-xs text-blue-600">高效过滤</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800">
                  地理筛选
                </p>
                <p className="text-xs text-purple-600">精准定位</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
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
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">
                  智能收藏
                </p>
                <p className="text-xs text-green-600">多样选择</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Modal */}
        {modalOpen && modalType === "filter" && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onMouseDown={(e) => {
              // Only close if clicking the backdrop itself
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >
            <div
              className={`bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
                isLoading ? "pointer-events-none opacity-75" : "scale-100"
              }`}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className="relative text-white p-8"
                style={{ backgroundColor: "var(--primary-blue)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">搜索伙伴</h2>
                    <p className="text-blue-100 text-sm">
                      找到您的完美AI伙伴，按地点筛选
                    </p>
                  </div>
                  <button
                    onClick={() => closeModal()}
                    disabled={isLoading}
                    className="p-2 text-white hover:scale-150 hover:bg-opacity-10 rounded-full transition-all duration-200 disabled:opacity-50"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div
                className="p-8 space-y-8 max-h-[50vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {/* Search Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      按名称搜索
                    </h3>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={tempSearchInput}
                      onChange={(e) => setTempSearchInput(e.target.value)}
                      onFocus={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="输入伙伴名称..."
                      className="block w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 focus:outline-none transition-all placeholder-gray-400"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* City Filter Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      按地点筛选
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {AUSTRALIAN_CITIES.map((city) => (
                      <label
                        key={city}
                        className={`relative flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all hover:shadow-md border-2 ${
                          tempSelectedCities.includes(city)
                            ? "bg-blue-50 border-blue-200 shadow-sm"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={tempSelectedCities.includes(city)}
                            onChange={() => handleCityToggle(city)}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded border-2 transition-all ${
                              tempSelectedCities.includes(city)
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {tempSelectedCities.includes(city) && (
                              <svg
                                className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-sm font-medium transition-colors ${
                            tempSelectedCities.includes(city)
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {city}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Selected Cities Preview */}
                  {tempSelectedCities.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm font-medium text-blue-700 mb-2">
                        已选择城市 ({tempSelectedCities.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tempSelectedCities.map((city) => (
                          <span
                            key={city}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                          >
                            {city}
                            <button
                              type="button"
                              onClick={() => handleCityToggle(city)}
                              className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 transition-colors"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-8 border-t border-gray-200 bg-gray-50"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleClearFilters}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>清除全部</span>
                </button>

                <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => closeModal()}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-3 text-sm font-medium text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{ backgroundColor: "#47709B" }}
                  >
                    {isLoading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    )}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span>{isLoading ? "搜索中" : "搜索伙伴"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
