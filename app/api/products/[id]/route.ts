import { NextRequest, NextResponse } from "next/server";
import shopify from "../../initialShopify";

export async function GET(_: NextRequest, context: { params: { id: string } }) {
  const params = context.params;
  try {
    const id = params.id;
    const product = await shopify.product.get(parseInt(id, 10));

    return NextResponse.json(
      { success: true, data: product, error: null },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { success: false, data: null, error: errorMessage },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
