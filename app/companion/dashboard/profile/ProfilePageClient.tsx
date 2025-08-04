"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/app/store/hooks";
import { openModal } from "@/app/store/modalSlice";
import FormField from "@/app/companion/create/components/FormField";
import TagsInput from "@/app/companion/create/components/TagsInput";
import ImageUpload from "@/app/companion/create/components/ImageUpload";

// Module-level storage for edit images (outside Redux)
let currentEditImages: File[] = [];

// Export function to access current edit images
export const getCurrentEditImages = (): File[] => currentEditImages;

// Export function to clear current edit images (called after successful update)
export const clearCurrentEditImages = (): void => {
  currentEditImages = [];
};

interface ProfileMetafields {
  user_name?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  wechat_id?: string;
  major?: string;
  education?: string;
  language?: string[];
  age?: string;
  location?: string;
  age_group?: string[];
  blue_card?: string;
  police_check?: string;
  skill?: string[];
  certification?: string[];
  availability?: string[];
  description?: string;
}

interface ProfileData {
  id: number;
  title: string;
  images?: Array<{
    src: string;
    alt: string | null;
  }>;
  metafields?: ProfileMetafields;
}

interface ProfilePageClientProps {
  profile: ProfileData;
}

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

export default function ProfilePageClient({ profile }: ProfilePageClientProps) {
  const dispatch = useAppDispatch();
  const [isEditMode, setIsEditMode] = useState(false);

  // Original data for comparison
  const originalFormData = {
    first_name: profile.metafields?.first_name || "",
    last_name: profile.metafields?.last_name || "",
    user_name: profile.metafields?.user_name || "",
    major: profile.metafields?.major || "",
    location: profile.metafields?.location || "",
    age: profile.metafields?.age || "",
    description: profile.metafields?.description || "",
    education: profile.metafields?.education || "",
    language: Array.isArray(profile.metafields?.language)
      ? profile.metafields.language.join(", ")
      : "",
    blue_card: profile.metafields?.blue_card || "",
    police_check: profile.metafields?.police_check || "",
    skill: Array.isArray(profile.metafields?.skill)
      ? profile.metafields.skill.join(", ")
      : "",
    certification: Array.isArray(profile.metafields?.certification)
      ? profile.metafields.certification.join(", ")
      : "",
    age_group: Array.isArray(profile.metafields?.age_group)
      ? profile.metafields.age_group.join(", ")
      : "",
    availability: Array.isArray(profile.metafields?.availability)
      ? profile.metafields.availability.join(", ")
      : "",
  };

  const [editFormData, setEditFormData] = useState(originalFormData);
  const [editImages, setEditImages] = useState<File[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([]);

  // Check if form data has been modified (including images)
  const hasChanges =
    Object.keys(originalFormData).some(
      (key) =>
        editFormData[key as keyof typeof editFormData] !==
        originalFormData[key as keyof typeof originalFormData]
    ) ||
    editImages.length > 0 ||
    imagesToRemove.length > 0;

  // Handle form field changes
  const handleFieldChange = (name: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image changes
  const handleImageChange = (images: File[]) => {
    setEditImages(images);
    currentEditImages = images;
  };

  // Handle existing image removal
  const handleRemoveExistingImage = (imageIndex: number) => {
    setImagesToRemove((prev) => [...prev, imageIndex]);
  };

  // Handle restoring removed image
  const handleRestoreExistingImage = (imageIndex: number) => {
    setImagesToRemove((prev) => prev.filter((index) => index !== imageIndex));
  };

  // Reset form data to original when canceling
  const handleCancelEdit = () => {
    setEditFormData(originalFormData);
    setEditImages([]);
    setImagesToRemove([]);
    currentEditImages = [];
    setIsEditMode(false);
  };

  // Check if user has login credentials for editing
  const hasUserName = profile.metafields?.user_name;
  const hasPassword = profile.metafields?.password;
  const canEdit = hasUserName && hasPassword;

  useEffect(() => {
    // Check if user_name or password are missing - show modal if EITHER is missing
    if (!hasUserName || !hasPassword) {
      dispatch(openModal({ type: "login_credentials" }));
    }
  }, [hasUserName, hasPassword, dispatch]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">个人档案</h1>
          <p className="mt-2 text-gray-600">
            {isEditMode
              ? "编辑您的陪伴师档案信息"
              : canEdit
              ? "查看您的陪伴师档案信息"
              : "请先设置登录邮箱和密码后才能编辑档案"}
          </p>
        </div>
        <div className="flex gap-3">
          {isEditMode ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                取消
              </button>
              <button
                onClick={() =>
                  dispatch(
                    openModal({
                      type: "password_confirmation",
                      data: {
                        formData: editFormData,
                        imagesToRemove: imagesToRemove,
                      },
                    })
                  )
                }
                disabled={!hasChanges}
                className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  hasChanges
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                更新档案
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              disabled={!canEdit}
              className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                canEdit
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              编辑档案
            </button>
          )}
        </div>
      </div>

      {/* Login Credentials Alert - Show when credentials are missing */}
      {!canEdit && (
        <div className="mb-8 bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-orange-800">
                需要设置登录凭据
              </h3>
              <p className="mt-2 text-sm text-orange-700">
                为了能够编辑和更新您的档案信息，您需要先设置登录邮箱和密码。这些凭据将用于验证您的身份。
              </p>
              <div className="mt-4">
                <button
                  onClick={() =>
                    dispatch(openModal({ type: "login_credentials" }))
                  }
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                >
                  设置登录凭据
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 lg:order-1 order-1 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              基本信息
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isEditMode ? (
                <>
                  <FormField
                    label="姓氏"
                    name="last_name"
                    type="text"
                    value={editFormData.last_name}
                    onChange={handleFieldChange}
                    placeholder="请输入姓氏"
                    required
                  />
                  <FormField
                    label="名字"
                    name="first_name"
                    type="text"
                    value={editFormData.first_name}
                    onChange={handleFieldChange}
                    placeholder="请输入名字"
                    required
                  />
                  <FormField
                    label="邮箱"
                    name="user_name"
                    type="email"
                    value={editFormData.user_name}
                    onChange={handleFieldChange}
                    placeholder="请输入邮箱地址"
                    required
                  />
                  <FormField
                    label="专业"
                    name="major"
                    type="text"
                    value={editFormData.major}
                    onChange={handleFieldChange}
                    placeholder="请输入您的专业"
                    required
                  />
                  <FormField
                    label="位置"
                    name="location"
                    type="select"
                    value={editFormData.location}
                    onChange={handleFieldChange}
                    required
                    options={[
                      { value: "", label: "选择您的城市..." },
                      { value: "sydney", label: "Sydney" },
                      { value: "melbourne", label: "Melbourne" },
                      { value: "brisbane", label: "Brisbane" },
                      { value: "goldCoast", label: "Gold Coast" },
                      { value: "adelaide", label: "Adelaide" },
                    ]}
                  />
                  <FormField
                    label="年龄"
                    name="age"
                    type="number"
                    value={editFormData.age}
                    onChange={handleFieldChange}
                    placeholder="请输入年龄"
                  />
                  <FormField
                    label="微信号"
                    name="wechat_id"
                    type="text"
                    value={profile.metafields?.wechat_id || ""}
                    onChange={() => {}} // Empty function since it's disabled
                    placeholder="微信号不可编辑"
                    disabled
                  />
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓氏
                    </label>
                    <p className="text-gray-900">
                      {profile.metafields?.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      名字
                    </label>
                    <p className="text-gray-900">
                      {profile.metafields?.first_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱
                    </label>
                    <p className="text-gray-900">
                      {profile.metafields?.user_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      专业
                    </label>
                    <p className="text-gray-900">{profile.metafields?.major}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      位置
                    </label>
                    <p className="text-gray-900">
                      {profile.metafields?.location}
                    </p>
                  </div>
                  {profile.metafields?.age && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        年龄
                      </label>
                      <p className="text-gray-900">{profile.metafields.age}</p>
                    </div>
                  )}
                  {profile.metafields?.wechat_id && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        微信号
                      </label>
                      <p className="text-gray-900">
                        {profile.metafields.wechat_id}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* About Me */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">关于我</h2>
            {isEditMode ? (
              <FormField
                label="个人介绍"
                name="description"
                type="textarea"
                value={editFormData.description}
                onChange={handleFieldChange}
                placeholder="请介绍一下您自己，包括您的经验、教育背景、兴趣爱好等"
                required
                rows={6}
              />
            ) : (
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {profile.metafields?.description || "未设置"}
              </div>
            )}
          </div>

          {/* Skills & Qualifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              技能与资质
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isEditMode ? (
                <>
                  <FormField
                    label="教育背景"
                    name="education"
                    type="text"
                    value={editFormData.education}
                    onChange={handleFieldChange}
                    placeholder="请输入教育背景"
                  />
                  <TagsInput
                    label="语言能力"
                    name="language"
                    value={editFormData.language}
                    onChange={handleFieldChange}
                    placeholder="输入语言并按Enter或逗号添加"
                  />
                  <FormField
                    label="蓝卡/WWCC"
                    name="blue_card"
                    type="select"
                    value={editFormData.blue_card}
                    onChange={handleFieldChange}
                    options={[
                      { value: "", label: "请选择" },
                      { value: "是", label: "是" },
                      { value: "否", label: "否" },
                      { value: "申请中", label: "申请中" },
                    ]}
                  />
                  <FormField
                    label="警察检查"
                    name="police_check"
                    type="select"
                    value={editFormData.police_check}
                    onChange={handleFieldChange}
                    options={[
                      { value: "", label: "请选择" },
                      { value: "是", label: "是" },
                      { value: "否", label: "否" },
                      { value: "申请中", label: "申请中" },
                    ]}
                  />
                  <TagsInput
                    label="技能"
                    name="skill"
                    value={editFormData.skill}
                    onChange={handleFieldChange}
                    placeholder="输入技能并按Enter或逗号添加"
                  />
                  <TagsInput
                    label="证书/毕业证"
                    name="certification"
                    value={editFormData.certification}
                    onChange={handleFieldChange}
                    placeholder="输入证书并按Enter或逗号添加"
                  />
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      教育背景
                    </label>
                    <p className="text-gray-900">
                      {profile.metafields?.education || "未设置"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      语言能力
                    </label>
                    <p className="text-gray-900">
                      {formatArrayField(profile.metafields?.language)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      蓝卡/WWCC
                    </label>
                    <p className="text-gray-900">
                      {getBooleanDisplay(profile.metafields?.blue_card)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      警察检查
                    </label>
                    <p className="text-gray-900">
                      {getBooleanDisplay(profile.metafields?.police_check)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      技能
                    </label>
                    <p className="text-gray-900">
                      {formatArrayField(profile.metafields?.skill)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      证书/毕业证
                    </label>
                    <p className="text-gray-900">
                      {formatArrayField(profile.metafields?.certification)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              偏好设置
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isEditMode ? (
                <>
                  <TagsInput
                    label="偏好年龄组"
                    name="age_group"
                    value={editFormData.age_group}
                    onChange={handleFieldChange}
                    placeholder="输入年龄组并按Enter或逗号添加"
                  />
                  <TagsInput
                    label="时间安排"
                    name="availability"
                    value={editFormData.availability}
                    onChange={handleFieldChange}
                    placeholder="输入可用时间并按Enter或逗号添加"
                  />
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      偏好年龄组
                    </label>
                    <p className="text-gray-900">
                      {formatArrayField(profile.metafields?.age_group)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      时间安排
                    </label>
                    <p className="text-gray-900">
                      {formatArrayField(profile.metafields?.availability)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Images */}
        <div className="lg:col-span-1 lg:order-2 order-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              档案照片
            </h2>
            {isEditMode ? (
              <div className="space-y-4">
                {/* Current Images */}
                {profile.images && profile.images.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">当前照片:</p>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-4">
                      {profile.images.map((image, index) => {
                        const isMarkedForRemoval =
                          imagesToRemove.includes(index);
                        return (
                          <div
                            key={index}
                            className={`relative aspect-square rounded-lg overflow-hidden ${
                              isMarkedForRemoval
                                ? "opacity-50 border-2 border-red-300"
                                : ""
                            }`}
                          >
                            <Image
                              src={image.src}
                              alt={image.alt || `Profile image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            {/* Overlay for removed images */}
                            {isMarkedForRemoval && (
                              <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                                <span className="text-white text-xs font-semibold bg-red-600 px-2 py-1 rounded">
                                  将被删除
                                </span>
                              </div>
                            )}
                            {/* Remove/Restore button */}
                            <button
                              type="button"
                              onClick={() =>
                                isMarkedForRemoval
                                  ? handleRestoreExistingImage(index)
                                  : handleRemoveExistingImage(index)
                              }
                              className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors ${
                                isMarkedForRemoval
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-red-500 hover:bg-red-600"
                              }`}
                            >
                              {isMarkedForRemoval ? (
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {/* Info about image management */}
                    {imagesToRemove.length > 0 && (
                      <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-xs text-orange-700">
                          ⚠️ {imagesToRemove.length}{" "}
                          {`张照片标记为删除。点击"更新档案"按钮确认删除，或点击照片上的恢复按钮取消删除。`}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Image Upload */}
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    {editImages.length > 0 ? "新增照片:" : "上传新照片:"}
                  </p>
                  <ImageUpload
                    images={editImages}
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    最多5张照片，每张最大5MB
                  </p>
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-700">
                      ✓
                      上传新照片后，点击&ldquo;更新档案&rdquo;按钮会将照片添加到您的档案中。
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {profile.images && profile.images.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                    {profile.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden"
                      >
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
                  <div className="text-gray-500 text-center py-8">暂无照片</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
