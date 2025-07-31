"use client";

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
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Mini-Teach 關於我們
          </h1>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            我們致力於打造一個安全、可靠的教育陪伴平台，連結優質陪伴者與有需求的家庭。
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              我們的故事
            </h2>
          </div>

          <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed space-y-6">
            <p className="text-xl text-center mb-8 text-gray-600">
              Mini-Teach 由一群熱愛教育與兒童發展的專業人士創立。
            </p>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <p className="mb-6">
                我們希望能夠為澳洲的家庭和陪伴者建立一個信任、專業的連結平台，讓每個孩子都能獲得最適合的照顧與學習。
              </p>
              <p className="mb-6">
                同時也協助陪伴者找到理想的工作機會，發揮所長，成就自我。
              </p>
              <p>
                從最初的想法到現在，Mini-Teach
                團隊持續努力，期望能為更多家庭和陪伴者帶來溫暖與支持。歡迎加入我們，一起創造更美好的未來！
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              我們的使命
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Students */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">給陪伴者</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                我們致力於幫助陪伴者找到合適的工作機會，發揮專業所長，提升自我價值。
              </p>
            </div>

            {/* For Families */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">給家庭</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                我們了解家庭對陪伴者的需求，致力於提供最合適的媒合與支持，讓每個孩子都能安心成長。
              </p>
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
            加入我們的社群
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            歡迎所有對教育陪伴有熱情的朋友和家庭加入 Mini-Teach
            社群，一起交流、成長、分享經驗。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/companions"
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-purple-700 hover:shadow-lg inline-block text-center"
            >
              查看陪伴者
            </a>
            <a
              href="#contact"
              className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold transition-all hover:bg-purple-50"
            >
              聯絡我們
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
