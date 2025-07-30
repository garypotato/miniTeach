import Shopify from "shopify-api-node";

if (!process.env.SHOP_NAME || !process.env.API_ACCESS_TOKEN) {
  console.warn("Missing Shopify environment variables - using placeholder values");
}

const shopify = new Shopify({
  shopName: process.env.SHOP_NAME || "placeholder",
  accessToken: process.env.API_ACCESS_TOKEN || "placeholder",
});

// GraphQL query to check for existing user_name
export async function checkUserNameExists(email: string): Promise<boolean> {
  const query = `
    query($query: String!) {
      products(first: 250, query: $query) {
        edges {
          node {
            id
            metafield(namespace: "custom", key: "user_name") {
              value
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopify.graphql(query, {
      query: `product_type:Companion`
    });

    const products = response.products.edges;

    for (const edge of products) {
      const product = edge.node;
      if (product.metafield && product.metafield.value === email) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking user_name uniqueness:", error);
    throw error;
  }
}

export default shopify;