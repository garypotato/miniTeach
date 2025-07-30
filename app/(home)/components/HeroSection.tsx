"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative py-20 px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          找到您的完美
          <span className="block text-white opacity-90">儿童伙伴</span>
        </h2>
        <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
          与合格、关爱的教育工作者和伙伴建立联系，他们将在安全、支持的环境中培养您孩子的成长和发展。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/companions"
            className="bg-white text-purple-700 px-8 py-3 rounded-full font-semibold transition-all hover:bg-gray-100 hover:shadow-lg inline-block text-center"
          >
            浏览伙伴
          </Link>
          <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-white hover:text-purple-700">
            了解更多
          </button>
        </div>
      </div>
    </section>
  );
}
