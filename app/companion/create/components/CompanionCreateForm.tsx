"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../hooks/useLanguage";
import FormField from "./FormField";
import MultiSelectField from "./MultiSelectField";
import ImageUpload from "./ImageUpload";
import LoadingSpinner from "./LoadingSpinner";

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
  language: string[];
  age: string;
  age_group: string[];
  blue_card: string;
  police_check: string;
  skill: string[];
  certification: string[];
  availability: string[];
  images: File[];
}

interface ValidationErrors {
  [key: string]: string;
}

export default function CompanionCreateForm() {
  const { t } = useLanguage();
  const router = useRouter();

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
    language: [],
    age: "",
    age_group: [],
    blue_card: "",
    police_check: "",
    skill: [],
    certification: [],
    availability: [],
    images: [],
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required field validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = t("companionCreate.validation.required");
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = t("companionCreate.validation.required");
    }
    if (!formData.user_name.trim()) {
      newErrors.user_name = t("companionCreate.validation.required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_name)) {
      newErrors.user_name = t("companionCreate.validation.email");
    }
    if (!formData.password.trim()) {
      newErrors.password = t("companionCreate.validation.required");
    } else if (
      formData.password.length < 8 ||
      !/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)
    ) {
      newErrors.password = t("companionCreate.validation.passwordStrength");
    }
    if (!formData.major.trim()) {
      newErrors.major = t("companionCreate.validation.required");
    }
    if (!formData.location.trim()) {
      newErrors.location = t("companionCreate.validation.required");
    }
    if (!formData.description.trim()) {
      newErrors.description = t("companionCreate.validation.required");
    } else if (formData.description.length < 50) {
      newErrors.description = t("companionCreate.validation.minLength").replace(
        "{min}",
        "50"
      );
    }

    // Image validation
    if (formData.images.length > 5) {
      newErrors.images = t("companionCreate.validation.maxImages");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

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

      // Add array fields as JSON
      submitData.append("language", JSON.stringify(formData.language));
      submitData.append("age_group", JSON.stringify(formData.age_group));
      submitData.append("skill", JSON.stringify(formData.skill));
      submitData.append(
        "certification",
        JSON.stringify(formData.certification)
      );
      submitData.append("availability", JSON.stringify(formData.availability));

      // Add images
      formData.images.forEach((image) => {
        submitData.append("images", image);
      });

      const response = await fetch("/api/companions", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
        console.error("Form submission error:", result.error);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
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
            {t("companionCreate.success.title")}
          </h2>
          <p className="text-green-700 mb-6">
            {t("companionCreate.success.message")}
          </p>
          <div className="text-left bg-white rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              {t("companionCreate.success.nextSteps")}
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>{t("companionCreate.success.step1")}</li>
              <li>{t("companionCreate.success.step2")}</li>
              <li>{t("companionCreate.success.step3")}</li>
              <li>{t("companionCreate.success.step4")}</li>
            </ol>
          </div>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t("companionCreate.success.backToHome")}
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
          <h2 className="text-2xl font-bold text-red-900 mb-4">
            {t("companionCreate.error.title")}
          </h2>
          <p className="text-red-700 mb-6">
            {t("companionCreate.error.message")}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => setSubmitStatus("idle")}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              {t("companionCreate.error.tryAgain")}
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              {t("companionCreate.error.contactSupport")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Required Fields Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
            *
          </span>
          {t("companionCreate.form.requiredFields")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label={t("companionCreate.form.firstName.label")}
            name="first_name"
            type="text"
            placeholder={t("companionCreate.form.firstName.placeholder")}
            value={formData.first_name}
            onChange={handleInputChange}
            error={errors.first_name}
            required
          />

          <FormField
            label={t("companionCreate.form.lastName.label")}
            name="last_name"
            type="text"
            placeholder={t("companionCreate.form.lastName.placeholder")}
            value={formData.last_name}
            onChange={handleInputChange}
            error={errors.last_name}
            required
          />

          <FormField
            label={t("companionCreate.form.userName.label")}
            name="user_name"
            type="email"
            placeholder={t("companionCreate.form.userName.placeholder")}
            value={formData.user_name}
            onChange={handleInputChange}
            error={errors.user_name}
            required
          />

          <FormField
            label={t("companionCreate.form.password.label")}
            name="password"
            type="password"
            placeholder={t("companionCreate.form.password.placeholder")}
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
          />

          <FormField
            label={t("companionCreate.form.major.label")}
            name="major"
            type="text"
            placeholder={t("companionCreate.form.major.placeholder")}
            value={formData.major}
            onChange={handleInputChange}
            error={errors.major}
            required
          />

          <FormField
            label={t("companionCreate.form.location.label")}
            name="location"
            type="select"
            placeholder={t("companionCreate.form.location.placeholder")}
            value={formData.location}
            onChange={handleInputChange}
            error={errors.location}
            required
            options={[
              { value: "", label: "Select your city..." },
              {
                value: "sydney",
                label: t("companionCreate.form.location.options.sydney"),
              },
              {
                value: "melbourne",
                label: t("companionCreate.form.location.options.melbourne"),
              },
              {
                value: "brisbane",
                label: t("companionCreate.form.location.options.brisbane"),
              },
              {
                value: "goldCoast",
                label: t("companionCreate.form.location.options.goldCoast"),
              },
              {
                value: "adelaide",
                label: t("companionCreate.form.location.options.adelaide"),
              },
            ]}
          />
        </div>

        <div className="mt-6">
          <FormField
            label={t("companionCreate.form.description.label")}
            name="description"
            type="textarea"
            placeholder={t("companionCreate.form.description.placeholder")}
            value={formData.description}
            onChange={handleInputChange}
            error={errors.description}
            required
            rows={5}
          />
        </div>
      </div>

      {/* Optional Fields Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t("companionCreate.form.optionalFields")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label={t("companionCreate.form.wechatId.label")}
            name="wechat_id"
            type="text"
            placeholder={t("companionCreate.form.wechatId.placeholder")}
            value={formData.wechat_id}
            onChange={handleInputChange}
          />

          <FormField
            label={t("companionCreate.form.education.label")}
            name="education"
            type="text"
            placeholder={t("companionCreate.form.education.placeholder")}
            value={formData.education}
            onChange={handleInputChange}
          />

          <FormField
            label={t("companionCreate.form.age.label")}
            name="age"
            type="number"
            placeholder={t("companionCreate.form.age.placeholder")}
            value={formData.age}
            onChange={handleInputChange}
          />

          <FormField
            label={t("companionCreate.form.blueCard.label")}
            name="blue_card"
            type="select"
            placeholder={t("companionCreate.form.blueCard.placeholder")}
            value={formData.blue_card}
            onChange={handleInputChange}
            options={[
              { value: "", label: "Select..." },
              {
                value: "yes",
                label: t("companionCreate.form.blueCard.options.yes"),
              },
              {
                value: "no",
                label: t("companionCreate.form.blueCard.options.no"),
              },
              {
                value: "pending",
                label: t("companionCreate.form.blueCard.options.pending"),
              },
            ]}
          />

          <FormField
            label={t("companionCreate.form.policeCheck.label")}
            name="police_check"
            type="select"
            placeholder={t("companionCreate.form.policeCheck.placeholder")}
            value={formData.police_check}
            onChange={handleInputChange}
            options={[
              { value: "", label: "Select..." },
              {
                value: "yes",
                label: t("companionCreate.form.policeCheck.options.yes"),
              },
              {
                value: "no",
                label: t("companionCreate.form.policeCheck.options.no"),
              },
              {
                value: "pending",
                label: t("companionCreate.form.policeCheck.options.pending"),
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          <MultiSelectField
            label={t("companionCreate.form.language.label")}
            name="language"
            placeholder={t("companionCreate.form.language.placeholder")}
            value={formData.language}
            onChange={handleInputChange}
            options={[
              {
                value: "english",
                label: t("companionCreate.form.language.options.english"),
              },
              {
                value: "mandarin",
                label: t("companionCreate.form.language.options.mandarin"),
              },
              {
                value: "cantonese",
                label: t("companionCreate.form.language.options.cantonese"),
              },
              {
                value: "spanish",
                label: t("companionCreate.form.language.options.spanish"),
              },
              {
                value: "french",
                label: t("companionCreate.form.language.options.french"),
              },
              {
                value: "japanese",
                label: t("companionCreate.form.language.options.japanese"),
              },
              {
                value: "korean",
                label: t("companionCreate.form.language.options.korean"),
              },
              {
                value: "other",
                label: t("companionCreate.form.language.options.other"),
              },
            ]}
          />

          <MultiSelectField
            label={t("companionCreate.form.ageGroup.label")}
            name="age_group"
            placeholder={t("companionCreate.form.ageGroup.placeholder")}
            value={formData.age_group}
            onChange={handleInputChange}
            options={[
              {
                value: "infants",
                label: t("companionCreate.form.ageGroup.options.infants"),
              },
              {
                value: "toddlers",
                label: t("companionCreate.form.ageGroup.options.toddlers"),
              },
              {
                value: "preschool",
                label: t("companionCreate.form.ageGroup.options.preschool"),
              },
              {
                value: "schoolAge",
                label: t("companionCreate.form.ageGroup.options.schoolAge"),
              },
              {
                value: "teenagers",
                label: t("companionCreate.form.ageGroup.options.teenagers"),
              },
            ]}
          />

          <MultiSelectField
            label={t("companionCreate.form.skill.label")}
            name="skill"
            placeholder={t("companionCreate.form.skill.placeholder")}
            value={formData.skill}
            onChange={handleInputChange}
            options={[
              {
                value: "musicLessons",
                label: t("companionCreate.form.skill.options.musicLessons"),
              },
              {
                value: "artCrafts",
                label: t("companionCreate.form.skill.options.artCrafts"),
              },
              {
                value: "cooking",
                label: t("companionCreate.form.skill.options.cooking"),
              },
              {
                value: "sportsFitness",
                label: t("companionCreate.form.skill.options.sportsFitness"),
              },
              {
                value: "languageTutoring",
                label: t("companionCreate.form.skill.options.languageTutoring"),
              },
              {
                value: "homeworkHelp",
                label: t("companionCreate.form.skill.options.homeworkHelp"),
              },
              {
                value: "specialNeeds",
                label: t("companionCreate.form.skill.options.specialNeeds"),
              },
              {
                value: "firstAid",
                label: t("companionCreate.form.skill.options.firstAid"),
              },
            ]}
          />

          <MultiSelectField
            label={t("companionCreate.form.certification.label")}
            name="certification"
            placeholder={t("companionCreate.form.certification.placeholder")}
            value={formData.certification}
            onChange={handleInputChange}
            options={[
              {
                value: "earlyChildhood",
                label: t(
                  "companionCreate.form.certification.options.earlyChildhood"
                ),
              },
              {
                value: "firstAid",
                label: t("companionCreate.form.certification.options.firstAid"),
              },
              {
                value: "cpr",
                label: t("companionCreate.form.certification.options.cpr"),
              },
              {
                value: "specialEducation",
                label: t(
                  "companionCreate.form.certification.options.specialEducation"
                ),
              },
              {
                value: "tefl",
                label: t("companionCreate.form.certification.options.tefl"),
              },
              {
                value: "montessori",
                label: t(
                  "companionCreate.form.certification.options.montessori"
                ),
              },
              {
                value: "musicEducation",
                label: t(
                  "companionCreate.form.certification.options.musicEducation"
                ),
              },
              {
                value: "other",
                label: t("companionCreate.form.certification.options.other"),
              },
            ]}
          />

          <MultiSelectField
            label={t("companionCreate.form.availability.label")}
            name="availability"
            placeholder={t("companionCreate.form.availability.placeholder")}
            value={formData.availability}
            onChange={handleInputChange}
            options={[
              {
                value: "weekdayMornings",
                label: t(
                  "companionCreate.form.availability.options.weekdayMornings"
                ),
              },
              {
                value: "weekdayAfternoons",
                label: t(
                  "companionCreate.form.availability.options.weekdayAfternoons"
                ),
              },
              {
                value: "weekdayEvenings",
                label: t(
                  "companionCreate.form.availability.options.weekdayEvenings"
                ),
              },
              {
                value: "weekendMornings",
                label: t(
                  "companionCreate.form.availability.options.weekendMornings"
                ),
              },
              {
                value: "weekendAfternoons",
                label: t(
                  "companionCreate.form.availability.options.weekendAfternoons"
                ),
              },
              {
                value: "weekendEvenings",
                label: t(
                  "companionCreate.form.availability.options.weekendEvenings"
                ),
              },
              {
                value: "holidays",
                label: t("companionCreate.form.availability.options.holidays"),
              },
              {
                value: "emergency",
                label: t("companionCreate.form.availability.options.emergency"),
              },
            ]}
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t("companionCreate.form.images.label")}
        </h2>
        <ImageUpload
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
            {t("companionCreate.buttons.cancel")}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isSubmitting && <LoadingSpinner className="w-4 h-4 mr-2" />}
            {isSubmitting
              ? t("companionCreate.buttons.submitting")
              : t("companionCreate.buttons.submit")}
          </button>
        </div>
      </div>
    </form>
  );
}
