"use server";

import {
  getProducts,
  transformProductToCompanion,
  Companion,
  ShopifyResponse,
} from "../services/shopify";

export async function getCompanionsAction(options?: {
  collection_id?: string;
}): Promise<ShopifyResponse<Companion[]>> {
  try {
    const result = await getProducts({
      ...options,
      status: "active",
      published_status: "published",
      fields: "id,title,body_html,handle,images",
      collection_id: "491355177275", // Companion collection ID
    });

    if (result.success && result.data) {
      const transformedData = result.data.map(transformProductToCompanion);

      return {
        success: true,
        data: transformedData,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: result.error,
    };
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
