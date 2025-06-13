import { NextRequest } from "next/server";
import shopify from "../initialShopify";

export async function POST(request: NextRequest) {
  let metafields;

  try {
    const body = await request.json();

    metafields = await shopify.metafield.list({
      metafield: {
        ...body,
      },
    });

    return new Response(
      JSON.stringify({ success: true, data: metafields, error: null }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, data: null, error: errorMessage }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
