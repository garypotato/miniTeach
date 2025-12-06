"use client";

import { useState } from "react";
import { updateCompanionLoginCredentials } from "@/lib/shopify/companion-actions";
import { useTranslation } from "@/app/i18n";

interface LoginCredentialsFormProps {
  onClose: () => void;
}

export default function LoginCredentialsForm({
  onClose,
}: LoginCredentialsFormProps) {
  const { t, translations } = useTranslation();
  const [formData, setFormData] = useState({
    user_name: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate on client side first
      if (!formData.user_name || !formData.password || !formData.confirm_password) {
        setError(t(translations.loginCredentials.allFieldsRequired));
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirm_password) {
        setError(t(translations.loginCredentials.passwordsNotMatch));
        setIsLoading(false);
        return;
      }

      // Call server action
      const result = await updateCompanionLoginCredentials(
        formData.user_name,
        formData.password,
        formData.confirm_password
      );

      if (!result.success) {
        throw new Error(result.error || t(translations.loginCredentials.updateFailed));
      }

      if (result.success) {
        // Success - close modal and refresh page
        onClose();
        window.location.reload();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : t(translations.loginCredentials.updateFailed));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t(translations.loginCredentials.title)}
        </h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="w-5 h-5 text-yellow-400 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="ml-2 text-sm text-yellow-700">
              {t(translations.loginCredentials.warningMessage)}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t(translations.loginCredentials.emailLabel)}
          </label>
          <input
            type="email"
            name="user_name"
            value={formData.user_name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t(translations.loginCredentials.emailPlaceholder)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t(translations.loginCredentials.passwordLabel)}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t(translations.loginCredentials.passwordPlaceholder)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t(translations.loginCredentials.confirmPasswordLabel)}
          </label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t(translations.loginCredentials.confirmPasswordPlaceholder)}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t(translations.loginCredentials.saving) : t(translations.loginCredentials.save)}
          </button>
        </div>
      </form>
    </div>
  );
}
