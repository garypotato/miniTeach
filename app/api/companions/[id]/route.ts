import { NextRequest, NextResponse } from "next/server";
import shopify from "../../../api/initialShopify";

interface ShopifyMetafield {
  id: number;
  namespace: string;
  key: string;
  value: string;
  type: string;
}

interface ShopifyApiMetafield {
  id: number;
  namespace: string;
  key: string;
  value: string | number;
  type: string;
}

// GET - Fetch single companion by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: companionId } = await params;

    if (!companionId) {
      return NextResponse.json(
        { success: false, error: "Companion ID is required" },
        { status: 400 }
      );
    }

    // Fetch the product from Shopify
    const product = await shopify.product.get(parseInt(companionId, 10));

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Companion not found" },
        { status: 404 }
      );
    }

    // Fetch metafields for this product
    let metafields: ShopifyMetafield[] = [];
    try {
      const metafieldResult = await shopify.metafield.list({
        metafield: {
          owner_resource: "product",
          owner_id: parseInt(companionId, 10),
        },
      });
      // Convert the result to our expected format
      metafields = (metafieldResult as ShopifyApiMetafield[]).map((mf: ShopifyApiMetafield) => ({
        id: mf.id,
        namespace: mf.namespace,
        key: mf.key,
        value: String(mf.value),
        type: mf.type,
      }));
    } catch (metafieldError) {
      console.warn("Failed to fetch metafields:", metafieldError);
      // Continue without metafields if they fail to load
    }

    // Combine product data with metafields
    const companionData = {
      ...product,
      metafields: metafields || [],
    };

    return NextResponse.json({
      success: true,
      data: companionData,
    });

  } catch (error) {
    console.error("Error fetching companion:", error);
    
    let errorMessage = "Failed to fetch companion";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Update companion
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: companionId } = await params;
    const formData = await request.formData();
    
    if (!companionId) {
      return NextResponse.json(
        { success: false, error: "Companion ID is required" },
        { status: 400 }
      );
    }

    // Extract form fields
    const title = formData.get('title') as string;
    const body_html = formData.get('body_html') as string;
    const vendor = formData.get('vendor') as string;
    const product_type = formData.get('product_type') as string;
    const tags = formData.get('tags') as string;
    
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
    const newImages = formData.getAll('images') as File[];
    const existingImages = JSON.parse(formData.get('existing_images') as string || '[]');

    // Validate required fields
    if (!title || !body_html) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title or body_html" },
        { status: 400 }
      );
    }

    // Prepare new images for Shopify if present
    let processedNewImages: Array<{
      attachment: string;
      filename: string;
      alt: string;
      position: number;
    }> = [];
    if (newImages && newImages.length > 0) {
      try {
        const imagePromises = newImages.map(async (image, index) => {
          if (image.size > 0) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            return {
              attachment: buffer.toString('base64'),
              filename: image.name,
              alt: `${title} - Profile Image ${index + 1}`,
              position: existingImages.length + index + 1
            };
          }
          return null;
        });
        const results = await Promise.all(imagePromises);
        processedNewImages = results.filter((img): img is {
          attachment: string;
          filename: string;
          alt: string;
          position: number;
        } => img !== null);
      } catch (imageError) {
        console.warn('Error processing new images:', imageError);
        processedNewImages = [];
      }
    }

    // Combine existing images with new images
    const allImages = [
      ...existingImages.map((img: { id: number }, index: number) => ({
        id: img.id,
        position: index + 1
      })),
      ...processedNewImages
    ];

    // Update the product data
    const productData = {
      id: parseInt(companionId, 10),
      title,
      body_html,
      vendor: vendor || "MiniTeach",
      product_type: product_type || "Companion",
      tags: tags || "companion,childcare,education",
      // Add images if we have them
      ...(allImages.length > 0 && {
        images: allImages
      })
    };

    // Update the product
    const updatedProduct = await shopify.product.update(parseInt(companionId, 10), productData);

    if (!updatedProduct || !updatedProduct.id) {
      return NextResponse.json(
        { success: false, error: "Failed to update product" },
        { status: 500 }
      );
    }

    // Fetch existing metafields to update them
    let existingMetafields: ShopifyMetafield[] = [];
    try {
      const metafieldResult = await shopify.metafield.list({
        metafield: {
          owner_resource: "product",
          owner_id: parseInt(companionId, 10),
        },
      });
      // Convert the result to our expected format
      existingMetafields = (metafieldResult as ShopifyApiMetafield[]).map((mf: ShopifyApiMetafield) => ({
        id: mf.id,
        namespace: mf.namespace,
        key: mf.key,
        value: String(mf.value),
        type: mf.type,
      }));
    } catch (error) {
      console.warn("Failed to fetch existing metafields:", error);
    }

    // Prepare metafields data
    const metafieldsData = [
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "age",
        value: metafields.age,
        type: "number_integer",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "current_location_in_australia",
        value: metafields.current_location_in_australia,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "available_times_to_take_jobs",
        value: JSON.stringify(metafields.available_times_to_take_jobs),
        type: "json",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "relevant_skills",
        value: JSON.stringify(metafields.relevant_skills),
        type: "json",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "other_certificates",
        value: metafields.other_certificates || "",
        type: "multi_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "australian_police_check",
        value: metafields.australian_police_check,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "blue_card_status",
        value: metafields.blue_card_status,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "preferred_age_group_to_work",
        value: metafields.preferred_age_group_to_work,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "school_major_you_re_studying",
        value: metafields.school_major_you_re_studying || "",
        type: "single_line_text_field",
      },
    ];

    // Update or create metafields
    const updatedMetafields = [];
    for (const metafieldData of metafieldsData) {
      try {
        // Find existing metafield
        const existingMetafield = existingMetafields.find(
          (mf) => mf.namespace === metafieldData.namespace && mf.key === metafieldData.key
        );

        if (existingMetafield) {
          // Update existing metafield
          if (metafieldData.value !== "" && metafieldData.value !== "[]") {
            const updated = await shopify.metafield.update(existingMetafield.id, {
              value: metafieldData.value,
            });
            updatedMetafields.push(updated);
          } else {
            // Delete empty metafield
            try {
              await shopify.metafield.delete(existingMetafield.id);
            } catch (deleteError) {
              console.warn(`Failed to delete metafield ${metafieldData.key}:`, deleteError);
            }
          }
        } else {
          // Create new metafield only if value is not empty
          if (metafieldData.value !== "" && metafieldData.value !== "[]") {
            const created = await shopify.metafield.create(metafieldData);
            updatedMetafields.push(created);
          }
        }
      } catch (metafieldError) {
        console.warn(`Failed to update metafield ${metafieldData.key}:`, metafieldError);
        // Continue with other metafields even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedProduct.id,
        title: updatedProduct.title,
        handle: updatedProduct.handle,
        metafields_updated: updatedMetafields.length,
      },
      message: "Companion updated successfully",
    });

  } catch (error) {
    console.error("Error updating companion:", error);
    
    let errorMessage = "Failed to update companion";
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
export async function POST() {
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