import Shopify from "shopify-api-node";

if (!process.env.SHOP_NAME || !process.env.API_ACCESS_TOKEN) {
  console.warn("Missing Shopify environment variables - using placeholder values");
}

const shopify = new Shopify({
  shopName: process.env.SHOP_NAME || "placeholder",
  accessToken: process.env.API_ACCESS_TOKEN || "placeholder",
});

export default shopify;