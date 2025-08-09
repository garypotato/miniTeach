"use client";

import { useState, useEffect } from "react";
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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const publicImages = images.slice(0, 1); // First image is always public
  const privateImages = images.slice(1); // Rest require authentication
  const visibleImages = isAuthenticated ? images : publicImages;

  // Minimum swipe distance to trigger navigation
  const minSwipeDistance = 50;

  const handleImageClick = (index: number) => {
    // Allow first image preview for everyone, rest only for authenticated users
    if (index === 0 || isAuthenticated) {
      setSelectedImageIndex(index);
      setShowModal(true);
    }
  };

  const handlePrevious = () => {
    if (selectedImageIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setSelectedImageIndex(selectedImageIndex - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleNext = () => {
    if (selectedImageIndex < visibleImages.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setSelectedImageIndex(selectedImageIndex + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleDirectNavigation = (index: number) => {
    if (index !== selectedImageIndex && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setSelectedImageIndex(index);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowModal(false);
    } else if (e.key === "ArrowLeft" && isAuthenticated && visibleImages.length > 1) {
      handlePrevious();
    } else if (e.key === "ArrowRight" && isAuthenticated && visibleImages.length > 1) {
      handleNext();
    }
  };

  // Touch handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isAuthenticated && visibleImages.length > 1) {
      if (isLeftSwipe) {
        handleNext();
      } else if (isRightSwipe) {
        handlePrevious();
      }
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

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
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          style={{ zIndex: 9999 }}
        >
          <div className="relative w-[90%] h-[90%] md:w-[70%] md:h-[70%] flex items-center justify-center bg-black bg-opacity-40 rounded-lg backdrop-blur-sm p-4"
               onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - repositioned for better mobile access */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white hover:text-gray-300 hover:bg-opacity-70 transition-all"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image Container with touch support and animation */}
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-md"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  key={`image-${selectedImageIndex}`}
                  src={visibleImages[selectedImageIndex]?.src || images[0]?.src}
                  alt={
                    visibleImages[selectedImageIndex]?.alt ||
                    images[0]?.alt ||
                    `${chapterTitle} - 图片预览`
                  }
                  className={`max-w-full max-h-full object-contain select-none transition-all duration-300 ease-out ${
                    isAnimating 
                      ? 'opacity-0 scale-95' 
                      : 'opacity-100 scale-100'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                  draggable={false}
                />
              </div>
            </div>

            {/* Navigation arrows - only show for authenticated users with multiple images */}
            {visibleImages.length > 1 && isAuthenticated && (
              <>
                {/* Previous button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className={`absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 md:p-3 text-white transition-all z-10 ${
                    selectedImageIndex === 0 || isAnimating
                      ? 'opacity-30 cursor-not-allowed' 
                      : 'hover:text-gray-300 hover:bg-opacity-70'
                  }`}
                  disabled={selectedImageIndex === 0 || isAnimating}
                >
                  <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Next button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className={`absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 md:p-3 text-white transition-all z-10 ${
                    selectedImageIndex === visibleImages.length - 1 || isAnimating
                      ? 'opacity-30 cursor-not-allowed' 
                      : 'hover:text-gray-300 hover:bg-opacity-70'
                  }`}
                  disabled={selectedImageIndex === visibleImages.length - 1 || isAnimating}
                >
                  <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Mobile swipe indicator */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs md:hidden">
                  滑动浏览
                </div>
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

            {/* Image counter with thumbnail indicators */}
            <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-10 transition-all duration-200 ${
              isAnimating ? 'scale-95 opacity-75' : 'scale-100 opacity-100'
            }`}>
              {isAuthenticated ? `${selectedImageIndex + 1} / ${visibleImages.length}` : "预览图片"}
            </div>

            {/* Thumbnail indicators for authenticated users with multiple images */}
            {visibleImages.length > 1 && isAuthenticated && visibleImages.length <= 10 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {visibleImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectNavigation(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === selectedImageIndex 
                        ? 'bg-white' 
                        : isAnimating 
                          ? 'bg-white bg-opacity-30 cursor-not-allowed'
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                    }`}
                    disabled={isAnimating}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}