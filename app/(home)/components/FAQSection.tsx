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
          {/* Q1: How does the platform work? */}
          <details className="group border border-gray-200 rounded-lg">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50">
              <span>平台如何运作？</span>
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
              <p className="mb-4">
                我们的平台遵循全面的5步流程来确保质量和安全：
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  <strong>陪伴师注册：</strong>{" "}
                  所有希望加入的平台陪伴师，需填写完整登记表，内容包括：就读院校与专业、年级、技能特长、证书信息（如
                  WWCC／Police
                  Check）、可配合的时间段和个人简介等，帮助我们初步了解背景。
                </li>
                <li>
                  <strong>身份验证与资料审核：</strong>{" "}
                  平台会对每位陪伴师进行资料审核，包括学生证核对、签证确认、背景证明（如蓝卡、Police
                  Check）等，必要时我们也会主动联系核实，确保资料真实可信，才能在平台展示。
                </li>
                <li>
                  <strong>家长浏览与筛选：</strong>{" "}
                  家长可以在平台自由浏览陪伴师简介，按地区、语言、擅长年龄段等条件筛选，挑选合适人选并提交联系申请。
                </li>
                <li>
                  <strong>平台协助配对与沟通：</strong>{" "}
                  平台将先审核家长身份，在确认需求后协助安排与陪伴师沟通。我们也会预先了解双方基本情况，确保初步匹配的合适性。
                </li>
                <li>
                  <strong>双方直接联系：</strong>{" "}
                  配对成功后，家长即可与陪伴师直接沟通合作方式、时间和费用安排。
                </li>
              </ol>
              <br />
              <p className="mb-4">平台不抽佣、不参与报价，合作更加灵活透明。</p>
            </div>
          </details>

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
