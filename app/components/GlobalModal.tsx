"use client";

import { useEffect } from "react";
import { useModal } from "@/app/contexts/ModalContext";

export default function GlobalModal() {
  const { modalType, isLoading, loadingMessage, isSuccess, successMessage, setSuccess } = useModal();

  // Auto-close success modal after 5 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, setSuccess]);

  // Don't show modal for filter type (handled by SearchFilter component)
  if (modalType === "filter" || (!isLoading && !isSuccess)) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4 min-w-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {loadingMessage || "加载中"}
            </h3>
            <p className="text-sm text-gray-600">请稍等...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4 min-w-[300px]">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
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
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">成功</h3>
            <p className="text-sm text-gray-600">
              {successMessage || "操作完成"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
