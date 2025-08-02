import Image from "next/image";
import { getCompanionProfile } from "@/app/actions/profile";

function formatArrayField(field: string[] | undefined): string {
  if (!field || field.length === 0) return "未设置";
  return field.join(", ");
}

function getBooleanDisplay(value: string | undefined): string {
  if (!value) return "未设置";
  switch (value.toLowerCase()) {
    case "yes":
    case "true":
    case "是":
      return "是";
    case "no":
    case "false":
    case "否":
      return "否";
    case "pending":
    case "申请中":
      return "申请中";
    default:
      return value;
  }
}

export default async function CompanionProfile() {
  try {
    const profile = await getCompanionProfile();

    return (
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">个人档案</h1>
          <p className="mt-2 text-gray-600">查看您的陪伴师档案信息</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 lg:order-1 order-1 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">基本信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">姓氏</label>
                  <p className="text-gray-900">{profile.metafields?.last_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">名字</label>
                  <p className="text-gray-900">{profile.metafields?.first_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                  <p className="text-gray-900">{profile.metafields?.user_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">专业</label>
                  <p className="text-gray-900">{profile.metafields?.major}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">位置</label>
                  <p className="text-gray-900">{profile.metafields?.location}</p>
                </div>
                {profile.metafields?.age && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">年龄</label>
                    <p className="text-gray-900">{profile.metafields.age}</p>
                  </div>
                )}
                {profile.metafields?.wechat_id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">微信号</label>
                    <p className="text-gray-900">{profile.metafields.wechat_id}</p>
                  </div>
                )}
              </div>
            </div>

            {/* About Me */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">关于我</h2>
              <div 
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: profile.body_html }}
              />
            </div>

            {/* Skills & Qualifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">技能与资质</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">教育背景</label>
                  <p className="text-gray-900">{profile.metafields?.education || "未设置"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">语言能力</label>
                  <p className="text-gray-900">{formatArrayField(profile.metafields?.language)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">蓝卡/WWCC</label>
                  <p className="text-gray-900">{getBooleanDisplay(profile.metafields?.blue_card)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">警察检查</label>
                  <p className="text-gray-900">{getBooleanDisplay(profile.metafields?.police_check)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">技能</label>
                  <p className="text-gray-900">{formatArrayField(profile.metafields?.skill)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">认证</label>
                  <p className="text-gray-900">{formatArrayField(profile.metafields?.certification)}</p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">偏好设置</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">偏好年龄组</label>
                  <p className="text-gray-900">{formatArrayField(profile.metafields?.age_group)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">可用性</label>
                  <p className="text-gray-900">{formatArrayField(profile.metafields?.availability)}</p>
                </div>
              </div>
            </div>

            {/* Update Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">更新档案</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    如需更新档案信息，请联系客服团队。档案更新需要重新审核。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Images */}
          <div className="lg:col-span-1 lg:order-2 order-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">档案照片</h2>
              {profile.images && profile.images.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                  {profile.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={image.src}
                        alt={image.alt || `Profile image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  暂无照片
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="ml-2 text-sm text-red-700">
              {error instanceof Error ? error.message : "获取档案信息时发生错误"}
            </p>
          </div>
        </div>
      </div>
    );
  }
}