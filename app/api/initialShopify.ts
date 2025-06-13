import Shopify from "shopify-api-node";

const shopify = new Shopify({
  shopName: process.env.SHOP_NAME as string,
  apiKey: process.env.API_KEY as string,
  password: process.env.API_ACCESS_TOKEN as string,
});

export default shopify;
