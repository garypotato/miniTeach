"use client";

import Link from "next/link";
import { ImageGallery } from "./ImageGallery";
import MetafieldsDisplay from "./MetafieldsDisplay";
import { Companion, CompanionImage } from "../../types/companion";

interface CompanionDetailContentProps {
  companion: Companion;
  images: CompanionImage[];
}

export default function CompanionDetailContent({
  companion,
  images,
}: CompanionDetailContentProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <ImageGallery images={images} companionTitle={companion.title} />

        {/* Companion Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {companion.title}
            </h1>
            <div className="flex items-center space-x-4 mb-6">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: "#AFC8DA", color: "#47709B" }}
              >
                儿童陪伴师
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                可用
              </span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">关于我</h3>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {companion.metafields?.description || "暂无描述"}
            </div>
          </div>

          {/* Companion Details with Metafields */}
          {companion.metafields && (
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                资格与详情
              </h3>
              <MetafieldsDisplay metafields={companion.metafields} />
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              联系我们
            </h3>
            <p className="text-gray-600 mb-6">
              为保护我们陪伴师的隐私，联系信息是私下提供的。请与我们联系以请求联系详情。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="flex-1 text-white px-6 py-3 rounded-full font-semibold transition-colors hover:opacity-90 text-center"
                style={{ backgroundColor: "#47709B" }}
              >
                获取联系信息
              </Link>
              <Link
                href="/companions"
                className="flex-1 border-2 px-6 py-3 rounded-full font-semibold transition-colors hover:bg-gray-50 text-center"
                style={{ borderColor: "#47709B", color: "#47709B" }}
              >
                所有陪伴师
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Companions */}
      <section className="py-16 mt-16 bg-white border-t rounded-2xl">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            认识我们的陪伴师
          </h3>
          <p className="text-lg text-gray-600">
            发现准备支持您孩子成长旅程的关爱专业人士
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/companions"
            className="inline-flex items-center text-white px-8 py-3 rounded-full font-semibold transition-colors hover:opacity-90"
            style={{ backgroundColor: "#47709B" }}
          >
            所有陪伴师
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
