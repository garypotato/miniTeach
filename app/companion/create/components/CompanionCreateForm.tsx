"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import FormField from "./FormField";
import LoadingSpinner from "./LoadingSpinner";
import ImageUpload from "./ImageUpload";
import TagsInput from "./TagsInput";
import { checkEmailAvailability, createCompanion } from "../actions";

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

    // All fields are now required
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
    }
    if (!formData.wechat_id.trim()) {
      newErrors.wechat_id = "此栏位为必填";
    }
    if (!formData.education.trim()) {
      newErrors.education = "此栏位为必填";
    }
    if (!formData.language.trim()) {
      newErrors.language = "此栏位为必填";
    }
    if (!formData.age.trim()) {
      newErrors.age = "此栏位为必填";
    }
    if (!formData.age_group.trim()) {
      newErrors.age_group = "此栏位为必填";
    }
    if (!formData.blue_card.trim()) {
      newErrors.blue_card = "此栏位为必填";
    }
    if (!formData.police_check.trim()) {
      newErrors.police_check = "此栏位为必填";
    }
    if (!formData.skill.trim()) {
      newErrors.skill = "此栏位为必填";
    }
    if (!formData.certification.trim()) {
      newErrors.certification = "此栏位为必填";
    }
    if (!formData.availability.trim()) {
      newErrors.availability = "此栏位为必填";
    }

    // Image validation
    if (formData.images.length === 0) {
      newErrors.images = "至少需要上传1张照片";
    } else if (formData.images.length > 5) {
      newErrors.images = "最多允许5张图片";
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
          user_name: "此电子邮件地址已被使用，请使用其他电子邮件地址",
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
        // Optional: redirect after showing success
        setTimeout(() => {
          router.push("/companions");
        }, 2000);
      } else {
        setSubmitStatus("error");
        setErrors({ general: result.error || "创建档案失败，请重试" });
      }
    } catch (error) {
      setSubmitStatus("error");
      
      // Preserve original error for debugging
      let errorMessage = "网络错误或其他问题，请检查网络连接并重试";
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

          {/* Enhanced error display with detailed debugging information */}
          {errors.general && (
            <div className="bg-white border border-red-300 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-red-800 mb-2">错误详情：</h3>
              <p className="text-sm text-red-700 mb-3">{errors.general}</p>
              
              {/* Device and browser information for debugging */}
              <div className="bg-gray-50 border rounded p-3 mb-3 text-xs">
                <h4 className="font-semibold text-gray-700 mb-1">调试信息 (请截图给开发团队)：</h4>
                <div className="space-y-1 text-gray-600">
                  <p>• 设备: {navigator.userAgent.includes('iPhone') ? 'iPhone' : navigator.userAgent.includes('iPad') ? 'iPad' : navigator.userAgent.includes('Android') ? 'Android' : 'Desktop'}</p>
                  <p>• 浏览器: {navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome') ? 'Safari' : navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Other'}</p>
                  <p>• 时间: {new Date().toLocaleString('zh-CN')}</p>
                  <p>• 错误消息: {errors.general}</p>
                  {formData.images.length > 0 && (
                    <>
                      <p>• 图片数量: {formData.images.length}</p>
                      <p>• 图片详情:</p>
                      {formData.images.map((img, index) => (
                        <p key={index} className="ml-4">
                          - {img.name || `Image ${index + 1}`}: {(img.size / 1024 / 1024).toFixed(2)}MB ({img.type || '未知格式'})
                        </p>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Original raw error details for developer debugging */}
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-3 text-xs">
                <h4 className="font-semibold text-red-800 mb-1">原始错误详情 (开发者调试用)：</h4>
                <div className="space-y-1 text-red-700">
                  <p><strong>错误类型:</strong> {typeof errors.general}</p>
                  <p><strong>错误内容:</strong> {errors.general}</p>
                  <p><strong>错误长度:</strong> {errors.general?.length || 0} 字符</p>
                  <div className="bg-white border rounded p-2 mt-2 font-mono text-xs overflow-auto max-h-32">
                    <strong>原始错误 (Raw Error):</strong><br/>
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
                <p><strong>解决方案：</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {errors.general.includes('HEIC') || errors.general.includes('heic') ? (
                    <>
                      <li><strong>iOS HEIC 格式问题:</strong> 请到 设置 → 相机 → 格式，选择「最兼容」</li>
                      <li>或将 HEIC 照片转换为 JPG 格式（可在照片 App 中分享时选择）</li>
                      <li>重新拍摄照片或选择其他 JPG/PNG 照片</li>
                    </>
                  ) : errors.general.includes('格式不支持') || errors.general.includes('format') ? (
                    <>
                      <li>仅支持 JPG、PNG、GIF、WebP 格式</li>
                      <li>如果是 iOS，请检查相机设置是否为「最兼容」模式</li>
                      <li>尝试用其他 App 转换图片格式</li>
                    </>
                  ) : errors.general.includes('太大') || errors.general.includes('large') || errors.general.includes('size') ? (
                    <>
                      <li><strong>图片太大:</strong> JPG/WebP: 15MB以下，PNG: 12MB以下，GIF: 10MB以下</li>
                      <li>使用手机内置的图片编辑功能压缩图片</li>
                      <li>重新拍摄时选择较低分辨率</li>
                      <li>尝试在线图片压缩工具</li>
                    </>
                  ) : errors.general.includes('内存不足') || errors.general.includes('memory') || errors.general.includes('Memory') ? (
                    <>
                      <li><strong>内存不足:</strong> 重新启动浏览器或 App</li>
                      <li>关闭其他 App 或浏览器标签页</li>
                      <li>使用较小的图片（建议 5MB 以下）</li>
                      <li>一次只上传 1-2 张图片，分批处理</li>
                    </>
                  ) : errors.general.includes('网络') || errors.general.includes('Network') || errors.general.includes('network') ? (
                    <>
                      <li>检查网络连接稳定性</li>
                      <li>尝试切换 WiFi 和移动网络</li>
                      <li>稍后重试或重新刷新页面</li>
                    </>
                  ) : errors.general.includes('读取失败') || errors.general.includes('损坏') ? (
                    <>
                      <li>图片文件可能已损坏，请重新选择</li>
                      <li>尝试将图片保存到相册后再选择</li>
                      <li>重新拍摄照片</li>
                    </>
                  ) : errors.general.includes('邮件') || errors.general.includes('email') || errors.general.includes('電子郵件') ? (
                    <>
                      <li>检查电子邮件格式是否正确</li>
                      <li>尝试使用其他电子邮件地址</li>
                      <li>确保电子邮件地址未被其他用户使用</li>
                    </>
                  ) : errors.general.includes('Shopify') || errors.general.includes('API') ? (
                    <>
                      <li>服务器暂时无法处理请求，请稍后重试</li>
                      <li>检查网络连接</li>
                      <li>如果持续失败，请联系技术支持</li>
                    </>
                  ) : (
                    <>
                      <li>检查所有必填字段是否已填写</li>
                      <li>确保个人介绍不为空</li>
                      <li>检查图片格式和大小</li>
                      <li>尝试重新提交表单</li>
                      <li>如果问题持续，请联系技术支持并提供上述调试信息</li>
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
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">创建陪伴师档案</h1>
        <p className="mt-2 text-gray-600">
          填写您的基本信息以创建陪伴师档案
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
            基本信息
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              ref={(el) => {
                fieldRefs.current["first_name"] = el;
              }}
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
              ref={(el) => {
                fieldRefs.current["last_name"] = el;
              }}
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
                ref={(el) => {
                  fieldRefs.current["user_name"] = el;
                }}
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
              ref={(el) => {
                fieldRefs.current["password"] = el;
              }}
              label="密码"
              name="password"
              type="password"
              placeholder="创建一个安全的密码"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
            />

            <FormField
              ref={(el) => {
                fieldRefs.current["age"] = el;
              }}
              label="年龄"
              name="age"
              type="number"
              placeholder="您的年龄"
              value={formData.age}
              onChange={handleInputChange}
              error={errors.age}
              required
            />

            <FormField
              ref={(el) => {
                fieldRefs.current["wechat_id"] = el;
              }}
              label="微信号"
              name="wechat_id"
              type="text"
              placeholder="您的微信ID"
              value={formData.wechat_id}
              onChange={handleInputChange}
              error={errors.wechat_id}
              required
            />

            <FormField
              ref={(el) => {
                fieldRefs.current["location"] = el;
              }}
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">关于我</h2>
          <FormField
            ref={(el) => {
              fieldRefs.current["description"] = el;
            }}
            label="个人介绍"
            name="description"
            type="textarea"
            placeholder="告诉家长们关于您自己、您的经验和儿童照护方法..."
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
            技能与资质
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              ref={(el) => {
                fieldRefs.current["major"] = el;
              }}
              label="专业"
              name="major"
              type="text"
              placeholder="例如：教育、幼儿发展、心理学"
              value={formData.major}
              onChange={handleInputChange}
              error={errors.major}
              required
            />

            <TagsInput
              ref={(el) => {
                fieldRefs.current["education"] = el;
              }}
              label="教育背景"
              name="education"
              placeholder="例如：学士学位、硕士学位"
              value={formData.education}
              onChange={handleInputChange}
              error={errors.education}
              required
            />

            <TagsInput
              ref={(el) => {
                fieldRefs.current["language"] = el;
              }}
              label="语言能力"
              name="language"
              placeholder="请输入您会说的语言"
              value={formData.language}
              onChange={handleInputChange}
              error={errors.language}
              required
            />

            <FormField
              ref={(el) => {
                fieldRefs.current["blue_card"] = el;
              }}
              label="蓝卡/WWCC"
              name="blue_card"
              type="select"
              placeholder="您是否持有蓝卡或与儿童工作检查？"
              value={formData.blue_card}
              onChange={handleInputChange}
              error={errors.blue_card}
              required
              options={[
                { value: "", label: "请选择" },
                { value: "是", label: "是" },
                { value: "否", label: "否" },
                { value: "申请中", label: "申请中" },
              ]}
            />

            <FormField
              ref={(el) => {
                fieldRefs.current["police_check"] = el;
              }}
              label="警察检查"
              name="police_check"
              type="select"
              placeholder="您是否有有效的警察许可？"
              value={formData.police_check}
              onChange={handleInputChange}
              error={errors.police_check}
              required
              options={[
                { value: "", label: "请选择" },
                { value: "是", label: "是" },
                { value: "否", label: "否" },
                { value: "申请中", label: "申请中" },
              ]}
            />

            <TagsInput
              ref={(el) => {
                fieldRefs.current["skill"] = el;
              }}
              label="技能"
              name="skill"
              placeholder="请输入您的专业技能"
              value={formData.skill}
              onChange={handleInputChange}
              error={errors.skill}
              required
            />

            <TagsInput
              ref={(el) => {
                fieldRefs.current["certification"] = el;
              }}
              label="证书/毕业证"
              name="certification"
              placeholder="请输入您的相关证书或资格"
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
            偏好设置
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TagsInput
              ref={(el) => {
                fieldRefs.current["age_group"] = el;
              }}
              label="偏好年龄组"
              name="age_group"
              placeholder="请输入您偏好工作的年龄组"
              value={formData.age_group}
              onChange={handleInputChange}
              error={errors.age_group}
              required
            />

            <TagsInput
              ref={(el) => {
                fieldRefs.current["availability"] = el;
              }}
              label="时间安排"
              name="availability"
              placeholder="没特别的时间安排，请写：均可 / 时间灵活"
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
            档案照片
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            请上传至少1张照片，最多5张 (每张图片最大5MB)
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
    </div>
  );
}
