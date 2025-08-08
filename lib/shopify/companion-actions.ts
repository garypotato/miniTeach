"use server";

import {
  checkUserNameExists,
  createCompanionProduct,
  createProductMetafields,
  addProductToCollection,
  updateProductStatus,
  updateProductMetafields,
  getProductWithMetafields,
} from "./products";
import shopify from "./client";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { generateAgeRange } from "./utils";

export async function checkEmailAvailability(email: string): Promise<{
  success: boolean;
  available?: boolean;
  message?: string;
  error?: string;
}> {
  try {
    if (!email) {
      return { success: false, error: "Email is required" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Invalid email format" };
    }

    // Check if user_name (email) already exists using GraphQL
    const exists = await checkUserNameExists(email);

    if (exists) {
      return {
        success: true,
        available: false,
        message: "此電子郵件地址已被使用",
      };
    }

    return {
      success: true,
      available: true,
      message: "電子郵件地址可用",
    };
  } catch {
    return {
      success: false,
      error: "無法驗證電子郵件唯一性，請稍後重試",
    };
  }
}

export async function createCompanion(formData: FormData): Promise<{
  success: boolean;
  data?: {
    id: number;
    title: string;
    status: string;
    metafields: number;
    images: number;
  };
  message?: string;
  error?: string;
}> {
  try {
    // Extract required fields
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const user_name = formData.get("user_name") as string; // email
    const major = formData.get("major") as string;
    const location = formData.get("location") as string;
    const password = formData.get("password") as string;
    const description = formData.get("description") as string;

    // Validate required fields
    if (
      !first_name ||
      !last_name ||
      !user_name ||
      !major ||
      !location ||
      !password ||
      !description
    ) {
      return { success: false, error: "Missing required fields" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_name)) {
      return { success: false, error: "Invalid email format" };
    }

    // Check if user_name (email) already exists
    const exists = await checkUserNameExists(user_name);
    if (exists) {
      return {
        success: false,
        error: "此電子郵件地址已被使用，請使用其他電子郵件地址",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Extract optional metafields
    const metafields = {
      wechat_id: (formData.get("wechat_id") as string) || "",
      education: (formData.get("education") as string) || "",
      language: ((formData.get("language") as string) || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      age: (formData.get("age") as string) || "",
      age_group: ((formData.get("age_group") as string) || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      blue_card: (formData.get("blue_card") as string) || "",
      police_check: (formData.get("police_check") as string) || "",
      skill: ((formData.get("skill") as string) || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      certification: ((formData.get("certification") as string) || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      availability: ((formData.get("availability") as string) || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    // Extract images
    const images = formData.getAll("images") as File[];

    // Validate images are provided
    if (
      !images ||
      images.length === 0 ||
      images.every((img) => img.size === 0)
    ) {
      return { success: false, error: "至少需要上傳1張照片" };
    }

    // Validate max 5 images
    if (images.length > 5) {
      return { success: false, error: "最多允許5張圖片" };
    }

    // Prepare title (first_name + last_name)
    const title = `${first_name} ${last_name}`;

    // Process images
    let processedImages: Array<{
      attachment: string;
      filename: string;
      alt: string;
      position: number;
    }> = [];

    try {
      const imagePromises = images.map(async (image, index) => {
        if (image.size > 0) {
          // Enhanced validation with detailed error messages
          const fileInfo = {
            name: image.name || `image-${index + 1}`,
            size: image.size,
            type: image.type,
            sizeMB: (image.size / 1024 / 1024).toFixed(2)
          };

          // Check file format first
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
          if (!allowedTypes.includes(image.type)) {
            throw new Error(`圖片 "${fileInfo.name}" 格式不支持 (${image.type || '未知格式'})。請使用 JPG、PNG、GIF 或 WebP 格式。`);
          }

          // iOS HEIC format detection (fallback check)
          if (image.name && (image.name.toLowerCase().endsWith('.heic') || image.name.toLowerCase().endsWith('.heif'))) {
            throw new Error(`圖片 "${fileInfo.name}" 是 HEIC 格式，iOS 設備請在設置中將相機格式改為「最相容」或轉換為 JPG 格式後再上傳。`);
          }

          // Dynamic size limits based on file type and estimated processing overhead
          const baseLimit = 15 * 1024 * 1024; // 15MB base limit
          let effectiveLimit = baseLimit;
          
          // Adjust limits for different formats (some compress better)
          if (image.type === 'image/png') {
            effectiveLimit = 12 * 1024 * 1024; // PNG files are typically larger after base64
          } else if (image.type === 'image/gif') {
            effectiveLimit = 10 * 1024 * 1024; // GIF can be large
          }

          if (image.size > effectiveLimit) {
            throw new Error(`圖片 "${fileInfo.name}" 太大 (${fileInfo.sizeMB}MB)。請壓縮圖片或選擇較小的圖片。建議大小: ${image.type === 'image/png' ? '12MB' : image.type === 'image/gif' ? '10MB' : '15MB'} 以下。`);
          }
          
          try {
            console.log(`Processing image: ${fileInfo.name} (${fileInfo.sizeMB}MB, ${fileInfo.type})`);
            
            const bytes = await image.arrayBuffer();
            
            // Check if arrayBuffer was successful
            if (!bytes || bytes.byteLength === 0) {
              throw new Error(`圖片 "${fileInfo.name}" 讀取失敗，可能文件已損壞。請重新選擇圖片。`);
            }

            const base64 = Buffer.from(bytes).toString("base64");
            const base64SizeMB = (base64.length * 3 / 4) / (1024 * 1024); // More accurate base64 size calculation
            
            console.log(`Image ${fileInfo.name}: Original ${fileInfo.sizeMB}MB -> Base64 ${base64SizeMB.toFixed(2)}MB`);
            
            // Shopify API has a 20MB limit per image
            if (base64SizeMB > 20) {
              throw new Error(`圖片 "${fileInfo.name}" 處理後太大 (${base64SizeMB.toFixed(1)}MB)。Shopify 限制單張圖片最大 20MB。請使用更小的圖片或進一步壓縮。`);
            }
            
            return {
              attachment: base64,
              filename: image.name || `companion-image-${index + 1}.jpg`,
              alt: `${title} - Image ${index + 1}`,
              position: index + 1,
            };
          } catch (processingError) {
            // Enhanced error handling with specific error types
            if (processingError instanceof Error) {
              if (processingError.message.includes('NetworkError') || processingError.message.includes('Failed to fetch')) {
                throw new Error(`圖片 "${fileInfo.name}" 網絡讀取錯誤。請檢查網絡連接或重新選擇圖片。`);
              } else if (processingError.message.includes('out of memory') || processingError.message.includes('Memory')) {
                throw new Error(`圖片 "${fileInfo.name}" 太大導致內存不足。請使用較小的圖片或重新啟動瀏覽器。`);
              } else if (processingError.message.includes('處理後太大') || processingError.message.includes('讀取失敗') || processingError.message.includes('限制')) {
                throw processingError; // Re-throw our custom errors
              } else {
                throw new Error(`圖片 "${fileInfo.name}" 處理失敗: ${processingError.message}`);
              }
            } else {
              throw new Error(`圖片 "${fileInfo.name}" 處理時發生未知錯誤。請重新選擇圖片或嘗試其他圖片。`);
            }
          }
        }
        return null;
      });

      const resolvedImages = await Promise.all(imagePromises);
      processedImages = resolvedImages.filter(
        (img) => img !== null
      ) as typeof processedImages;
      
      console.log(`Successfully processed ${processedImages.length} images`);
      
    } catch (error) {
      // Enhanced error logging for debugging
      console.error('Image processing failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        imageCount: images.length,
        imageSizes: images.map(img => ({ name: img.name, size: img.size, type: img.type }))
      });
      
      if (error instanceof Error) {
        return { success: false, error: error.message };
      } else {
        return { success: false, error: "圖片處理失敗，請檢查圖片格式和大小，或嘗試重新選擇圖片。" };
      }
    }

    // Create companion product using server action
    const companionProductData = {
      title,
      vendor: "Mini-Teach",
      product_type: "Companion",
      tags: "companion,child-care,education",
      images: processedImages,
    };

    const productResult = await createCompanionProduct(companionProductData);
    if (!productResult.success || !productResult.data) {
      return {
        success: false,
        error: productResult.error || "Failed to create product",
      };
    }

    const createdProduct = productResult.data;

    // Prepare metafields data
    const metafieldsData = [
      // Required fields as metafields
      {
        owner_resource: "product",
        owner_id: createdProduct.id,
        namespace: "custom",
        key: "user_name",
        value: user_name,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: createdProduct.id,
        namespace: "custom",
        key: "first_name",
        value: first_name,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: createdProduct.id,
        namespace: "custom",
        key: "last_name",
        value: last_name,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: createdProduct.id,
        namespace: "custom",
        key: "password",
        value: hashedPassword,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: createdProduct.id,
        namespace: "custom",
        key: "major",
        value: major,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: createdProduct.id,
        namespace: "custom",
        key: "location",
        value: location,
        type: "single_line_text_field",
      },
      // Optional fields (only create if not empty)
      ...(metafields.wechat_id
        ? [
            {
              owner_resource: "product",
              owner_id: createdProduct.id,
              namespace: "custom",
              key: "wechat_id",
              value: metafields.wechat_id,
              type: "single_line_text_field",
            },
          ]
        : []),
      ...(metafields.education
        ? [
            {
              owner_resource: "product",
              owner_id: createdProduct.id,
              namespace: "custom",
              key: "education",
              value: JSON.stringify([metafields.education]),
              type: "list.single_line_text_field",
            },
          ]
        : []),
      ...(metafields.language.length > 0
        ? [
            {
              owner_resource: "product",
              owner_id: createdProduct.id,
              namespace: "custom",
              key: "language",
              value: JSON.stringify(metafields.language),
              type: "list.single_line_text_field",
            },
          ]
        : []),
      ...(metafields.age
        ? [
            {
              owner_resource: "product",
              owner_id: createdProduct.id,
              namespace: "custom",
              key: "age",
              value: Number(metafields.age) || 0,
              type: "number_integer",
            },
            {
              owner_resource: "product",
              owner_id: createdProduct.id,
              namespace: "custom",
              key: "age_range",
              value: generateAgeRange(metafields.age),
              type: "single_line_text_field",
            },
          ]
        : []),
      ...(metafields.age_group.length > 0
        ? [
            {
              owner_resource: "product",
              owner_id: createdProduct.id,
              namespace: "custom",
              key: "age_group",
              value: metafields.age_group.join(" "),
              type: "single_line_text_field",
            },
          ]
        : []),
      ...(metafields.blue_card
        ? [
            {
              owner_resource: "product",
              owner_id: createdProduct.id,
              namespace: "custom",
              key: "blue_card",
              value: ["yes", "true", "是"].includes(
                metafields.blue_card.toLowerCase()
              )
                ? "true"
                : "false",
              type: "boolean",
            },
          ]
        : []),
      ...(metafields.police_check
        ? [
            {
              owner_resource: "product",
              owner_id: createdProduct.id,
              namespace: "custom",
              key: "police_check",
              value: ["yes", "true", "是"].includes(
                metafields.police_check.toLowerCase()
              )
                ? "true"
                : "false",
              type: "boolean",
            },
          ]
        : []),
      ...(metafields.skill.length > 0
        ? [
            {
              owner_resource: "product",
              owner_id: createdProduct.id,
              namespace: "custom",
              key: "skill",
              value: JSON.stringify(metafields.skill),
              type: "list.single_line_text_field",
            },
          ]
        : []),
      ...(metafields.certification.length > 0
        ? [
            {
              owner_resource: "product",
              owner_id: createdProduct.id,
              namespace: "custom",
              key: "certification",
              value: JSON.stringify(metafields.certification),
              type: "list.single_line_text_field",
            },
          ]
        : []),
      ...(metafields.availability.length > 0
        ? [
            {
              owner_resource: "product",
              owner_id: createdProduct.id,
              namespace: "custom",
              key: "availability",
              value: metafields.availability.join(" "),
              type: "single_line_text_field",
            },
          ]
        : []),
      {
        owner_resource: "product",
        owner_id: createdProduct.id,
        namespace: "custom",
        key: "description",
        value: description,
        type: "multi_line_text_field",
      },
    ];

    // Create metafields using server action
    const metafieldsToCreate = metafieldsData.map((field) => ({
      namespace: field.namespace,
      key: field.key,
      value: String(field.value), // Ensure all values are strings
      type: field.type,
    }));

    await createProductMetafields(
      createdProduct.id,
      metafieldsToCreate
    );
    // Add product to companion collection using server action
    await addProductToCollection(createdProduct.id, 491355177275);

    // Update product status to draft for review using server action
    await updateProductStatus(createdProduct.id, "draft");

    return {
      success: true,
      data: {
        id: createdProduct.id,
        title: createdProduct.title,
        status: "draft",
        metafields: metafieldsToCreate.length,
        images: processedImages.length,
      },
      message: "Companion profile created successfully and is pending review",
    };
  } catch {
    return { success: false, error: "Failed to create companion profile" };
  }
}

export async function createCompanionAndRedirect(formData: FormData) {
  const result = await createCompanion(formData);

  if (result.success) {
    redirect("/companion/create?success=true");
  } else {
    redirect(
      `/companion/create?error=${encodeURIComponent(
        result.error || "Unknown error"
      )}`
    );
  }
}

export async function updateCompanionLoginCredentials(
  user_name: string,
  password: string,
  confirm_password: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    // Get the current session server-side
    const session = await getServerAuthSession();

    if (!session?.user) {
      return { success: false, error: "未授权访问" };
    }

    const companionId = (session.user as { id?: string })?.id;

    if (!companionId) {
      return { success: false, error: "用户ID未找到" };
    }

    // Validation
    if (!user_name || !password || !confirm_password) {
      return { success: false, error: "所有字段都是必需的" };
    }

    if (password !== confirm_password) {
      return { success: false, error: "两次输入的密码不匹配" };
    }

    // Check if email already exists
    const emailExists = await checkUserNameExists(user_name);
    if (emailExists) {
      return { success: false, error: "该邮箱地址已被使用" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update metafields using the updateProductMetafields function
    const metafieldsToUpdate = [
      {
        namespace: "custom",
        key: "user_name",
        value: user_name,
        type: "single_line_text_field",
      },
      {
        namespace: "custom",
        key: "password",
        value: hashedPassword,
        type: "single_line_text_field",
      },
    ];

    const result = await updateProductMetafields(
      parseInt(companionId),
      metafieldsToUpdate
    );

    if (!result.success) {
      return { success: false, error: "更新登录信息失败" };
    }

    return { success: true, message: "登录信息更新成功" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新登录信息失败",
    };
  }
}

export async function updateCompanionProfile(
  formData: {
    first_name: string;
    last_name: string;
    user_name: string;
    major: string;
    location: string;
    age: string;
    description: string;
    education: string;
    language: string;
    blue_card: string;
    police_check: string;
    skill: string;
    certification: string;
    age_group: string;
    availability: string;
  },
  password: string,
  images?: File[],
  imagesToRemove?: number[]
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    // Get the current session server-side
    const session = await getServerAuthSession();

    if (!session?.user) {
      return { success: false, error: "未授权访问" };
    }

    const companionId = (session.user as { id?: string })?.id;

    if (!companionId) {
      return { success: false, error: "用户ID未找到" };
    }

    // Get current companion data to verify password
    const currentProfile = await getProductWithMetafields(companionId);
    if (!currentProfile.success || !currentProfile.data) {
      return { success: false, error: "获取当前档案失败" };
    }

    // Find current password metafield
    const currentPasswordField = currentProfile.data.metafields?.find(
      (field) => field.namespace === "custom" && field.key === "password"
    );

    if (!currentPasswordField) {
      return { success: false, error: "未找到当前密码" };
    }

    // Verify password - handle both bcrypt hashed and plain text passwords
    let passwordMatch = false;
    if (currentPasswordField.value.startsWith("$2")) {
      // Compare with hashed password
      passwordMatch = await bcrypt.compare(
        password,
        currentPasswordField.value
      );
    } else {
      // Plain text password comparison (for backward compatibility)
      passwordMatch = password === currentPasswordField.value;
    }

    if (!passwordMatch) {
      return { success: false, error: "密码不正确" };
    }

    // Handle profiles that may not have all required metafields (legacy profiles)
    // Use placeholder values for missing required fields
    if (!formData.first_name) {
      formData.first_name = "Unknown"; // Placeholder for missing first name
    }

    if (!formData.major) {
      formData.major = "未设置"; // Placeholder for missing major
    }

    if (!formData.location) {
      formData.location = "Sydney"; // Default location
    }

    // Only require fields that should genuinely be required
    if (!formData.last_name || !formData.user_name || !formData.description) {
      return { success: false, error: "姓氏、邮箱地址和个人介绍是必填字段" };
    }

    // Check if email is changing and if new email already exists
    const currentEmailField = currentProfile.data.metafields?.find(
      (field) => field.namespace === "custom" && field.key === "user_name"
    );

    if (currentEmailField && currentEmailField.value !== formData.user_name) {
      const emailExists = await checkUserNameExists(formData.user_name);
      if (emailExists) {
        return { success: false, error: "该邮箱地址已被使用" };
      }
    }

    // Process images if provided
    let processedImages: Array<{
      attachment: string;
      filename: string;
      alt: string;
      position: number;
    }> = [];

    if (images && images.length > 0) {
      try {
        const imagePromises = images.map(async (image, index) => {
          if (image.size > 0) {
            const bytes = await image.arrayBuffer();
            const base64 = Buffer.from(bytes).toString("base64");
            return {
              attachment: base64,
              filename: image.name || `companion-image-${index + 1}.jpg`,
              alt: `${formData.first_name} ${formData.last_name} - Image ${
                index + 1
              }`,
              position: index + 1,
            };
          }
          return null;
        });

        const resolvedImages = await Promise.all(imagePromises);
        processedImages = resolvedImages.filter(
          (img) => img !== null
        ) as typeof processedImages;
      } catch {
        return { success: false, error: "图片处理失败" };
      }
    }

    // Handle image management - both adding new and removing existing
    let finalImages: Array<{
      attachment: string;
      filename: string;
      alt: string;
      position: number;
    }> = [];

    // If we have new images or images to remove, we need to rebuild the images array
    if (
      processedImages.length > 0 ||
      (imagesToRemove && imagesToRemove.length > 0)
    ) {
      // Get current product images
      const currentImages = currentProfile.data.images || [];

      // Filter out images marked for removal and convert existing images to the format needed
      const existingImages = currentImages
        .filter((_, index) => !imagesToRemove?.includes(index))
        .map((image, index) => ({
          src: image.src,
          alt:
            image.alt ||
            `${formData.first_name} ${formData.last_name} - Image ${index + 1}`,
          position: index + 1,
        }));

      // Combine existing images (that weren't removed) with new images
      finalImages = [
        ...processedImages,
        // For existing images, we need to fetch them as base64 to update the product
        ...(await Promise.all(
          existingImages.map(async (image, index) => {
            try {
              // Fetch the image from the URL
              const response = await fetch(image.src);
              const arrayBuffer = await response.arrayBuffer();
              const base64 = Buffer.from(arrayBuffer).toString("base64");

              return {
                attachment: base64,
                filename: `existing-image-${index + 1}.jpg`,
                alt: image.alt,
                position: processedImages.length + index + 1,
              };
            } catch {
              // Skip this image if we can't fetch it
              return null;
            }
          })
        )),
      ].filter(Boolean) as typeof finalImages;
    }

    // Update product title and images (description is now a metafield)
    const newTitle = `${formData.first_name} ${formData.last_name}`;
    const updateData: {
      title: string;
      images?: Array<{
        attachment: string;
        filename: string;
        alt: string;
        position: number;
      }>;
    } = {
      title: newTitle,
    };

    // Add images to update if we have processed images or removals
    if (
      finalImages.length > 0 ||
      (imagesToRemove && imagesToRemove.length > 0)
    ) {
      updateData.images = finalImages;
    }

    await shopify.product.update(parseInt(companionId), updateData);

    // Prepare metafields for update
    const metafieldsToUpdate = [
      {
        namespace: "custom",
        key: "first_name",
        value: formData.first_name,
        type: "single_line_text_field",
      },
      {
        namespace: "custom",
        key: "last_name",
        value: formData.last_name,
        type: "single_line_text_field",
      },
      {
        namespace: "custom",
        key: "user_name",
        value: formData.user_name,
        type: "single_line_text_field",
      },
      {
        namespace: "custom",
        key: "major",
        value: formData.major,
        type: "single_line_text_field",
      },
      {
        namespace: "custom",
        key: "location",
        value: formData.location,
        type: "single_line_text_field",
      },
      {
        namespace: "custom",
        key: "age",
        value: String(parseInt(formData.age) || 0),
        type: "number_integer",
      },
      {
        namespace: "custom",
        key: "age_range",
        value: generateAgeRange(formData.age),
        type: "single_line_text_field",
      },
      {
        namespace: "custom",
        key: "education",
        value: formData.education
          ? JSON.stringify([formData.education])
          : JSON.stringify(["未设置"]),
        type: "list.single_line_text_field",
      },
      {
        namespace: "custom",
        key: "language",
        value: formData.language
          ? JSON.stringify(
              formData.language
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          : JSON.stringify(["未设置"]),
        type: "list.single_line_text_field",
      },
      {
        namespace: "custom",
        key: "blue_card",
        value: formData.blue_card
          ? ["yes", "true", "是"].includes(formData.blue_card.toLowerCase())
            ? "true"
            : "false"
          : "false",
        type: "boolean",
      },
      {
        namespace: "custom",
        key: "police_check",
        value: formData.police_check
          ? ["yes", "true", "是"].includes(formData.police_check.toLowerCase())
            ? "true"
            : "false"
          : "false",
        type: "boolean",
      },
      {
        namespace: "custom",
        key: "skill",
        value: formData.skill
          ? JSON.stringify(
              formData.skill
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          : JSON.stringify(["未设置"]),
        type: "list.single_line_text_field",
      },
      {
        namespace: "custom",
        key: "certification",
        value: formData.certification
          ? JSON.stringify(
              formData.certification
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          : JSON.stringify(["未设置"]),
        type: "list.single_line_text_field",
      },
      {
        namespace: "custom",
        key: "age_group",
        value: formData.age_group
          ? formData.age_group
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .join(" ")
          : "未设置",
        type: "single_line_text_field",
      },
      {
        namespace: "custom",
        key: "availability",
        value: formData.availability
          ? formData.availability
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .join(" ")
          : "未设置",
        type: "single_line_text_field",
      },
      {
        namespace: "custom",
        key: "description",
        value: formData.description,
        type: "multi_line_text_field",
      },
    ];


    // Update metafields
    const result = await updateProductMetafields(
      parseInt(companionId),
      metafieldsToUpdate
    );

    if (!result.success) {
      return { success: false, error: "更新档案信息失败" };
    }

    return { success: true, message: "档案信息更新成功" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新档案信息失败",
    };
  }
}
