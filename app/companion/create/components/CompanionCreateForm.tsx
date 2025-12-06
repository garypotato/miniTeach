"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import FormField from "./FormField";
import LoadingSpinner from "./LoadingSpinner";
import ImageUpload from "./ImageUpload";
import TagsInput from "./TagsInput";
import { checkEmailAvailability, createCompanion } from "../actions";
import { useTranslation } from "@/app/i18n";

interface FormData {
  // Required fields
  first_name: string;
  last_name: string;
  user_name: string;
  password: string;
  major: string;
  location: string;
  description: string;

  // Optional fields
  wechat_id: string;
  education: string;
  language: string;
  age: string;
  age_group: string;
  blue_card: string;
  police_check: string;
  skill: string;
  certification: string;
  availability: string;
  images: File[];
}

interface ValidationErrors {
  [key: string]: string | undefined;
  general?: string;
  originalErrorDetails?: string;
}

export default function CompanionCreateForm() {
  const router = useRouter();
  const { t, translations } = useTranslation();
  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fieldRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    user_name: "",
    password: "",
    major: "",
    location: "",
    description: "",
    wechat_id: "",
    education: "",
    language: "",
    age: "",
    age_group: "",
    blue_card: "",
    police_check: "",
    skill: "",
    certification: "",
    availability: "",
    images: [],
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const scrollToFirstError = (errors: ValidationErrors) => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField && fieldRefs.current[firstErrorField]) {
      const element = fieldRefs.current[firstErrorField];
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      // Focus the field if it's an input
      const input = element.querySelector(
        "input, textarea, select"
      ) as HTMLElement;
      if (input && input.focus) {
        setTimeout(() => input.focus(), 100);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const requiredMsg = t(translations.validation.required);

    // All fields are now required
    if (!formData.first_name.trim()) {
      newErrors.first_name = requiredMsg;
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = requiredMsg;
    }
    if (!formData.user_name.trim()) {
      newErrors.user_name = requiredMsg;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_name)) {
      newErrors.user_name = t(translations.validation.invalidEmail);
    }
    if (!formData.password.trim()) {
      newErrors.password = requiredMsg;
    } else if (
      formData.password.length < 8 ||
      !/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)
    ) {
      newErrors.password = t(translations.validation.passwordRequirements);
    }
    if (!formData.major.trim()) {
      newErrors.major = requiredMsg;
    }
    if (!formData.location.trim()) {
      newErrors.location = requiredMsg;
    }
    if (!formData.description.trim()) {
      newErrors.description = requiredMsg;
    }
    if (!formData.wechat_id.trim()) {
      newErrors.wechat_id = requiredMsg;
    }
    if (!formData.education.trim()) {
      newErrors.education = requiredMsg;
    }
    if (!formData.language.trim()) {
      newErrors.language = requiredMsg;
    }
    if (!formData.age.trim()) {
      newErrors.age = requiredMsg;
    }
    if (!formData.age_group.trim()) {
      newErrors.age_group = requiredMsg;
    }
    if (!formData.blue_card.trim()) {
      newErrors.blue_card = requiredMsg;
    }
    if (!formData.police_check.trim()) {
      newErrors.police_check = requiredMsg;
    }
    if (!formData.skill.trim()) {
      newErrors.skill = requiredMsg;
    }
    if (!formData.certification.trim()) {
      newErrors.certification = requiredMsg;
    }
    if (!formData.availability.trim()) {
      newErrors.availability = requiredMsg;
    }

    // Image validation
    if (formData.images.length === 0) {
      newErrors.images = t(translations.validation.minImages);
    } else if (formData.images.length > 5) {
      newErrors.images = t(translations.validation.maxImages);
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError(newErrors);
      return false;
    }

    return true;
  };

  const checkEmailUniqueness = async (email: string): Promise<boolean> => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return true; // Skip check for invalid emails
    }

    setIsCheckingEmail(true);
    try {
      const result = await checkEmailAvailability(email);

      if (!result.available) {
        setErrors((prev) => ({
          ...prev,
          user_name: t(translations.validation.emailAlreadyUsed),
        }));
        return false;
      }

      // Clear email error if available
      setErrors((prev) => ({ ...prev, user_name: "" }));
      return true;
    } catch {
      return true; // Allow submission on check failure
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleInputChange = (
    name: string,
    value: string | string[] | File[]
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Check email uniqueness when user_name changes
    if (name === "user_name" && typeof value === "string") {
      // Clear previous timeout
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }

      // Debounce the email check
      emailCheckTimeoutRef.current = setTimeout(() => {
        checkEmailUniqueness(value);
      }, 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({}); // Clear any previous errors

    try {
      const submitData = new FormData();

      // Add required fields
      submitData.append("first_name", formData.first_name);
      submitData.append("last_name", formData.last_name);
      submitData.append("user_name", formData.user_name);
      submitData.append("password", formData.password);
      submitData.append("major", formData.major);
      submitData.append("location", formData.location);
      submitData.append("description", formData.description);

      // Add optional fields
      if (formData.wechat_id)
        submitData.append("wechat_id", formData.wechat_id);
      if (formData.education)
        submitData.append("education", formData.education);
      if (formData.age) submitData.append("age", formData.age);
      if (formData.blue_card)
        submitData.append("blue_card", formData.blue_card);
      if (formData.police_check)
        submitData.append("police_check", formData.police_check);

      // Add array fields
      submitData.append("language", formData.language);
      submitData.append("age_group", formData.age_group);
      submitData.append("skill", formData.skill);
      submitData.append("certification", formData.certification);
      submitData.append("availability", formData.availability);

      // Add images
      formData.images.forEach((image) => {
        submitData.append("images", image);
      });

      // Use server action for form submission
      const result = await createCompanion(submitData);

      if (result.success) {
        setSubmitStatus("success");
        // Scroll to top to show success message with a small delay
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
        // Optional: redirect after showing success
        setTimeout(() => {
          router.push("/companions");
        }, 2000);
      } else {
        setSubmitStatus("error");
        setErrors({ general: result.error || t(translations.errors.profileCreationFailed) });
        // Scroll to top to show error message with a small delay
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      setSubmitStatus("error");

      // Preserve original error for debugging
      let errorMessage = t(translations.errors.networkError);
      const originalError = error;

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Enhanced error object with original error details
      const enhancedError = {
        message: errorMessage,
        originalError: {
          name: originalError instanceof Error ? originalError.name : 'Unknown',
          message: originalError instanceof Error ? originalError.message : String(originalError),
          stack: originalError instanceof Error ? originalError.stack : undefined,
          toString: String(originalError)
        },
        context: {
          timestamp: new Date().toISOString(),
          formSubmission: true,
          imageCount: formData.images.length,
          userAgent: navigator.userAgent
        }
      };

      console.error('Form submission failed:', enhancedError);

      // Store enhanced error info for display
      setErrors({
        general: errorMessage,
        originalErrorDetails: JSON.stringify(enhancedError, null, 2)
      });

      // Scroll to top to show error message with a small delay
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-4">
            {t(translations.companionForm.successTitle)}
          </h2>
          <p className="text-green-700 mb-6">
            {t(translations.companionForm.successDesc)}
          </p>
          <div className="text-left bg-white rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              {t(translations.companionForm.whatHappensNext)}
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>{t(translations.companionForm.step1)}</li>
              <li>{t(translations.companionForm.step2)}</li>
              <li>{t(translations.companionForm.step3)}</li>
              <li>{t(translations.companionForm.step4)}</li>
            </ol>
          </div>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t(translations.companionForm.returnHome)}
          </button>
        </div>
      </div>
    );
  }

  if (submitStatus === "error") {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-4">{t(translations.errors.profileCreationError)}</h2>
          <p className="text-red-700 mb-6">
            {t(translations.errors.profileCreationDesc)}
          </p>

          {/* Enhanced error display with detailed debugging information */}
          {errors.general && (
            <div className="bg-white border border-red-300 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-red-800 mb-2">{t(translations.errors.errorDetails)}</h3>
              <p className="text-sm text-red-700 mb-3">{errors.general}</p>

              {/* Device and browser information for debugging */}
              <div className="bg-gray-50 border rounded p-3 mb-3 text-xs">
                <h4 className="font-semibold text-gray-700 mb-1">{t(translations.errors.debugInfo)}</h4>
                <div className="space-y-1 text-gray-600">
                  <p>• {t(translations.errors.device)}: {navigator.userAgent.includes('iPhone') ? 'iPhone' : navigator.userAgent.includes('iPad') ? 'iPad' : navigator.userAgent.includes('Android') ? 'Android' : 'Desktop'}</p>
                  <p>• {t(translations.errors.browser)}: {navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome') ? 'Safari' : navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Other'}</p>
                  <p>• {t(translations.errors.time)}: {new Date().toLocaleString()}</p>
                  <p>• Error: {errors.general}</p>
                  {formData.images.length > 0 && (
                    <>
                      <p>• Images: {formData.images.length}</p>
                      <p>• Image details:</p>
                      {formData.images.map((img, index) => (
                        <p key={index} className="ml-4">
                          - {img.name || `Image ${index + 1}`}: {(img.size / 1024 / 1024).toFixed(2)}MB ({img.type || 'unknown'})
                        </p>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Original raw error details for developer debugging */}
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-3 text-xs">
                <h4 className="font-semibold text-red-800 mb-1">{t(translations.errors.rawErrorDetails)}</h4>
                <div className="space-y-1 text-red-700">
                  <p><strong>Error type:</strong> {typeof errors.general}</p>
                  <p><strong>Error content:</strong> {errors.general}</p>
                  <p><strong>Error length:</strong> {errors.general?.length || 0} chars</p>
                  <div className="bg-white border rounded p-2 mt-2 font-mono text-xs overflow-auto max-h-32">
                    <strong>Raw Error:</strong><br/>
                    {errors.originalErrorDetails || JSON.stringify({
                      error: errors.general,
                      timestamp: new Date().toISOString(),
                      userAgent: navigator.userAgent,
                      url: window.location.href,
                      formDataState: {
                        imageCount: formData.images.length,
                        images: formData.images.map(img => ({
                          name: img.name,
                          size: img.size,
                          type: img.type,
                          lastModified: img.lastModified
                        })),
                        hasRequiredFields: !!(formData.first_name && formData.last_name && formData.user_name)
                      }
                    }, null, 2)}
                  </div>
                </div>
              </div>

              {/* Enhanced helpful suggestions based on error type */}
              <div className="text-xs text-gray-600">
                <p><strong>{t(translations.errors.solutions)}</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {errors.general.includes('HEIC') || errors.general.includes('heic') ? (
                    <>
                      <li>{t(translations.errors.solutionHeic)}</li>
                      <li>{t(translations.errors.solutionFormat)}</li>
                    </>
                  ) : errors.general.includes('size') || errors.general.includes('large') ? (
                    <>
                      <li>{t(translations.errors.solutionSize)}</li>
                    </>
                  ) : errors.general.includes('memory') || errors.general.includes('Memory') ? (
                    <>
                      <li>{t(translations.errors.solutionMemory)}</li>
                    </>
                  ) : (
                    <>
                      <li>{t(translations.errors.solutionFormat)}</li>
                      <li>{t(translations.errors.solutionSize)}</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}



          <div className="space-x-4">
            <button
              onClick={() => setSubmitStatus("idle")}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              {t(translations.common.retry)}
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              {t(translations.companionForm.contactSupport)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t(translations.companionForm.pageTitle)}</h1>
        <p className="mt-2 text-gray-600">
          {t(translations.companionForm.pageSubtitle)}
        </p>
      </div>

      {/* General Error Display */}
      {errors.general && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="ml-2 text-sm text-red-700">{errors.general}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {t(translations.companionForm.basicInfo)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              ref={(el) => {
                fieldRefs.current["first_name"] = el;
              }}
              label={t(translations.companionForm.firstName)}
              name="first_name"
              type="text"
              placeholder={t(translations.companionForm.firstNamePlaceholder)}
              value={formData.first_name}
              onChange={handleInputChange}
              error={errors.first_name}
              required
            />

            <FormField
              ref={(el) => {
                fieldRefs.current["last_name"] = el;
              }}
              label={t(translations.companionForm.lastName)}
              name="last_name"
              type="text"
              placeholder={t(translations.companionForm.lastNamePlaceholder)}
              value={formData.last_name}
              onChange={handleInputChange}
              error={errors.last_name}
              required
            />

            <div className="relative">
              <FormField
                ref={(el) => {
                  fieldRefs.current["user_name"] = el;
                }}
                label={t(translations.companionForm.email)}
                name="user_name"
                type="email"
                placeholder={t(translations.companionForm.emailPlaceholder)}
                value={formData.user_name}
                onChange={handleInputChange}
                error={errors.user_name}
                required
                disabled={isCheckingEmail}
              />
              {isCheckingEmail && (
                <div className="absolute right-3 top-9 flex items-center">
                  <LoadingSpinner className="w-4 h-4 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-500">{t(translations.common.loading)}</span>
                </div>
              )}
            </div>

            <FormField
              ref={(el) => {
                fieldRefs.current["password"] = el;
              }}
              label={t(translations.companionForm.password)}
              name="password"
              type="password"
              placeholder={t(translations.companionForm.passwordPlaceholder)}
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
            />

            <FormField
              ref={(el) => {
                fieldRefs.current["age"] = el;
              }}
              label={t(translations.companionForm.age)}
              name="age"
              type="number"
              placeholder={t(translations.companionForm.agePlaceholder)}
              value={formData.age}
              onChange={handleInputChange}
              error={errors.age}
              required
            />

            <FormField
              ref={(el) => {
                fieldRefs.current["wechat_id"] = el;
              }}
              label={t(translations.companionForm.wechat)}
              name="wechat_id"
              type="text"
              placeholder={t(translations.companionForm.wechatPlaceholder)}
              value={formData.wechat_id}
              onChange={handleInputChange}
              error={errors.wechat_id}
              required
            />

            <FormField
              ref={(el) => {
                fieldRefs.current["location"] = el;
              }}
              label={t(translations.companionForm.location)}
              name="location"
              type="select"
              placeholder={t(translations.companionForm.locationPlaceholder)}
              value={formData.location}
              onChange={handleInputChange}
              error={errors.location}
              required
              options={[
                { value: "", label: t(translations.companionForm.locationPlaceholder) },
                { value: "sydney", label: "Sydney" },
                { value: "melbourne", label: "Melbourne" },
                { value: "brisbane", label: "Brisbane" },
                { value: "goldCoast", label: "Gold Coast" },
                { value: "adelaide", label: "Adelaide" },
              ]}
            />
          </div>
        </div>

        {/* About Me */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t(translations.companionForm.aboutMe)}</h2>
          <FormField
            ref={(el) => {
              fieldRefs.current["description"] = el;
            }}
            label={t(translations.companionForm.personalIntro)}
            name="description"
            type="textarea"
            placeholder={t(translations.companionForm.personalIntroPlaceholder)}
            value={formData.description}
            onChange={handleInputChange}
            error={errors.description}
            required
            rows={6}
          />
        </div>

        {/* Skills & Qualifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {t(translations.companionForm.skillsQualifications)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              ref={(el) => {
                fieldRefs.current["major"] = el;
              }}
              label={t(translations.companionForm.profession)}
              name="major"
              type="text"
              placeholder={t(translations.companionForm.professionPlaceholder)}
              value={formData.major}
              onChange={handleInputChange}
              error={errors.major}
              required
            />

            <TagsInput
              ref={(el) => {
                fieldRefs.current["education"] = el;
              }}
              label={t(translations.companionForm.educationBackground)}
              name="education"
              placeholder={t(translations.companionForm.educationPlaceholder)}
              value={formData.education}
              onChange={handleInputChange}
              error={errors.education}
              required
            />

            <TagsInput
              ref={(el) => {
                fieldRefs.current["language"] = el;
              }}
              label={t(translations.companionForm.languageAbility)}
              name="language"
              placeholder={t(translations.companionForm.languagePlaceholder)}
              value={formData.language}
              onChange={handleInputChange}
              error={errors.language}
              required
            />

            <FormField
              ref={(el) => {
                fieldRefs.current["blue_card"] = el;
              }}
              label={t(translations.companionForm.blueCardWwcc)}
              name="blue_card"
              type="select"
              placeholder={t(translations.companionForm.pleaseSelect)}
              value={formData.blue_card}
              onChange={handleInputChange}
              error={errors.blue_card}
              required
              options={[
                { value: "", label: t(translations.companionForm.pleaseSelect) },
                { value: "Yes", label: t(translations.common.yes) },
                { value: "No", label: t(translations.common.no) },
                { value: "Applying", label: t(translations.companionForm.applying) },
              ]}
            />

            <FormField
              ref={(el) => {
                fieldRefs.current["police_check"] = el;
              }}
              label={t(translations.companionForm.policeCheck)}
              name="police_check"
              type="select"
              placeholder={t(translations.companionForm.pleaseSelect)}
              value={formData.police_check}
              onChange={handleInputChange}
              error={errors.police_check}
              required
              options={[
                { value: "", label: t(translations.companionForm.pleaseSelect) },
                { value: "Yes", label: t(translations.common.yes) },
                { value: "No", label: t(translations.common.no) },
                { value: "Applying", label: t(translations.companionForm.applying) },
              ]}
            />

            <TagsInput
              ref={(el) => {
                fieldRefs.current["skill"] = el;
              }}
              label={t(translations.companionForm.skillsLabel)}
              name="skill"
              placeholder={t(translations.companionForm.skillsPlaceholder)}
              value={formData.skill}
              onChange={handleInputChange}
              error={errors.skill}
              required
            />

            <TagsInput
              ref={(el) => {
                fieldRefs.current["certification"] = el;
              }}
              label={t(translations.companionForm.certificates)}
              name="certification"
              placeholder={t(translations.companionForm.certificatesPlaceholder)}
              value={formData.certification}
              onChange={handleInputChange}
              error={errors.certification}
              required
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {t(translations.companionForm.preferences)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TagsInput
              ref={(el) => {
                fieldRefs.current["age_group"] = el;
              }}
              label={t(translations.companionForm.preferredAgeGroup)}
              name="age_group"
              placeholder={t(translations.companionForm.preferredAgePlaceholder)}
              value={formData.age_group}
              onChange={handleInputChange}
              error={errors.age_group}
              required
            />

            <TagsInput
              ref={(el) => {
                fieldRefs.current["availability"] = el;
              }}
              label={t(translations.companionForm.scheduleAvailability)}
              name="availability"
              placeholder={t(translations.companionForm.schedulePlaceholder)}
              value={formData.availability}
              onChange={handleInputChange}
              error={errors.availability}
              required
            />
          </div>
        </div>

        {/* Profile Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t(translations.companionForm.profilePhotos)}
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            {t(translations.companionForm.photoUploadDesc)}
          </p>
          <ImageUpload
            ref={(el) => {
              fieldRefs.current["images"] = el;
            }}
            images={formData.images}
            onChange={(images: File[]) => handleInputChange("images", images)}
            error={errors.images}
          />
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {t(translations.common.cancel)}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSubmitting && <LoadingSpinner className="w-4 h-4 mr-2" />}
              {isSubmitting ? t(translations.companionForm.creatingProfile) : t(translations.companionForm.createProfile)}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
