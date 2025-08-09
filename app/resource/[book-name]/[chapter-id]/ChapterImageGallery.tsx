"use client";

import { useState } from "react";
import Link from "next/link";

interface ChapterImageGalleryProps {
  images: Array<{
    id: number;
    src: string;
    alt: string | null;
    width: number;
    height: number;
  }>;
  isAuthenticated: boolean;
  chapterTitle: string;
  redirectUrl: string;
}

export default function ChapterImageGallery({
  images,
  isAuthenticated,
  chapterTitle,
  redirectUrl,
}: ChapterImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const publicImages = images.slice(0, 1); // First image is always public
  const privateImages = images.slice(1); // Rest require authentication
  const visibleImages = isAuthenticated ? images : publicImages;

  const handleImageClick = (index: number) => {
    // Allow first image preview for everyone, rest only for authenticated users
    if (index === 0 || isAuthenticated) {
      setSelectedImageIndex(index);
      setShowModal(true);
    }
  };

  const handlePrevious = () => {
    const newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : visibleImages.length - 1;
    setSelectedImageIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = selectedImageIndex < visibleImages.length - 1 ? selectedImageIndex + 1 : 0;
    setSelectedImageIndex(newIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowModal(false);
    } else if (e.key === "ArrowLeft") {
      handlePrevious();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  return (
    <div className="p-6">
      {/* Image Stats */}
      <div className="mb-6 text-center">
        <p className="text-gray-600">
          {isAuthenticated ? (
            <>共 {images.length} 张图片</>
          ) : (
            <>
              可预览 1 张，共 {images.length} 张图片
              {images.length > 1 && (
                <span className="text-blue-600 ml-2">
                  · {images.length - 1} 张需要登录
                </span>
              )}
            </>
          )}
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {/* Public images (always visible) */}
        {publicImages.map((image, index) => (
          <div
            key={image.id}
            className="relative group cursor-pointer"
            onClick={() => handleImageClick(index)}
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden p-3">
              <div className="w-full h-full bg-white rounded-lg shadow-sm overflow-hidden p-2">
                <img
                  src={image.src}
                  alt={image.alt || `${chapterTitle} - 图片 ${index + 1}`}
                  className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
            {/* Free Preview Badge */}
            <div className="absolute top-5 left-5">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm">
                免费预览
              </span>
            </div>
            {/* Image number */}
            <div className="absolute bottom-5 right-5 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              1 / {images.length}
            </div>
          </div>
        ))}

        {/* Private images (authenticated users) */}
        {isAuthenticated &&
          privateImages.map((image, index) => (
            <div
              key={image.id}
              className="relative group cursor-pointer"
              onClick={() => handleImageClick(index + 1)}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden p-3">
                <div className="w-full h-full bg-white rounded-lg shadow-sm overflow-hidden p-2">
                  <img
                    src={image.src}
                    alt={image.alt || `${chapterTitle} - 图片 ${index + 2}`}
                    className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
              {/* Image number */}
              <div className="absolute bottom-5 right-5 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {index + 2} / {images.length}
              </div>
            </div>
          ))}

        {/* Locked images (for non-authenticated users) */}
        {!isAuthenticated &&
          privateImages.map((_, index) => (
            <div key={`locked-${index}`} className="relative group">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden p-3">
                <div className="w-full h-full bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center p-4">
                    <svg
                      className="mx-auto h-10 w-10 text-gray-400 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm font-medium">需要登录</p>
                    <Link
                      href={`/companion/login?redirect=${encodeURIComponent(redirectUrl)}`}
                      className="text-blue-600 text-xs hover:text-blue-700 underline mt-1 block"
                    >
                      点击登录
                    </Link>
                  </div>
                </div>
              </div>
              {/* Image number */}
              <div className="absolute bottom-5 right-5 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {index + 2} / {images.length}
              </div>
            </div>
          ))}
      </div>

      {/* Modal for full-size image viewing */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          style={{ zIndex: 9999 }}
        >
          <div className="relative max-w-5xl max-h-full">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image */}
            <img
              src={visibleImages[selectedImageIndex]?.src || images[0]?.src}
              alt={
                visibleImages[selectedImageIndex]?.alt ||
                images[0]?.alt ||
                `${chapterTitle} - 图片预览`
              }
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navigation arrows - only show for authenticated users with multiple images */}
            {visibleImages.length > 1 && isAuthenticated && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                >
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                >
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Login prompt for unauthenticated users viewing first image */}
            {!isAuthenticated && images.length > 1 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg">
                <div className="flex items-center text-sm">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>还有 {images.length - 1} 张图片需要登录查看</span>
                </div>
              </div>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {isAuthenticated ? `${selectedImageIndex + 1} / ${visibleImages.length}` : "预览图片"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}