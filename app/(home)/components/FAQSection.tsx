export default function FAQSection() {
  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">常见问题</h3>
        </div>

        <div className="space-y-4">
          {/* Q2: Is there a fee for using the platform? */}
          <details className="group border border-gray-200 rounded-lg">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50">
              <span>使用平台需要付费吗？</span>
              <svg
                className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              <p>
                我们的平台对家长来说完全免费，可以浏览和联系陪伴师。没有会员费、注册费用或访问陪伴师档案或请求联系信息的隐藏费用。
              </p>
            </div>
          </details>

          {/* Q3: How are companions verified? */}
          <details className="group border border-gray-200 rounded-lg">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50">
              <span>陪伴师如何验证？</span>
              <svg
                className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              <p className="mb-3">
                我们有严格的验证流程来确保陪伴师的安全性和质量：
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>教育资格验证</li>
                <li>背景调查和警察许可</li>
                <li>专业推荐人验证</li>
                <li>技能和认证评估</li>
              </ul>
              <p className="mt-3">
                只有通过所有验证步骤的陪伴师才能获准加入我们的平台。
              </p>
            </div>
          </details>

          {/* Q4: What happens after I request contact information? */}
          <details className="group border border-gray-200 rounded-lg">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50">
              <span>请求联系信息后会发生什么？</span>
              <svg
                className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              <p className="mb-3">一旦您请求陪伴师的联系信息：</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>我们收到您的请求并验证您的详细信息</li>
                <li>陪伴师的联系信息会安全地发送给您</li>
                <li>然后您可以直接联系陪伴师讨论您的需求</li>
              </ul>
              <p className="mt-3">
                此过程通常需要1-2个工作日来确保所有相关方的安全和隐私。
              </p>
            </div>
          </details>

          {/* Q5: Can companions update their profiles? */}
          <details className="group border border-gray-200 rounded-lg">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50">
              <span>陪伴师可以更新他们的档案吗？</span>
              <svg
                className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              <p>
                是的，陪伴师可以随时通过我们的陪伴师账户更新个人档案。这可以确保信息保持最新和准确，包括可用时间、技能专长和联系方式偏好等。
              </p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
