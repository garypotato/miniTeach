import { NextRequest, NextResponse } from "next/server";
import shopifyClient from "../../services/shopify/client";
import bcrypt from "bcryptjs";

// POST - Create new companion
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

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
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_name)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Extract optional metafields
    const metafields = {
      wechat_id: (formData.get("wechat_id") as string) || "",
      education: (formData.get("education") as string) || "",
      language: JSON.parse((formData.get("language") as string) || "[]"),
      age: (formData.get("age") as string) || "",
      age_group: JSON.parse((formData.get("age_group") as string) || "[]"),
      blue_card: (formData.get("blue_card") as string) || "",
      police_check: (formData.get("police_check") as string) || "",
      skill: JSON.parse((formData.get("skill") as string) || "[]"),
      certification: JSON.parse(
        (formData.get("certification") as string) || "[]"
      ),
      availability: JSON.parse(
        (formData.get("availability") as string) || "[]"
      ),
    };

    // Extract images
    const images = formData.getAll("images") as File[];

    // Prepare title (first_name + last_name)
    const title = `${first_name} ${last_name}`;

    // Create companion product
    const companionData = {
      title,
      body_html: description,
      vendor: "Mini-Teach",
      product_type: "Companion",
      status: "active", // Create as active first to establish sales channel connections
      tags: "companion,child-care,education",
    };

    // Process images if provided
    let processedImages: Array<{
      attachment: string;
      filename: string;
      alt: string;
      position: number;
    }> = [];

    if (images && images.length > 0) {
      // Validate max 5 images
      if (images.length > 5) {
        return NextResponse.json(
          { success: false, error: "Maximum 5 images allowed" },
          { status: 400 }
        );
      }

      try {
        const imagePromises = images.map(async (image, index) => {
          if (image.size > 0) {
            const bytes = await image.arrayBuffer();
            const base64 = Buffer.from(bytes).toString("base64");
            return {
              attachment: base64,
              filename: image.name || `companion-image-${index + 1}.jpg`,
              alt: `${title} - Image ${index + 1}`,
              position: index + 1,
            };
          }
          return null;
        });

        const resolvedImages = await Promise.all(imagePromises);
        processedImages = resolvedImages.filter(
          (img) => img !== null
        ) as typeof processedImages;
      } catch (imageError) {
        console.error("Error processing images:", imageError);
        return NextResponse.json(
          { success: false, error: "Failed to process images" },
          { status: 500 }
        );
      }
    }

    // Create product with images
    const productWithImages = {
      ...companionData,
      ...(processedImages.length > 0 && { images: processedImages }),
    };

    const createdProduct = await shopifyClient.product.create(
      productWithImages
    );

    // Prepare metafields data (including required fields)
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
              value: metafields.education,
              type: "single_line_text_field",
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
              type: "json",
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
              value: metafields.age,
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
              value: JSON.stringify(metafields.age_group),
              type: "json",
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
              value: metafields.blue_card,
              type: "single_line_text_field",
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
              value: metafields.police_check,
              type: "single_line_text_field",
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
              type: "json",
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
              type: "json",
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
              value: JSON.stringify(metafields.availability),
              type: "json",
            },
          ]
        : []),
    ];

    // Create metafields
    const createdMetafields = [];
    for (const metafieldData of metafieldsData) {
      try {
        const created = await shopifyClient.metafield.create(metafieldData);
        createdMetafields.push(created);
      } catch (metafieldError) {
        console.warn(
          `Failed to create metafield ${metafieldData.key}:`,
          metafieldError
        );
        // Continue with other metafields even if one fails
      }
    }

    // Add product to companion collection
    try {
      await shopifyClient.collect.create({
        product_id: createdProduct.id,
        collection_id: 491355177275, // Companion collection ID
      });
    } catch (collectError) {
      console.warn(
        "Failed to add product to companion collection:",
        collectError
      );
      // Continue even if collection assignment fails
    }

    // Update product status to draft for review (after establishing sales channel connections)
    try {
      await shopifyClient.product.update(createdProduct.id, {
        status: "draft",
      });
    } catch (updateError) {
      console.warn("Failed to update product status to draft:", updateError);
      // Continue even if status update fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: createdProduct.id,
        title: createdProduct.title,
        status: "draft", // Report as draft since we updated it
        metafields: createdMetafields.length,
        images: processedImages.length,
      },
      message: "Companion profile created successfully and is pending review",
    });
  } catch (error) {
    console.error("Error creating companion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create companion profile" },
      { status: 500 }
    );
  }
}
