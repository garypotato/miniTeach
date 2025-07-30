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
      newErrors.first_name = "此欄位為必填";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "此欄位為必填";
    }
    if (!formData.user_name.trim()) {
      newErrors.user_name = "此欄位為必填";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_name)) {
      newErrors.user_name = "請輸入有效的電子郵件地址";
    }
    if (!formData.password.trim()) {
      newErrors.password = "此欄位為必填";
    } else if (
      formData.password.length < 8 ||
      !/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)
    ) {
      newErrors.password = "密碼必須至少8個字符，包含字母和數字";
    }
    if (!formData.major.trim()) {
      newErrors.major = "此欄位為必填";
    }
    if (!formData.location.trim()) {
      newErrors.location = "此欄位為必填";
    }
    if (!formData.description.trim()) {
      newErrors.description = "此欄位為必填";
    } else if (formData.description.length < 50) {
      newErrors.description = "必須至少50個字符";
    }

    // Image validation
    if (formData.images.length === 0) {
      newErrors.images = "至少需要上傳1張照片";
    } else if (formData.images.length > 5) {
      newErrors.images = "最多允許5張圖片";
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
      const response = await fetch('/api/companions/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      if (!result.available) {
        setErrors(prev => ({ ...prev, user_name: "此電子郵件地址已被使用，請使用其他電子郵件地址" }));
        return false;
      }
      
      // Clear email error if available
      setErrors(prev => ({ ...prev, user_name: "" }));
      return true;
    } catch (error) {
      console.error('Error checking email uniqueness:', error);
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
    if (name === 'user_name' && typeof value === 'string') {
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
            檔案創建成功！
          </h2>
          <p className="text-green-700 mb-6">
            您的陪伴者檔案已提交審核。我們將在2-3個工作日內聯絡您進行下一步。
          </p>
          <div className="text-left bg-white rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              接下來會發生什麼：
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>我們團隊審核您的申請</li>
              <li>我們驗證您的資格和背景</li>
              <li>審核通過後您的檔案將上線</li>
              <li>家庭可以找到並聯絡您</li>
            </ol>
          </div>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            返回首頁
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
          <h2 className="text-2xl font-bold text-red-900 mb-4">創建檔案錯誤</h2>
          <p className="text-red-700 mb-6">
            我們在創建您的檔案時遇到錯誤。請重試。
          </p>
          <div className="space-x-4">
            <button
              onClick={() => setSubmitStatus("idle")}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              重試
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              聯絡支援
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
          必填欄位
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="名字"
            name="first_name"
            type="text"
            placeholder="請輸入您的名字"
            value={formData.first_name}
            onChange={handleInputChange}
            error={errors.first_name}
            required
          />

          <FormField
            label="姓氏"
            name="last_name"
            type="text"
            placeholder="請輸入您的姓氏"
            value={formData.last_name}
            onChange={handleInputChange}
            error={errors.last_name}
            required
          />

          <div className="relative">
            <FormField
              label="電子郵件地址"
              name="user_name"
              type="email"
              placeholder="請輸入您的電子郵件地址"
              value={formData.user_name}
              onChange={handleInputChange}
              error={errors.user_name}
              required
              disabled={isCheckingEmail}
            />
            {isCheckingEmail && (
              <div className="absolute right-3 top-9 flex items-center">
                <LoadingSpinner className="w-4 h-4 text-blue-600" />
                <span className="ml-2 text-sm text-gray-500">檢查中...</span>
              </div>
            )}
          </div>

          <FormField
            label="密碼"
            name="password"
            type="password"
            placeholder="創建一個安全的密碼"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
          />

          <FormField
            label="專業/學習領域"
            name="major"
            type="text"
            placeholder="例如：教育、幼兒發展"
            value={formData.major}
            onChange={handleInputChange}
            error={errors.major}
            required
          />

          <FormField
            label="位置"
            name="location"
            type="select"
            placeholder="選擇您的城市"
            value={formData.location}
            onChange={handleInputChange}
            error={errors.location}
            required
            options={[
              { value: "", label: "Select your city..." },
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
            placeholder="告訴家庭關於您自己、您的經驗和兒童照護方法..."
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
            檔案照片
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            請上傳至少1張照片，最多5張 (每張圖片最大5MB)
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">選填欄位</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="微信號"
            name="wechat_id"
            type="text"
            placeholder="您的微信識別碼"
            value={formData.wechat_id}
            onChange={handleInputChange}
          />

          <TagsInput
            label="教育程度"
            name="education"
            placeholder="例如：學士學位、碩士學位"
            value={formData.education}
            onChange={handleInputChange}
          />

          <FormField
            label="年齡"
            name="age"
            type="number"
            placeholder="您的年齡"
            value={formData.age}
            onChange={handleInputChange}
          />

          <FormField
            label="藍卡 / WWCC"
            name="blue_card"
            type="select"
            placeholder="您是否持有藍卡或與兒童工作檢查？"
            value={formData.blue_card}
            onChange={handleInputChange}
            options={[
              { value: "", label: "選擇..." },
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
                label: "申請中",
              },
            ]}
          />

          <FormField
            label="警察檢查"
            name="police_check"
            type="select"
            placeholder="您是否有有效的警察許可？"
            value={formData.police_check}
            onChange={handleInputChange}
            options={[
              { value: "", label: "選擇..." },
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
                label: "申請中",
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          <TagsInput
            label="使用語言"
            name="language"
            placeholder="請輸入您會說的語言"
            value={formData.language}
            onChange={handleInputChange}
          />

          <TagsInput
            label="偏好年齡組"
            name="age_group"
            placeholder="請輸入您偏好工作的年齡組"
            value={formData.age_group}
            onChange={handleInputChange}
          />

          <TagsInput
            label="技能"
            name="skill"
            placeholder="請輸入您的技能"
            value={formData.skill}
            onChange={handleInputChange}
          />

          <TagsInput
            label="認證"
            name="certification"
            placeholder="請輸入您的認證"
            value={formData.certification}
            onChange={handleInputChange}
          />

          <TagsInput
            label="可用性"
            name="availability"
            placeholder="請輸入您的可用時間"
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
            {isSubmitting ? "正在創建檔案..." : "創建檔案"}
          </button>
        </div>
      </div>
    </form>
  );
}
