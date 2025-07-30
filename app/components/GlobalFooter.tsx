"use client";

import Link from "next/link";

export default function GlobalFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5
              className="text-2xl font-bold mb-4"
              style={{ color: "#47709B" }}
            >
              迷你教学
            </h5>
            <p className="text-gray-400">您的AI伙伴智能推荐平台</p>
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
                  寻找伙伴
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
                  Facebook
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
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 迷你教学. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
}
