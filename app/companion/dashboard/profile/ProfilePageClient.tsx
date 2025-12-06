"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/app/store/hooks";
import { openModal } from "@/app/store/modalSlice";
import FormField from "@/app/companion/create/components/FormField";
import TagsInput from "@/app/companion/create/components/TagsInput";
import ImageUpload from "@/app/companion/create/components/ImageUpload";
import { useTranslation } from "@/app/i18n";

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
  age_range?: string;
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

function formatArrayField(field: string[] | undefined, notSetText: string): string {
  if (!field || field.length === 0) return notSetText;
  return field.join(", ");
}

function getBooleanDisplay(value: string | undefined, yesText: string, noText: string, pendingText: string, notSetText: string): string {
  if (!value) return notSetText;
  switch (value.toLowerCase()) {
    case "yes":
    case "true":
    case "是":
      return yesText;
    case "no":
    case "false":
    case "否":
      return noText;
    case "pending":
    case "申请中":
      return pendingText;
    default:
      return value;
  }
}

export default function ProfilePageClient({ profile }: ProfilePageClientProps) {
  const dispatch = useAppDispatch();
  const { t, translations } = useTranslation();
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
          <h1 className="text-3xl font-bold text-gray-900">{t(translations.profilePage.title)}</h1>
          <p className="mt-2 text-gray-600">
            {isEditMode
              ? t(translations.profilePage.editModeSubtitle)
              : canEdit
              ? t(translations.profilePage.viewModeSubtitle)
              : t(translations.profilePage.setupCredentialsFirst)}
          </p>
        </div>
        <div className="flex gap-3">
          {isEditMode ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t(translations.profilePage.cancel)}
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
                {t(translations.profilePage.updateProfile)}
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
              {t(translations.profilePage.editProfile)}
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
                {t(translations.profilePage.needCredentials)}
              </h3>
              <p className="mt-2 text-sm text-orange-700">
                {t(translations.profilePage.credentialsDesc)}
              </p>
              <div className="mt-4">
                <button
                  onClick={() =>
                    dispatch(openModal({ type: "login_credentials" }))
                  }
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                >
                  {t(translations.profilePage.setCredentials)}
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
              {t(translations.profilePage.basicInfo)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isEditMode ? (
                <>
                  <FormField
                    label={t(translations.profilePage.lastName)}
                    name="last_name"
                    type="text"
                    value={editFormData.last_name}
                    onChange={handleFieldChange}
                    placeholder={t(translations.profilePage.enterLastName)}
                    required
                  />
                  <FormField
                    label={t(translations.profilePage.firstName)}
                    name="first_name"
                    type="text"
                    value={editFormData.first_name}
                    onChange={handleFieldChange}
                    placeholder={t(translations.profilePage.enterFirstName)}
                    required
                  />
                  <FormField
                    label={t(translations.profilePage.email)}
                    name="user_name"
                    type="email"
                    value={editFormData.user_name}
                    onChange={handleFieldChange}
                    placeholder={t(translations.profilePage.enterEmail)}
                    required
                  />
                  <FormField
                    label={t(translations.profilePage.major)}
                    name="major"
                    type="text"
                    value={editFormData.major}
                    onChange={handleFieldChange}
                    placeholder={t(translations.profilePage.enterMajor)}
                    required
                  />
                  <FormField
                    label={t(translations.profilePage.location)}
                    name="location"
                    type="select"
                    value={editFormData.location}
                    onChange={handleFieldChange}
                    required
                    options={[
                      { value: "", label: t(translations.profilePage.selectCity) },
                      { value: "sydney", label: "Sydney" },
                      { value: "melbourne", label: "Melbourne" },
                      { value: "brisbane", label: "Brisbane" },
                      { value: "goldCoast", label: "Gold Coast" },
                      { value: "adelaide", label: "Adelaide" },
                    ]}
                  />
                  <FormField
                    label={t(translations.profilePage.age)}
                    name="age"
                    type="number"
                    value={editFormData.age}
                    onChange={handleFieldChange}
                    placeholder={t(translations.profilePage.enterAge)}
                  />
                  <FormField
                    label={t(translations.profilePage.wechatId)}
                    name="wechat_id"
                    type="text"
                    value={profile.metafields?.wechat_id || ""}
                    onChange={() => {}} // Empty function since it's disabled
                    placeholder={t(translations.profilePage.wechatNotEditable)}
                    disabled
                  />
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(translations.profilePage.lastName)}
                    </label>
                    <p className="text-gray-900">
                      {profile.metafields?.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(translations.profilePage.firstName)}
                    </label>
                    <p className="text-gray-900">
                      {profile.metafields?.first_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(translations.profilePage.email)}
                    </label>
                    <p className="text-gray-900">
                      {profile.metafields?.user_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(translations.profilePage.major)}
                    </label>
                    <p className="text-gray-900">{profile.metafields?.major}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(translations.profilePage.location)}
                    </label>
                    <p className="text-gray-900">
                      {profile.metafields?.location}
                    </p>
                  </div>
                  {profile.metafields?.age && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t(translations.profilePage.age)}
                      </label>
                      <p className="text-gray-900">{profile.metafields.age}</p>
                    </div>
                  )}
                  {profile.metafields?.wechat_id && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t(translations.profilePage.wechatId)}
                      </label>
                      <p className="text-gray-900">
                        {profile.metafields.wechat_id}
                      </p>
                    </div>
                  )}
                  {profile.metafields?.age_range && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t(translations.profilePage.ageRange)}
                      </label>
                      <p className="text-gray-900">{profile.metafields.age_range}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* About Me */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t(translations.profilePage.aboutMe)}</h2>
            {isEditMode ? (
              <FormField
                label={t(translations.profilePage.personalIntro)}
                name="description"
                type="textarea"
                value={editFormData.description}
                onChange={handleFieldChange}
                placeholder={t(translations.profilePage.personalIntroPlaceholder)}
                required
                rows={6}
              />
            ) : (
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {profile.metafields?.description || t(translations.profilePage.notSet)}
              </div>
            )}
          </div>

          {/* Skills & Qualifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t(translations.profilePage.skillsAndQualifications)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isEditMode ? (
                <>
                  <FormField
                    label={t(translations.profilePage.educationBackground)}
                    name="education"
                    type="text"
                    value={editFormData.education}
                    onChange={handleFieldChange}
                    placeholder={t(translations.profilePage.enterEducation)}
                  />
                  <TagsInput
                    label={t(translations.profilePage.languageAbility)}
                    name="language"
                    value={editFormData.language}
                    onChange={handleFieldChange}
                    placeholder={t(translations.profilePage.enterLanguage)}
                  />
                  <FormField
                    label={t(translations.profilePage.blueCard)}
                    name="blue_card"
                    type="select"
                    value={editFormData.blue_card}
                    onChange={handleFieldChange}
                    options={[
                      { value: "", label: t(translations.profilePage.pleaseSelect) },
                      { value: "是", label: t(translations.profilePage.yes) },
                      { value: "否", label: t(translations.profilePage.no) },
                      { value: "申请中", label: t(translations.profilePage.pending) },
                    ]}
                  />
                  <FormField
                    label={t(translations.profilePage.policeCheck)}
                    name="police_check"
                    type="select"
                    value={editFormData.police_check}
                    onChange={handleFieldChange}
                    options={[
                      { value: "", label: t(translations.profilePage.pleaseSelect) },
                      { value: "是", label: t(translations.profilePage.yes) },
                      { value: "否", label: t(translations.profilePage.no) },
                      { value: "申请中", label: t(translations.profilePage.pending) },
                    ]}
                  />
                  <TagsInput
                    label={t(translations.profilePage.skills)}
                    name="skill"
                    value={editFormData.skill}
                    onChange={handleFieldChange}
                    placeholder={t(translations.profilePage.enterSkill)}
                  />
                  <TagsInput
                    label={t(translations.profilePage.certificates)}
                    name="certification"
                    value={editFormData.certification}
                    onChange={handleFieldChange}
                    placeholder={t(translations.profilePage.enterCertificate)}
                  />
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(translations.profilePage.educationBackground)}
                    </label>
                    <p className="text-gray-900">
                      {profile.metafields?.education || t(translations.profilePage.notSet)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(translations.profilePage.languageAbility)}
                    </label>
                    <p className="text-gray-900">
                      {formatArrayField(profile.metafields?.language, t(translations.profilePage.notSet))}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(translations.profilePage.blueCard)}
                    </label>
                    <p className="text-gray-900">
                      {getBooleanDisplay(profile.metafields?.blue_card, t(translations.profilePage.yes), t(translations.profilePage.no), t(translations.profilePage.pending), t(translations.profilePage.notSet))}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(translations.profilePage.policeCheck)}
                    </label>
                    <p className="text-gray-900">
                      {getBooleanDisplay(profile.metafields?.police_check, t(translations.profilePage.yes), t(translations.profilePage.no), t(translations.profilePage.pending), t(translations.profilePage.notSet))}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(translations.profilePage.skills)}
                    </label>
                    <p className="text-gray-900">
                      {formatArrayField(profile.metafields?.skill, t(translations.profilePage.notSet))}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(translations.profilePage.certificates)}
                    </label>
                    <p className="text-gray-900">
                      {formatArrayField(profile.metafields?.certification, t(translations.profilePage.notSet))}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t(translations.profilePage.preferences)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isEditMode ? (
                <>
                  <TagsInput
                    label={t(translations.profilePage.preferredAgeGroup)}
                    name="age_group"
                    value={editFormData.age_group}
                    onChange={handleFieldChange}
                    placeholder={t(translations.profilePage.enterAgeGroup)}
                  />
                  <TagsInput
                    label={t(translations.profilePage.availability)}
                    name="availability"
                    value={editFormData.availability}
                    onChange={handleFieldChange}
                    placeholder={t(translations.profilePage.enterAvailability)}
                  />
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(translations.profilePage.preferredAgeGroup)}
                    </label>
                    <p className="text-gray-900">
                      {formatArrayField(profile.metafields?.age_group, t(translations.profilePage.notSet))}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(translations.profilePage.availability)}
                    </label>
                    <p className="text-gray-900">
                      {formatArrayField(profile.metafields?.availability, t(translations.profilePage.notSet))}
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
              {t(translations.profilePage.profilePhotos)}
            </h2>
            {isEditMode ? (
              <div className="space-y-4">
                {/* Current Images */}
                {profile.images && profile.images.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">{t(translations.profilePage.currentPhotos)}</p>
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
                                  {t(translations.profilePage.willBeDeleted)}
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
                          {`⚠️ ${imagesToRemove.length} ${t(translations.profilePage.photosMarkedForDeletion)}`}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Image Upload */}
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    {editImages.length > 0 ? t(translations.profilePage.newPhotos) : t(translations.profilePage.uploadNewPhotos)}
                  </p>
                  <ImageUpload
                    images={editImages}
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {t(translations.profilePage.maxPhotos)}
                  </p>
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-700">
                      ✓ {t(translations.profilePage.uploadPhotosNote)}
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
                  <div className="text-gray-500 text-center py-8">{t(translations.profilePage.noPhotos)}</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
