"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalFooter() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/companion/dashboard");

  if (isDashboard) {
    return (
      <footer className="bg-gray-100 text-gray-700 py-8 px-4 sm:px-6 lg:px-8 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="text-lg font-semibold mb-3 text-blue-600">
                MiniTeach
              </h5>
              <p className="text-gray-600 text-sm">学霸带娃 — 为家庭与学生</p>
            </div>
            <div>
              <h6 className="font-medium mb-3 text-gray-800">联系我们</h6>
              <p className="text-gray-600 text-sm">
                有问题请联系我们的客服团队
              </p>
            </div>
            <div>
              <h6 className="font-medium mb-3 text-gray-800">帮助</h6>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    关于我们
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 mt-6 pt-6 text-center">
            <p className="text-gray-500 text-sm">© 2025 学霸带娃 保留所有权利。</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5
              className="text-2xl font-bold mb-4"
              style={{ color: "#47709B" }}
            >
              MiniTeach
            </h5>
            <p className="text-gray-400">学霸带娃 — 为家庭与学生</p>
          </div>
          <div>
            <h6 className="font-semibold mb-4">服务</h6>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/companions"
                  className="hover:opacity-80"
                  style={{ color: "#AFC8DA" }}
                >
                  寻找陪伴师
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:opacity-80"
                  style={{ color: "#AFC8DA" }}
                >
                  关于我们
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold mb-4">联系我们</h6>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="text-gray-400">
                  有问题请联系我们的客服团队
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold mb-4">关注我们</h6>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="#"
                  className="hover:opacity-80"
                  style={{ color: "#AFC8DA" }}
                >
                  脸书
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:opacity-80"
                  style={{ color: "#AFC8DA" }}
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:opacity-80"
                  style={{ color: "#AFC8DA" }}
                >
                  推特
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 学霸带娃 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
}
