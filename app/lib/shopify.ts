import shopify from "../api/initialShopify";

export async function getProducts(options?: { collection_id?: string }) {
  try {
    const products = await shopify.product.list(options || {});

    return {
      success: true,
      data: products,
      error: null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}
