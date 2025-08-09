import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "联系我们 - MiniTeach",
  description: "联系MiniTeach获取专业的儿童陪伴服务支持，扫描微信二维码添加客服",
};

export default function ContactPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            联系我们
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们随时准备为您提供专业的儿童陪伴服务支持。无论您是家长寻找合适的陪伴师，还是希望成为我们的陪伴师，都欢迎与我们联系。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* WeChat Contact Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 order-2 lg:order-1">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                微信联系我们
              </h2>
              
              <p className="text-gray-600 mb-8">
                扫描下方二维码添加我们的客服微信，获取即时的专业咨询服务
              </p>

              {/* WeChat QR Code */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-gray-100">
                  <Image
                    src="/weChat_code.jpg"
                    alt="MiniTeach 微信二维码"
                    width={280}
                    height={280}
                    className="rounded-lg"
                    priority
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                扫描上面的QR Code图案，加我为朋友。
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                平台服务说明
              </h2>
              
              <div className="space-y-8">
                {/* Privacy Protection */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3">隐私保护承诺</h3>
                      <p className="text-gray-700 leading-relaxed">
                        我们严格保护每一位陪伴师的个人信息安全。所有联系方式等敏感信息均受到平台隐私政策保护，不会公开展示。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verification */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3">真人身份验证</h3>
                      <p className="text-gray-700 leading-relaxed">
                        每位陪伴师都通过严格的身份验证，包括蓝卡/WWCC认证、学历背景核实等多重审核，确保服务的专业性和可靠性。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Process */}
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3">专业咨询服务</h3>
                      <p className="text-gray-700 leading-relaxed">
                        如需了解特定陪伴师的更多信息，请通过下方微信二维码添加我们的客服。我们将根据您的需求进行个性化匹配推荐。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Areas */}
                <div className="border-t pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">服务覆盖区域</h3>
                      <p className="text-gray-600 mb-2">澳大利亚主要城市及周边地区</p>
                      <div className="flex flex-wrap gap-2">
                        {["悉尼", "墨尔本", "布里斯班", "黄金海岸", "阿德莱德"].map((city) => (
                          <span key={city} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Help */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">需要帮助？</h3>
              <div className="space-y-3 text-sm">
                <p>✨ <strong>家长：</strong>寻找合适的陪伴师，获取专业建议</p>
                <p>🌟 <strong>陪伴师：</strong>注册申请，了解工作机会</p>
                <p>🎯 <strong>合作伙伴：</strong>商务合作，平台对接</p>
                <p>❓ <strong>其他问题：</strong>平台使用，技术支持</p>
              </div>
              <p className="mt-6 text-blue-100">
                我们的专业团队随时准备为您提供最优质的服务体验
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 lg:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            常见问题
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                如何找到合适的陪伴师？
              </h3>
              <p className="text-gray-600 text-sm">
                您可以通过我们的筛选功能按地区、年龄组、技能等条件搜索，或联系我们的客服为您推荐最合适的陪伴师。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                如何成为陪伴师？
              </h3>
              <p className="text-gray-600 text-sm">
                点击`成为陪伴师`按钮填写申请表，我们的团队会审核您的资质并在48小时内给予回复。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                服务费用如何计算？
              </h3>
              <p className="text-gray-600 text-sm">
                我们的平台完全免费，不向家长或陪伴师收取任何费用。所有服务费用由家长与陪伴师直接协商确定。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                安全保障措施有哪些？
              </h3>
              <p className="text-gray-600 text-sm">
                所有陪伴师都经过严格的背景调查、具备相关证书（如蓝卡/WWCC），确保您的孩子安全。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}