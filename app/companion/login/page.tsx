"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/app/i18n";

export default function CompanionLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, translations } = useTranslation();
  const [formData, setFormData] = useState({
    user_name: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    setRedirectUrl(redirect);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        user_name: formData.user_name,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t(translations.loginPage.invalidCredentials));
      } else {
        // Redirect to the intended page or default to dashboard
        router.push(redirectUrl || "/companion/dashboard");
      }
    } catch (error) {
      setError(t(translations.loginPage.loginFailed));
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(""); // Clear error when user types
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/miniTeach.png"
              alt="MiniTeach Logo"
              width={120}
              height={60}
              className="h-15 w-auto"
              priority
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{t(translations.loginPage.title)}</h2>
          <p className="mt-2 text-sm text-gray-600">{t(translations.loginPage.title)}</p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="user_name"
                className="block text-sm font-medium text-gray-700"
              >
                {t(translations.loginPage.emailLabel)}
              </label>
              <input
                id="user_name"
                name="user_name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t(translations.loginPage.emailPlaceholder)}
                value={formData.user_name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {t(translations.loginPage.passwordLabel)}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t(translations.loginPage.passwordPlaceholder)}
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="ml-2 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              )}
              {isLoading ? t(translations.loginPage.loggingIn) : t(translations.loginPage.loginButton)}
            </button>
          </div>

          {/* Links */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              {t(translations.loginPage.noAccount)}{" "}
              <Link
                href="/companion/create"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t(translations.loginPage.registerNow)}
              </Link>
            </p>
            {redirectUrl && (
              <Link
                href={redirectUrl}
                className="block text-sm text-gray-500 hover:text-gray-700"
              >
                {t(translations.common.back)}
              </Link>
            )}
            <Link
              href="/"
              className="block text-sm text-gray-500 hover:text-gray-700"
            >
              {t(translations.companionForm.returnHome)}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}