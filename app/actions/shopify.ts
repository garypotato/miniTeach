"use server";

import { getProducts } from "../lib/shopify";

interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  handle: string;
  vendor?: string;
  product_type?: string;
  tags?: string;
  images?: Array<{
    id: number;
    src: string;
    alt: string | null;
    width: number;
    height: number;
  }>;
}

interface Companion {
  id: number;
  title: string;
  body_html: string;
  handle: string;
  image?: {
    src: string;
    alt: string | null;
  };
}

// Helper function to transform Shopify product data
function transformShopifyProduct(product: ShopifyProduct): Companion {
  return {
    id: product.id,
    title: product.title,
    body_html: product.body_html,
    handle: product.handle,
    // Transform images array to single image object (use first image)
    image:
      product.images && product.images.length > 0
        ? {
            src: product.images[0].src,
            alt: product.images[0].alt || product.title,
          }
        : undefined,
  };
}

export async function getCompanionsAction(options?: {
  collection_id?: string;
}): Promise<{
  success: boolean;
  data: Companion[] | null;
  error: string | null;
}> {
  try {
    const result = await getProducts({
      ...options,
      status: "active",
      published_status: "published",
      fields: "id,title,body_html,handle,images",
    });

    if (result.success && result.data) {
      // Transform the data to ensure proper image structure
      const transformedData = result.data.map(transformShopifyProduct);

      return {
        success: true,
        data: transformedData,
        error: null,
      };
    }

    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Server action error:", errorMessage);

    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}
