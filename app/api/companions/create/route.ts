import { NextRequest, NextResponse } from "next/server";
import shopify from "../../../api/initialShopify";

interface CompanionCreateRequest {
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string;
  collection_id: string;
  images?: File[];
  metafields: {
    age: string;
    current_location_in_australia: string;
    available_times_to_take_jobs: string[];
    relevant_skills: string[];
    other_certificates: string;
    australian_police_check: string;
    blue_card_status: string;
    preferred_age_group_to_work: string;
    school_major_you_re_studying: string;
  };
}


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const title = formData.get('title') as string;
    const body_html = formData.get('body_html') as string;
    const vendor = formData.get('vendor') as string;
    const product_type = formData.get('product_type') as string;
    const tags = formData.get('tags') as string;
    const collection_id = formData.get('collection_id') as string;
    
    // Extract metafields
    const metafields = {
      age: formData.get('metafields.age') as string || '',
      current_location_in_australia: formData.get('metafields.current_location_in_australia') as string || '',
      available_times_to_take_jobs: JSON.parse(formData.get('metafields.available_times_to_take_jobs') as string || '[]'),
      relevant_skills: JSON.parse(formData.get('metafields.relevant_skills') as string || '[]'),
      other_certificates: formData.get('metafields.other_certificates') as string || '',
      australian_police_check: formData.get('metafields.australian_police_check') as string || '',
      blue_card_status: formData.get('metafields.blue_card_status') as string || '',
      preferred_age_group_to_work: formData.get('metafields.preferred_age_group_to_work') as string || '',
      school_major_you_re_studying: formData.get('metafields.school_major_you_re_studying') as string || '',
    };
    
    // Extract images
    const images = formData.getAll('images') as File[];
    
    const body: CompanionCreateRequest = {
      title,
      body_html,
      vendor,
      product_type,
      tags,
      collection_id,
      images: images.length > 0 ? images : undefined,
      metafields
    };

    // Validate required fields
    if (!title || !body_html || !collection_id) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, body_html, or collection_id" },
        { status: 400 }
      );
    }

    // Note: All metafields are optional, no validation needed

    // Prepare images for Shopify if present
    let processedImages: Array<{
      attachment: string;
      filename: string;
      alt: string;
      position: number;
    }> = [];
    if (body.images && body.images.length > 0) {
      try {
        const imagesWithNull = await Promise.all(
          body.images.map(async (image, index) => {
            if (image.size > 0) {
              const bytes = await image.arrayBuffer();
              const buffer = Buffer.from(bytes);
              return {
                attachment: buffer.toString('base64'),
                filename: image.name,
                alt: `${title} - Profile Image ${index + 1}`,
                position: index + 1
              };
            }
            return null;
          })
        );
        processedImages = imagesWithNull.filter(Boolean) as Array<{
          attachment: string;
          filename: string;
          alt: string;
          position: number;
        }>;
      } catch (imageError) {
        console.warn('Error processing images:', imageError);
        processedImages = [];
      }
    }

    // Create the product data
    const productData = {
      title,
      body_html,
      vendor: vendor || "MiniTeach",
      product_type: product_type || "Companion",
      tags: tags || "companion,childcare,education",
      status: "active",
      published: true,
      published_scope: "web",
      // Add images if we have them
      ...(processedImages.length > 0 && {
        images: processedImages
      })
    };

    // Create the product
    const product = await shopify.product.create(productData);

    if (!product || !product.id) {
      return NextResponse.json(
        { success: false, error: "Failed to create product" },
        { status: 500 }
      );
    }

    // Add product to collection
    try {
      await shopify.collect.create({
        collection_id: parseInt(collection_id, 10),
        product_id: product.id,
      });
    } catch (collectionError) {
      console.warn("Failed to add product to collection:", collectionError);
      // Continue with metafields creation even if collection addition fails
    }

    // Prepare metafields data
    const metafieldsData = [
      {
        owner_resource: "product",
        owner_id: product.id,
        namespace: "companion",
        key: "age",
        value: body.metafields.age,
        type: "number_integer",
      },
      {
        owner_resource: "product",
        owner_id: product.id,
        namespace: "companion",
        key: "current_location_in_australia",
        value: body.metafields.current_location_in_australia,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: product.id,
        namespace: "companion",
        key: "available_times_to_take_jobs",
        value: JSON.stringify(body.metafields.available_times_to_take_jobs),
        type: "json",
      },
      {
        owner_resource: "product",
        owner_id: product.id,
        namespace: "companion",
        key: "relevant_skills",
        value: JSON.stringify(body.metafields.relevant_skills),
        type: "json",
      },
      {
        owner_resource: "product",
        owner_id: product.id,
        namespace: "companion",
        key: "other_certificates",
        value: body.metafields.other_certificates || "",
        type: "multi_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: product.id,
        namespace: "companion",
        key: "australian_police_check",
        value: body.metafields.australian_police_check,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: product.id,
        namespace: "companion",
        key: "blue_card_status",
        value: body.metafields.blue_card_status,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: product.id,
        namespace: "companion",
        key: "preferred_age_group_to_work",
        value: body.metafields.preferred_age_group_to_work,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: product.id,
        namespace: "companion",
        key: "school_major_you_re_studying",
        value: body.metafields.school_major_you_re_studying || "",
        type: "single_line_text_field",
      },
    ];

    // Create metafields
    const createdMetafields = [];
    for (const metafieldData of metafieldsData) {
      try {
        // Only create metafield if value is not empty
        if (metafieldData.value !== "" && metafieldData.value !== "[]") {
          const metafield = await shopify.metafield.create(metafieldData);
          createdMetafields.push(metafield);
        }
      } catch (metafieldError) {
        console.warn(`Failed to create metafield ${metafieldData.key}:`, metafieldError);
        // Continue with other metafields even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: product.id,
        title: product.title,
        handle: product.handle,
        metafields_created: createdMetafields.length,
      },
      message: "Companion created successfully",
    });

  } catch (error) {
    console.error("Error creating companion:", error);
    
    // Handle specific Shopify API errors
    let errorMessage = "Failed to create companion";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}