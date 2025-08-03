"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { clearSuccess, closeModal, setSuccess } from "@/app/store/modalSlice";
import LoadingSpinner from "./LoadingSpinner";
import LoginCredentialsForm from "./LoginCredentialsForm";
import PasswordConfirmationForm from "./PasswordConfirmationForm";
import { updateCompanionProfile } from "@/lib/shopify/companion-actions";
import { getCurrentEditImages, clearCurrentEditImages } from "@/app/companion/dashboard/profile/ProfilePageClient";

export default function GlobalModal() {
  const dispatch = useAppDispatch();
  const { modalType, modalOpen, modalData, isLoading, loadingMessage, isSuccess, successMessage } = useAppSelector((state) => state.modal);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close modal if clicking on the backdrop (not the modal content)
    if (e.target === e.currentTarget && (modalType === "login_credentials" || modalType === "password_confirmation")) {
      dispatch(closeModal());
    }
  };

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
  if (modalType === "filter" || (!isLoading && !isSuccess && !modalOpen)) return null;

  if (isLoading) {
    return <LoadingSpinner message={loadingMessage || "加载中"} backdrop="dark" />;
  }

  if (modalType === "login_credentials" && modalOpen) {
    return (
      <div 
        className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-40 p-4"
        onClick={handleBackdropClick}
      >
        <LoginCredentialsForm onClose={() => dispatch(closeModal())} />
      </div>
    );
  }

  if (modalType === "password_confirmation" && modalOpen) {
    return (
      <div 
        className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-40 p-4"
        onClick={handleBackdropClick}
      >
        <PasswordConfirmationForm 
          key="password-confirmation-form"
          onClose={() => dispatch(closeModal())} 
          onConfirm={async (password) => {
            const formData = modalData?.formData as {
              first_name: string;
              last_name: string;
              user_name: string;
              major: string;
              location: string;
              age: string;
              description: string;
              education: string;
              language: string;
              blue_card: string;
              police_check: string;
              skill: string;
              certification: string;
              age_group: string;
              availability: string;
            };
            const imagesToRemove = modalData?.imagesToRemove as number[] | undefined;
            
            if (formData) {
              // Get current edit images from module-level storage
              const images = getCurrentEditImages();
              
              // Log images for debugging
              if (images.length > 0) {
                console.log(`Profile update includes ${images.length} new images`);
              }
              if (imagesToRemove && imagesToRemove.length > 0) {
                console.log(`Profile update will remove ${imagesToRemove.length} existing images at indices:`, imagesToRemove);
              }
              
              const result = await updateCompanionProfile(formData, password, images, imagesToRemove);
              
              if (result.success) {
                // Clear the uploaded images after successful update
                clearCurrentEditImages();
                
                dispatch(setSuccess({ 
                  success: true, 
                  message: result.message || "档案更新成功" 
                }));
                // Reload page after success modal closes
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              } else {
                // Don't close modal on error, show error in the password form
                throw new Error(result.error || "更新失败");
              }
            }
          }}
        />
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
