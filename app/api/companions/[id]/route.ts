import { NextRequest, NextResponse } from "next/server";
import { getProductWithMetafields, transformProductToCompanion } from "../../../services/shopify";
import shopifyClient from "../../../services/shopify/client";

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

    const result = await getProductWithMetafields(companionId);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || "Companion not found" },
        { status: 404 }
      );
    }

    const companion = transformProductToCompanion(result.data);

    return NextResponse.json({
      success: true,
      data: companion,
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
    
    // Extract metafields based on new spec
    const metafields = {
      wechat_id: formData.get('metafields.wechat_id') as string || '',
      major: formData.get('metafields.major') as string || '',
      education: formData.get('metafields.education') as string || '',
      language: JSON.parse(formData.get('metafields.language') as string || '[]'),
      age: formData.get('metafields.age') as string || '',
      location: formData.get('metafields.location') as string || '',
      age_group: JSON.parse(formData.get('metafields.age_group') as string || '[]'),
      blue_card: formData.get('metafields.blue_card') as string || '',
      police_check: formData.get('metafields.police_check') as string || '',
      skill: JSON.parse(formData.get('metafields.skill') as string || '[]'),
      certification: JSON.parse(formData.get('metafields.certification') as string || '[]'),
      availability: JSON.parse(formData.get('metafields.availability') as string || '[]'),
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
    const updatedProduct = await shopifyClient.product.update(parseInt(companionId, 10), productData);

    if (!updatedProduct || !updatedProduct.id) {
      return NextResponse.json(
        { success: false, error: "Failed to update product" },
        { status: 500 }
      );
    }

    // Fetch existing metafields to update them
    let existingMetafields: Array<{ id: number; namespace: string; key: string }> = [];
    try {
      existingMetafields = await shopifyClient.metafield.list({
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
      });
    } catch (error) {
      console.warn("Failed to fetch existing metafields:", error);
    }

    // Prepare metafields data based on new spec
    const metafieldsData = [
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "wechat_id",
        value: metafields.wechat_id,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "major",
        value: metafields.major,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "education",
        value: metafields.education,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "language",
        value: JSON.stringify(metafields.language),
        type: "json",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "age",
        value: metafields.age,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "location",
        value: metafields.location,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "age_group",
        value: JSON.stringify(metafields.age_group),
        type: "json",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "blue_card",
        value: metafields.blue_card,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "police_check",
        value: metafields.police_check,
        type: "single_line_text_field",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "skill",
        value: JSON.stringify(metafields.skill),
        type: "json",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "certification",
        value: JSON.stringify(metafields.certification),
        type: "json",
      },
      {
        owner_resource: "product",
        owner_id: parseInt(companionId, 10),
        namespace: "companion",
        key: "availability",
        value: JSON.stringify(metafields.availability),
        type: "json",
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
            const updated = await shopifyClient.metafield.update(existingMetafield.id, {
              value: metafieldData.value,
            });
            updatedMetafields.push(updated);
          } else {
            // Delete empty metafield
            try {
              await shopifyClient.metafield.delete(existingMetafield.id);
            } catch (deleteError) {
              console.warn(`Failed to delete metafield ${metafieldData.key}:`, deleteError);
            }
          }
        } else {
          // Create new metafield only if value is not empty
          if (metafieldData.value !== "" && metafieldData.value !== "[]") {
            const created = await shopifyClient.metafield.create(metafieldData);
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