"use client";

import Link from "next/link";

export default function AboutContent() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <span className="text-5xl mr-4">🌱</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              关于我们 | About Mini-Teach
            </h1>
          </div>
          <p className="text-xl text-white opacity-90 mb-8 max-w-4xl mx-auto leading-relaxed">
            Mini-Teach 是一个专为教育 /
            幼教背景学生与时间人家庭打造的「教育型儿童陪伴平台」。
            <br />
            我们相信：陪伴不只是「照顾」，更是一场能启发孩子成长的互动体验。
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                这个计划由一位在澳洲就读 Early Childhood Education 的学生 Nana
                发起，来自她亲身经历的困难：
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                在学期间找不到既能发挥专业经验，又有弹性又合法的教育相关兼职。
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                而很多家庭，也找不到具备教育、有素养、又有爱心的陪伴师。
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                所以我们建立了 Mini-Teach，连接双方的需要，创造「双赢」：
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <span className="mr-3">🎯</span>
              我们的理念
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                教育专业 × 温柔陪伴
              </h3>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                社群互信 × 合理报酬
              </h3>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-4">🏠</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                家庭自由选择 × 学生弹性发挥
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-4">🎓</div>
                <h3 className="text-xl font-bold text-gray-800">
                  给学生：提供一个实践专业所学、弹性接案、合法打工的机会
                </h3>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-xl font-bold text-gray-800">
                  给家长：帮助孩子找到安全、有素养、有耐心的陪伴师
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <span className="mr-3">✅</span>
              我们的陪伴师都有：
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="font-semibold text-gray-800">
                教育／幼教系在学背景
              </h3>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl mb-4">🇦🇺</div>
              <h3 className="font-semibold text-gray-800">合法澳洲学生签证</h3>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="font-semibold text-gray-800">
                WWCC（Blue Card）或 Police Check
              </h3>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="font-semibold text-gray-800">
                丰富个人简介与经验年龄证明
              </h3>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl mb-4">🗣️</div>
              <h3 className="font-semibold text-gray-800">
                多数支援中英双语（部分提供广东话）
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* What We Don't Do Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <span className="mr-3">👀</span>
              我们不是...
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 rounded-xl p-6 text-center border border-red-100">
              <div className="text-3xl mb-4">❌</div>
              <h3 className="font-semibold text-gray-800">一般保姆媒合平台</h3>
            </div>
            <div className="bg-red-50 rounded-xl p-6 text-center border border-red-100">
              <div className="text-3xl mb-4">❌</div>
              <h3 className="font-semibold text-gray-800">没审核的社群名单</h3>
            </div>
            <div className="bg-red-50 rounded-xl p-6 text-center border border-red-100">
              <div className="text-3xl mb-4">❌</div>
              <h3 className="font-semibold text-gray-800">
                抽佣或绑约的仲介模式
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(135deg, #e6f3ff 0%, #f0f9ff 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            我们正在一步步扩大服务，并希望保持温度的真诚
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            如果你也认同我们的理念，欢迎加入 Mini-Teach！ 🤗 ↓
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/companions"
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-purple-700 hover:shadow-lg inline-block text-center"
            >
              查看陪伴师
            </Link>
            <Link
              href="/companion/create"
              className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold transition-all hover:bg-purple-50"
            >
              成为陪伴师
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
