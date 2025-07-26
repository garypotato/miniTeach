"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

export default function GlobalModal() {
  const { modalType, isLoading, loadingMessage } = useSelector(
    (state: RootState) => state.modal
  );

  // Only show loading modal, not filter modal (filter modal is handled by SearchFilter component)
  if (!isLoading || modalType === "filter") return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4 min-w-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {loadingMessage || "Loading..."}
          </h3>
          <p className="text-sm text-gray-600">
            Please wait while we process your request
          </p>
        </div>
      </div>
    </div>
  );
}
