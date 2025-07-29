"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../hooks/useLanguage";
import { getCompanionsAction } from "../../actions/shopify";

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

interface CompanionsSectionProps {
  initialCompanions: Companion[];
}

const extractTextFromHtml = (html: string) => {
  if (!html) return "";

  // Use consistent server/client approach
  return html
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&amp;/g, "&") // Decode HTML entities
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
    .trim();
};

async function fetchMoreCompanions(excludeIds: number[]): Promise<Companion[]> {
  try {
    const result = await getCompanionsAction();

    if (result.success && result.data) {
      // Filter out companions that are already displayed
      const availableCompanions = result.data.filter(
        (companion: Companion) => !excludeIds.includes(companion.id)
      );

      // Shuffle the available companions
      const shuffled = [...availableCompanions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Return up to 8 more companions
      return shuffled.slice(0, 8);
    }
    return [];
  } catch (error) {
    console.error("Error fetching more companions:", error);
    return [];
  }
}

export default function CompanionsSection({
  initialCompanions,
}: CompanionsSectionProps) {
  const { t } = useLanguage();
  const [companions, setCompanions] = useState<Companion[]>(initialCompanions);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreAvailable, setHasMoreAvailable] = useState(true);
  const masonryRef = useRef<HTMLDivElement>(null);

  // Masonry layout function
  const arrangeMasonry = () => {
    if (!masonryRef.current) return;

    const container = masonryRef.current;
    const items = container.children as HTMLCollectionOf<HTMLElement>;
    const containerWidth = container.offsetWidth;

    // Calculate number of columns (max 5)
    let columnCount = 2; // Default for mobile
    if (containerWidth >= 640) columnCount = 3; // Tablet
    if (containerWidth >= 1024) columnCount = 4; // Desktop
    if (containerWidth >= 1280) columnCount = 5; // Large screens - max 5 columns

    const gap = 20;
    const columnWidth =
      (containerWidth - gap * (columnCount - 1)) / columnCount;
    const columnHeights = new Array(columnCount).fill(0);

    // Position each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Find shortest column
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
      );

      // Position the item
      const x = shortestColumnIndex * (columnWidth + gap);
      const y = columnHeights[shortestColumnIndex];

      item.style.position = "absolute";
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      item.style.width = `${columnWidth}px`;

      // Update column height
      columnHeights[shortestColumnIndex] += item.offsetHeight + gap;
    }

    // Set container height
    container.style.height = `${Math.max(...columnHeights)}px`;
  };

  // Arrange masonry on mount and when companions change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      arrangeMasonry();
    }, 100); // Small delay to ensure images are loaded

    const handleResize = () => {
      arrangeMasonry();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [companions]);

  // Ensure hydration stability by avoiding any client-side randomization on initial render
  useEffect(() => {
    // Component is now hydrated - any client-side logic can go here
    // Currently keeping companions stable to prevent hydration mismatch
  }, []);

  const loadMoreCompanions = async () => {
    setLoadingMore(true);

    try {
      // Get IDs of currently displayed companions
      const currentIds = companions.map((c) => c.id);

      // Fetch more companions excluding current ones
      const moreCompanions = await fetchMoreCompanions(currentIds);

      if (moreCompanions.length > 0) {
        setCompanions((prev) => [...prev, ...moreCompanions]);
      }

      // If we got fewer than 8, we might be running low on companions
      if (moreCompanions.length < 8) {
        setHasMoreAvailable(false);
      }
    } catch (error) {
      console.error("Error loading more companions:", error);
    } finally {
      setTimeout(() => {
        setLoadingMore(false);
        // Rearrange masonry after new items are added
        setTimeout(() => {
          arrangeMasonry();
        }, 100);
      }, 300);
    }
  };

  const resetCompanions = () => {
    // Reset to initial companions and shuffle them
    const shuffled = [...initialCompanions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setCompanions(shuffled);
    setHasMoreAvailable(true);

    // Rearrange masonry after reset
    setTimeout(() => {
      arrangeMasonry();
      document
        .getElementById("companions-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <section
      id="companions-section"
      className="py-16 w-full"
      style={{
        background: "linear-gradient(to bottom, #f8fafc, #f1f5f9)",
      }}
    >
      <div className="w-full">
        <div className="text-center mb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {t("companions.title")}
          </h3>
          <p className="text-lg text-gray-600">{t("companions.description")}</p>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="companions-masonry-container">
            <div ref={masonryRef} className="companions-masonry">
              {companions.map((companion, index) => {
                // Fixed heights for image and footer
                const imageHeight = 220; // Increased from 180px to 220px
                const titleHeight = 40; // Fixed height for title (2 lines)
                const footerHeight = 35; // Fixed height for "review profile" section
                const padding = 16; // 4*4 = 16px padding

                // Random description height for waterfall effect - increased minimum height
                const descriptionHeights = [80, 100, 120, 140, 160]; // Higher minimum heights
                const randomDescriptionHeight =
                  descriptionHeights[index % descriptionHeights.length];

                // Calculate total card height
                const totalContentHeight =
                  titleHeight +
                  randomDescriptionHeight +
                  footerHeight +
                  padding;
                const finalHeight = imageHeight + totalContentHeight;

                // Get description text (no truncation needed - CSS will handle it)
                const descriptionText = extractTextFromHtml(
                  companion.body_html
                );

                return (
                  <div
                    key={companion.id}
                    className="companion-card-masonry"
                    style={{
                      height: `${finalHeight}px`,
                    }}
                  >
                    <Link
                      href={`/companion/${companion.id}`}
                      className="block h-full group"
                    >
                      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 h-full flex flex-col">
                        <div
                          className="relative overflow-hidden flex-shrink-0"
                          style={{
                            height: `${imageHeight}px`,
                            background:
                              "linear-gradient(to bottom right, #AFC8DA, #e2eef7)",
                          }}
                        >
                          {companion.image?.src ? (
                            <Image
                              src={companion.image.src}
                              alt={companion.image.alt || companion.title}
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                              priority={index < 6}
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div
                                className="w-14 h-14 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: "#AFC8DA" }}
                              >
                                <span
                                  className="text-lg font-bold"
                                  style={{ color: "#47709B" }}
                                >
                                  {companion.title?.charAt(0)?.toUpperCase() ||
                                    "?"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div
                          className="p-4 flex flex-col"
                          style={{ height: `${totalContentHeight}px` }}
                        >
                          {/* Title - Fixed height */}
                          <div
                            style={{
                              height: `${titleHeight}px`,
                              overflow: "hidden",
                            }}
                          >
                            <h4 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                              {companion.title}
                            </h4>
                          </div>

                          {/* Description - Random height */}
                          <div
                            style={{
                              height: `${randomDescriptionHeight}px`,
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            <p
                              className="text-gray-600 text-sm leading-5"
                              style={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                WebkitLineClamp: Math.floor(
                                  (randomDescriptionHeight - 8) / 20
                                ),
                              }}
                            >
                              {descriptionText}
                            </p>
                          </div>

                          {/* Review profile - Fixed height */}
                          <div
                            className="flex items-center text-xs font-medium pt-2 border-t border-gray-100"
                            style={{
                              color: "#47709B",
                              height: `${footerHeight}px`,
                              marginTop: "auto",
                            }}
                          >
                            <span>{t("companionsList.viewProfile")}</span>
                            <svg
                              className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"
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
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {hasMoreAvailable && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMoreCompanions}
                  disabled={loadingMore}
                  className="inline-flex items-center text-white px-8 py-3 rounded-full font-semibold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#47709B" }}
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Loading More...
                    </>
                  ) : (
                    <>
                      View More Companions
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  )}
                </button>
                <p className="text-gray-500 text-sm mt-3">
                  Showing {companions.length} companions
                </p>
              </div>
            )}

            {!hasMoreAvailable && companions.length > 8 && (
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-4">
                  {`You've seen ${companions.length} companions!`}
                </p>
                <button
                  onClick={resetCompanions}
                  className="inline-flex items-center border-2 px-8 py-3 rounded-full font-semibold transition-colors hover:bg-gray-50"
                  style={{ borderColor: "#47709B", color: "#47709B" }}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Show Different Companions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
