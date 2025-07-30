"use client";

import { useEffect, useRef } from "react";

export default function HowItWorksSection() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const updateLineHeights = () => {
      stepRefs.current.forEach((stepElement, index) => {
        if (stepElement && index < 4) {
          // Only for steps 1-4 (they have lines)
          const contentElement = stepElement.querySelector(
            ".step-content"
          ) as HTMLElement;
          const lineElement = stepElement.querySelector(
            ".connection-line"
          ) as HTMLElement;

          if (contentElement && lineElement) {
            const contentHeight = contentElement.offsetHeight;
            const circleHeight = 48; // 12 * 4 = 48px (w-12 h-12)
            const minLineHeight = 16; // Minimum line height
            const calculatedHeight = Math.max(
              minLineHeight,
              contentHeight - circleHeight + 16
            );

            lineElement.style.height = `${calculatedHeight}px`;
          }
        }
      });
    };

    // Update on mount and window resize
    updateLineHeights();
    window.addEventListener("resize", updateLineHeights);

    // Cleanup
    return () => window.removeEventListener("resize", updateLineHeights);
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            如何运作
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            找到完美伙伴的简单步�?
          </p>
        </div>

        <div className="relative">
          {/* Large Desktop Layout - Horizontal Flow (1280px+) */}
          <div className="hidden xl:block">
            <div className="flex items-start justify-between relative">
              {/* Connection Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 -translate-y-1/2 z-0"></div>

              {/* Step 1 */}
              <div className="relative bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100 w-52 h-80 z-10">
                <div className="text-center h-full flex flex-col">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: "#AFC8DA" }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "#47709B" }}
                    >
                      1
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    伙伴注册
                  </h4>
                  <p className="text-sm text-gray-600 flex-1">
                    潜在伙伴完成全面的入职问卷调查，涵盖教育、技能和认证�?
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100 w-52 h-80 z-10">
                <div className="text-center h-full flex flex-col">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: "#AFC8DA" }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "#47709B" }}
                    >
                      2
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    验证流程
                  </h4>
                  <p className="text-sm text-gray-600 flex-1">
                    我们的支持团队彻底审查每份申请。只有经过验证的伙伴才会在平台上列出�?
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100 w-52 h-80 z-10">
                <div className="text-center h-full flex flex-col">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: "#AFC8DA" }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "#47709B" }}
                    >
                      3
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    浏览探索
                  </h4>
                  <p className="text-sm text-gray-600 flex-1">
                    家长浏览详细的伙伴档案，为孩子的需求找到完美匹配�?
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100 w-52 h-80 z-10">
                <div className="text-center h-full flex flex-col">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: "#AFC8DA" }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "#47709B" }}
                    >
                      4
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    申请联系
                  </h4>
                  <p className="text-sm text-gray-600 flex-1">
                    感兴趣的家长联系我们的支持团队，团队会验证身份并确保符合可靠性标准�?
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100 w-52 h-80 z-10">
                <div className="text-center h-full flex flex-col">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: "#AFC8DA" }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "#47709B" }}
                    >
                      5
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    私密介绍
                  </h4>
                  <p className="text-sm text-gray-600 flex-1">
                    一旦获得批准，伙伴的联系信息将私下分享，以便直接沟通�?
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Medium Desktop Layout - 2x3 Grid (1024px - 1279px) */}
          <div className="hidden lg:block xl:hidden">
            <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
              {/* Row 1 - Steps 1 & 2 */}
              <div className="relative bg-white p-4 rounded-lg shadow-md border border-blue-100 h-44">
                <div className="text-center h-full flex flex-col">
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: "#AFC8DA" }}
                  >
                    <span
                      className="text-xl font-bold"
                      style={{ color: "#47709B" }}
                    >
                      1
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">
                    {"���ע��"}
                  </h4>
                  <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                    {"Ǳ�ڻ�����ȫ�����ְ�ʾ����飬���ǽ��������ܺ���֤��"}
                  </p>
                </div>
              </div>

              <div className="relative bg-white p-4 rounded-lg shadow-md border border-blue-100 h-44">
                <div className="text-center h-full flex flex-col">
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: "#AFC8DA" }}
                  >
                    <span
                      className="text-xl font-bold"
                      style={{ color: "#47709B" }}
                    >
                      2
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">
                    {"��֤����"}
                  </h4>
                  <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                    {"���ǵ�֧���Ŷӳ������ÿ�����롣ֻ�о�����֤�Ļ��Ż���ƽ̨���г���"}
                  </p>
                </div>
              </div>

              {/* Row 2 - Steps 3 & 4 */}
              <div className="relative bg-white p-4 rounded-lg shadow-md border border-blue-100 h-44">
                <div className="text-center h-full flex flex-col">
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: "#AFC8DA" }}
                  >
                    <span
                      className="text-xl font-bold"
                      style={{ color: "#47709B" }}
                    >
                      3
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">
                    {"���̽��"}
                  </h4>
                  <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                    {"�ҳ������ϸ�Ļ�鵵����Ϊ���ӵ������ҵ�����ƥ�䡣"}
                  </p>
                </div>
              </div>

              <div className="relative bg-white p-4 rounded-lg shadow-md border border-blue-100 h-44">
                <div className="text-center h-full flex flex-col">
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: "#AFC8DA" }}
                  >
                    <span
                      className="text-xl font-bold"
                      style={{ color: "#47709B" }}
                    >
                      4
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">
                    {"������ϵ"}
                  </h4>
                  <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                    {"����Ȥ�ļҳ���ϵ���ǵ�֧���Ŷӣ��Ŷӻ���֤���ݲ�ȷ�����Ͽɿ��Ա�׼��"}
                  </p>
                </div>
              </div>

              {/* Row 3 - Step 5 centered */}
              <div className="col-span-2 flex justify-center">
                <div className="relative bg-white p-4 rounded-lg shadow-md border border-blue-100 h-44 w-64">
                  <div className="text-center h-full flex flex-col">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: "#AFC8DA" }}
                    >
                      <span
                        className="text-xl font-bold"
                        style={{ color: "#47709B" }}
                      >
                        5
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-gray-900 mb-2">
                      {"˽�ܽ���"}
                    </h4>
                    <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                      {"һ�������׼��������ϵ��Ϣ��˽�·������Ա�ֱ�ӹ�ͨ��"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile & Tablet Layout - Vertical Flow */}
          <div className="lg:hidden">
            <div className="space-y-4">
              {/* Step 1 */}
              <div
                ref={(el) => {
                  stepRefs.current[0] = el;
                }}
                className="relative"
              >
                <div className="flex items-start step-content">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                    style={{ backgroundColor: "#AFC8DA" }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{ color: "#47709B" }}
                    >
                      1
                    </span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {"���ע��"}
                    </h4>
                    <p className="text-gray-600">
                      {"Ǳ�ڻ�����ȫ�����ְ�ʾ����飬���ǽ��������ܺ���֤��"}
                    </p>
                  </div>
                </div>
                {/* Dynamic connection line */}
                <div
                  className="connection-line absolute left-6 top-12 w-0.5 bg-blue-300 transform -translate-x-0.5"
                  style={{ height: "40px" }}
                ></div>
              </div>

              {/* Step 2 */}
              <div
                ref={(el) => {
                  stepRefs.current[1] = el;
                }}
                className="relative"
              >
                <div className="flex items-start step-content">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                    style={{ backgroundColor: "#AFC8DA" }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{ color: "#47709B" }}
                    >
                      2
                    </span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {"��֤����"}
                    </h4>
                    <p className="text-gray-600">
                      {"���ǵ�֧���Ŷӳ������ÿ�����롣ֻ�о�����֤�Ļ��Ż���ƽ̨���г���"}
                    </p>
                  </div>
                </div>
                {/* Dynamic connection line */}
                <div
                  className="connection-line absolute left-6 top-12 w-0.5 bg-blue-300 transform -translate-x-0.5"
                  style={{ height: "40px" }}
                ></div>
              </div>

              {/* Step 3 */}
              <div
                ref={(el) => {
                  stepRefs.current[2] = el;
                }}
                className="relative"
              >
                <div className="flex items-start step-content">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                    style={{ backgroundColor: "#AFC8DA" }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{ color: "#47709B" }}
                    >
                      3
                    </span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {"���̽��"}
                    </h4>
                    <p className="text-gray-600">
                      {"�ҳ������ϸ�Ļ�鵵����Ϊ���ӵ������ҵ�����ƥ�䡣"}
                    </p>
                  </div>
                </div>
                {/* Dynamic connection line */}
                <div
                  className="connection-line absolute left-6 top-12 w-0.5 bg-blue-300 transform -translate-x-0.5"
                  style={{ height: "40px" }}
                ></div>
              </div>

              {/* Step 4 */}
              <div
                ref={(el) => {
                  stepRefs.current[3] = el;
                }}
                className="relative"
              >
                <div className="flex items-start step-content">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                    style={{ backgroundColor: "#AFC8DA" }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{ color: "#47709B" }}
                    >
                      4
                    </span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {"������ϵ"}
                    </h4>
                    <p className="text-gray-600">
                      {"����Ȥ�ļҳ���ϵ���ǵ�֧���Ŷӣ��Ŷӻ���֤���ݲ�ȷ�����Ͽɿ��Ա�׼��"}
                    </p>
                  </div>
                </div>
                {/* Dynamic connection line */}
                <div
                  className="connection-line absolute left-6 top-12 w-0.5 bg-blue-300 transform -translate-x-0.5"
                  style={{ height: "40px" }}
                ></div>
              </div>

              {/* Step 5 */}
              <div
                ref={(el) => {
                  stepRefs.current[4] = el;
                }}
                className="relative"
              >
                <div className="flex items-start step-content">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                    style={{ backgroundColor: "#AFC8DA" }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{ color: "#47709B" }}
                    >
                      5
                    </span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {"˽�ܽ���"}
                    </h4>
                    <p className="text-gray-600">
                      {"һ�������׼��������ϵ��Ϣ��˽�·������Ա�ֱ�ӹ�ͨ��"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-50 border border-blue-200">
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-blue-800 font-medium">
              {"��ƽ̨����ȡ�κη�����á�"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
