"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CompanionLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_name: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        setError("用户名或密码错误");
      } else {
        router.push("/companion/dashboard");
      }
    } catch (error) {
      setError("登录时发生错误，请重试");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(""); // Clear error when user types
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="text-4xl mr-3">🎓👶</div>
            <div className="flex flex-col">
              <span 
                className="text-2xl font-bold leading-tight"
                style={{ color: "#47709B" }}
              >
                学霸带娃
              </span>
              <span 
                className="text-sm font-medium leading-tight opacity-70"
                style={{ color: "#47709B" }}
              >
                MiniTeach
              </span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            陪伴师登录
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            登录您的陪伴师账户
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">
                用户名 / 邮箱
              </label>
              <input
                id="user_name"
                name="user_name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入您的邮箱或微信号"
                value={formData.user_name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入您的密码"
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
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              {isLoading ? "登录中..." : "登录"}
            </button>
          </div>

          {/* Links */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              还没有账户？{" "}
              <Link href="/companion/create" className="font-medium text-blue-600 hover:text-blue-500">
                注册成为陪伴师
              </Link>
            </p>
            <Link href="/" className="block text-sm text-gray-500 hover:text-gray-700">
              返回首页
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}