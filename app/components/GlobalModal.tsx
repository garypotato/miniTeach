"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { clearSuccess } from "@/app/store/modalSlice";
import LoadingSpinner from "./LoadingSpinner";

export default function GlobalModal() {
  const dispatch = useAppDispatch();
  const { modalType, isLoading, loadingMessage, isSuccess, successMessage } = useAppSelector((state) => state.modal);

  // Auto-close success modal after 5 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, dispatch]);

  // Don't show modal for filter type (handled by SearchFilter component)
  if (modalType === "filter" || (!isLoading && !isSuccess)) return null;

  if (isLoading) {
    return <LoadingSpinner message={loadingMessage || "加载中"} backdrop="light" />;
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
