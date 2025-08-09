"use client";

import { useState } from "react";
import Link from "next/link";

interface UnauthenticatedPreviewProps {
  images: Array<{
    id: number;
    src: string;
    alt: string | null;
    width: number;
    height: number;
  }>;
  chapterTitle: string;
  redirectUrl: string;
}

export default function UnauthenticatedPreview({
  images,
  chapterTitle,
  redirectUrl,
}: UnauthenticatedPreviewProps) {
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: First Image Preview */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-sm">
              <div 
                className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden p-2 cursor-pointer"
                onClick={handleImageClick}
              >
                <div className="w-full h-full bg-white rounded-lg shadow-sm overflow-hidden p-1">
                  <img
                    src={images[0].src}
                    alt={images[0].alt || `${chapterTitle} - 预览图片`}
                    className="w-full h-full object-cover rounded hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              {/* Preview Badge */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm">
                  免费预览
                </span>
              </div>
            </div>
          </div>

          {/* Right: Login Prompt */}
          {images.length > 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-center lg:text-left">
                <svg
                  className="mx-auto lg:mx-0 h-12 w-12 text-blue-500 mb-4"
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  还有更多内容
                </h3>
                <p className="text-gray-700 mb-4">
                  <span className="font-medium text-blue-600">
                    +{images.length - 1} 图片需要登录才能查看
                  </span>
                </p>
                <p className="text-gray-600 mb-6">
                  登录后即可查看完整的 {images.length} 张图片内容
                </p>
                <Link
                  href={`/companion/login?redirect=${encodeURIComponent(redirectUrl)}`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  登录查看完整内容
                </Link>
              </div>
            </div>
          )}
        </div>
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
            {/* Close button */}
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

            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-md">
              <img
                src={images[0].src}
                alt={images[0].alt || `${chapterTitle} - 图片预览`}
                className="max-w-full max-h-full object-contain select-none"
                onClick={(e) => e.stopPropagation()}
                draggable={false}
              />
            </div>

            {/* Login prompt for unauthenticated users viewing first image */}
            {images.length > 1 && (
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
              预览图片
            </div>
          </div>
        </div>
      )}
    </>
  );
}