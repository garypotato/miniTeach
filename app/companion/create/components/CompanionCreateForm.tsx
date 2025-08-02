"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import FormField from "./FormField";
import LoadingSpinner from "./LoadingSpinner";
import ImageUpload from "./ImageUpload";
import TagsInput from "./TagsInput";

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
  [key: string]: string;
}

export default function CompanionCreateForm() {
  const router = useRouter();
  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required field validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = "此栏位为必填";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "此栏位为必填";
    }
    if (!formData.user_name.trim()) {
      newErrors.user_name = "此栏位为必填";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_name)) {
      newErrors.user_name = "请输入有效的电子邮件地址";
    }
    if (!formData.password.trim()) {
      newErrors.password = "此栏位为必填";
    } else if (
      formData.password.length < 8 ||
      !/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)
    ) {
      newErrors.password = "密码必须至少8个字符，包含字母和数字";
    }
    if (!formData.major.trim()) {
      newErrors.major = "此栏位为必填";
    }
    if (!formData.location.trim()) {
      newErrors.location = "此栏位为必填";
    }
    if (!formData.description.trim()) {
      newErrors.description = "此栏位为必填";
    } else if (formData.description.length < 50) {
      newErrors.description = "必须至少50个字符";
    }

    // Image validation
    if (formData.images.length === 0) {
      newErrors.images = "至少需要上传1张照片";
    } else if (formData.images.length > 5) {
      newErrors.images = "最多允许5张图片";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkEmailUniqueness = async (email: string): Promise<boolean> => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return true; // Skip check for invalid emails
    }

    setIsCheckingEmail(true);
    try {
      const response = await fetch("/api/companions/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!result.available) {
        setErrors((prev) => ({
          ...prev,
          user_name: "此电子邮件地址已被使用，请使用其他电子邮件地址",
        }));
        return false;
      }

      // Clear email error if available
      setErrors((prev) => ({ ...prev, user_name: "" }));
      return true;
    } catch (error) {
      console.error("Error checking email uniqueness:", error);
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
            档案创建成功！
          </h2>
          <p className="text-green-700 mb-6">
            您的陪伴师档案已提交审核。我们将在2-3个工作日内联系您进行下一步。
          </p>
          <div className="text-left bg-white rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              接下来会发生什么：
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>我们团队审核您的申请</li>
              <li>我们验证您的资格和背景</li>
              <li>审核通过后您的档案将上线</li>
              <li>家庭可以找到并联系您</li>
            </ol>
          </div>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            返回首页
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
          <h2 className="text-2xl font-bold text-red-900 mb-4">创建档案错误</h2>
          <p className="text-red-700 mb-6">
            我们在创建您的档案时遇到错误。请重试。
          </p>
          <div className="space-x-4">
            <button
              onClick={() => setSubmitStatus("idle")}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              重试
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              联系支持
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
          必填栏位
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="名字"
            name="first_name"
            type="text"
            placeholder="请输入您的名字"
            value={formData.first_name}
            onChange={handleInputChange}
            error={errors.first_name}
            required
          />

          <FormField
            label="姓氏"
            name="last_name"
            type="text"
            placeholder="请输入您的姓氏"
            value={formData.last_name}
            onChange={handleInputChange}
            error={errors.last_name}
            required
          />

          <div className="relative">
            <FormField
              label="电子邮件地址"
              name="user_name"
              type="email"
              placeholder="请输入您的电子邮件地址"
              value={formData.user_name}
              onChange={handleInputChange}
              error={errors.user_name}
              required
              disabled={isCheckingEmail}
            />
            {isCheckingEmail && (
              <div className="absolute right-3 top-9 flex items-center">
                <LoadingSpinner className="w-4 h-4 text-blue-600" />
                <span className="ml-2 text-sm text-gray-500">检查中...</span>
              </div>
            )}
          </div>

          <FormField
            label="密碼"
            name="password"
            type="password"
            placeholder="创建一个安全的密码"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
          />

          <FormField
            label="专业/学习领域"
            name="major"
            type="text"
            placeholder="例如：教育、幼儿发展"
            value={formData.major}
            onChange={handleInputChange}
            error={errors.major}
            required
          />

          <FormField
            label="位置"
            name="location"
            type="select"
            placeholder="选择您的城市"
            value={formData.location}
            onChange={handleInputChange}
            error={errors.location}
            required
            options={[
              { value: "", label: "选择您的城市..." },
              {
                value: "sydney",
                label: "Sydney",
              },
              {
                value: "melbourne",
                label: "Melbourne",
              },
              {
                value: "brisbane",
                label: "Brisbane",
              },
              {
                value: "goldCoast",
                label: "Gold Coast",
              },
              {
                value: "adelaide",
                label: "Adelaide",
              },
            ]}
          />
        </div>

        <div className="mt-6">
          <FormField
            label="關於我"
            name="description"
            type="textarea"
            placeholder="告诉家庭关于您自己、您的经验和儿童照护方法..."
            value={formData.description}
            onChange={handleInputChange}
            error={errors.description}
            required
            rows={5}
          />
        </div>

        {/* Image Upload in Required Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
              *
            </span>
            档案照片
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            请上传至少1张照片，最多5张 (每张图片最大5MB)
          </p>
          <ImageUpload
            images={formData.images}
            onChange={(images: File[]) => handleInputChange("images", images)}
            error={errors.images}
          />
        </div>
      </div>

      {/* Optional Fields Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">选填栏位</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="微信号"
            name="wechat_id"
            type="text"
            placeholder="您的微信识别码"
            value={formData.wechat_id}
            onChange={handleInputChange}
          />

          <TagsInput
            label="教育程度"
            name="education"
            placeholder="例如：学士学位、硕士学位"
            value={formData.education}
            onChange={handleInputChange}
          />

          <FormField
            label="年龄"
            name="age"
            type="number"
            placeholder="您的年龄"
            value={formData.age}
            onChange={handleInputChange}
          />

          <FormField
            label="藍卡 / WWCC"
            name="blue_card"
            type="select"
            placeholder="您是否持有蓝卡或与儿童工作检查？"
            value={formData.blue_card}
            onChange={handleInputChange}
            options={[
              { value: "", label: "选择..." },
              {
                value: "yes",
                label: "是",
              },
              {
                value: "no",
                label: "否",
              },
              {
                value: "pending",
                label: "申请中",
              },
            ]}
          />

          <FormField
            label="警察检查"
            name="police_check"
            type="select"
            placeholder="您是否有有效的警察许可？"
            value={formData.police_check}
            onChange={handleInputChange}
            options={[
              { value: "", label: "选择..." },
              {
                value: "yes",
                label: "是",
              },
              {
                value: "no",
                label: "否",
              },
              {
                value: "pending",
                label: "申请中",
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          <TagsInput
            label="使用语言"
            name="language"
            placeholder="请输入您会说的语言"
            value={formData.language}
            onChange={handleInputChange}
          />

          <TagsInput
            label="偏好年龄组"
            name="age_group"
            placeholder="请输入您偏好工作的年龄组"
            value={formData.age_group}
            onChange={handleInputChange}
          />

          <TagsInput
            label="技能"
            name="skill"
            placeholder="请输入您的技能"
            value={formData.skill}
            onChange={handleInputChange}
          />

          <TagsInput
            label="认证"
            name="certification"
            placeholder="请输入您的认证"
            value={formData.certification}
            onChange={handleInputChange}
          />

          <TagsInput
            label="可用性"
            name="availability"
            placeholder="请输入您的可用时间"
            value={formData.availability}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Submit Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isSubmitting && <LoadingSpinner className="w-4 h-4 mr-2" />}
            {isSubmitting ? "正在创建档案..." : "创建档案"}
          </button>
        </div>
      </div>
    </form>
  );
}
