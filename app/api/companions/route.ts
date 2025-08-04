import { NextResponse } from "next/server";
import { getProductsWithMetafields, transformProductToCompanion } from "@/lib/shopify";

const COMPANION_COLLECTION_ID = "491355177275";

export async function GET() {
  try {
    const result = await getProductsWithMetafields({
      status: "active",
      published_status: "published",
      fields: "id,title,handle,images",
      collection_id: COMPANION_COLLECTION_ID,
    });

    if (result.success && result.data) {
      const transformedCompanions = result.data.map(transformProductToCompanion);
      
      return NextResponse.json({
        success: true,
        data: transformedCompanions,
        error: null,
      });
    }

    return NextResponse.json({
      success: false,
      data: null,
      error: result.error,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ API error:", errorMessage);

    return NextResponse.json({
      success: false,
      data: null,
      error: errorMessage,
    }, { status: 500 });
  }
}