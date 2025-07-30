"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

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
    if (formData.images.length > 5) {
      newErrors.images = "最多允許5張圖片";
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

          <FormField
            label="電子郵件地址"
            name="user_name"
            type="email"
            placeholder="請輸入您的電子郵件地址"
            value={formData.user_name}
            onChange={handleInputChange}
            error={errors.user_name}
            required
          />

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
              { value: "", label: "選擇您的城市..." },
              {
                value: "sydney",
                label: "悉尼",
              },
              {
                value: "melbourne",
                label: "墨爾本",
              },
              {
                value: "brisbane",
                label: "布里斯班",
              },
              {
                value: "goldCoast",
                label: "黃金海岸",
              },
              {
                value: "adelaide",
                label: "阿德萊德",
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

          <FormField
            label="教育程度"
            name="education"
            type="text"
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
          <MultiSelectField
            label="使用語言"
            name="language"
            placeholder="選擇您會說的語言"
            value={formData.language}
            onChange={handleInputChange}
            options={[
              {
                value: "english",
                label: "英語",
              },
              {
                value: "mandarin",
                label: "普通話",
              },
              {
                value: "cantonese",
                label: "廣東話",
              },
              {
                value: "spanish",
                label: "西班牙語",
              },
              {
                value: "french",
                label: "法語",
              },
              {
                value: "japanese",
                label: "日語",
              },
              {
                value: "korean",
                label: "韓語",
              },
              {
                value: "other",
                label: "其他",
              },
            ]}
          />

          <MultiSelectField
            label="偏好年齡組"
            name="age_group"
            placeholder="您偏好工作的年齡組"
            value={formData.age_group}
            onChange={handleInputChange}
            options={[
              {
                value: "infants",
                label: "嬰兒 (0-2歲)",
              },
              {
                value: "toddlers",
                label: "幼兒 (2-4歲)",
              },
              {
                value: "preschool",
                label: "學前兒童 (4-6歲)",
              },
              {
                value: "schoolAge",
                label: "學齡兒童 (6-12歲)",
              },
              {
                value: "teenagers",
                label: "青少年 (12歲以上)",
              },
            ]}
          />

          <MultiSelectField
            label="技能"
            name="skill"
            placeholder="選擇您的技能"
            value={formData.skill}
            onChange={handleInputChange}
            options={[
              {
                value: "musicLessons",
                label: "音樂課程",
              },
              {
                value: "artCrafts",
                label: "藝術和工藝",
              },
              {
                value: "cooking",
                label: "烹飪",
              },
              {
                value: "sportsFitness",
                label: "運動和健身",
              },
              {
                value: "languageTutoring",
                label: "語言輔導",
              },
              {
                value: "homeworkHelp",
                label: "作業輔助",
              },
              {
                value: "specialNeeds",
                label: "特殊需求支援",
              },
              {
                value: "firstAid",
                label: "急救認證",
              },
            ]}
          />

          <MultiSelectField
            label="認證"
            name="certification"
            placeholder="選擇您的認證"
            value={formData.certification}
            onChange={handleInputChange}
            options={[
              {
                value: "earlyChildhood",
                label: "幼兒教育",
              },
              {
                value: "firstAid",
                label: "急救",
              },
              {
                value: "cpr",
                label: "心肺復甦術",
              },
              {
                value: "specialEducation",
                label: "特殊教育",
              },
              {
                value: "tefl",
                label: "TEFL/TESOL",
              },
              {
                value: "montessori",
                label: "蒙特梭利",
              },
              {
                value: "musicEducation",
                label: "音樂教育",
              },
              {
                value: "other",
                label: "其他專業認證",
              },
            ]}
          />

          <MultiSelectField
            label="可用性"
            name="availability"
            placeholder="您何時有空？"
            value={formData.availability}
            onChange={handleInputChange}
            options={[
              {
                value: "weekdayMornings",
                label: "工作日早上",
              },
              {
                value: "weekdayAfternoons",
                label: "工作日下午",
              },
              {
                value: "weekdayEvenings",
                label: "工作日晚上",
              },
              {
                value: "weekendMornings",
                label: "週末早上",
              },
              {
                value: "weekendAfternoons",
                label: "週末下午",
              },
              {
                value: "weekendEvenings",
                label: "週末晚上",
              },
              {
                value: "holidays",
                label: "學校假期",
              },
              {
                value: "emergency",
                label: "緊急照護",
              },
            ]}
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">檔案照片</h2>
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
