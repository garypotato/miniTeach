import shopify from "./client";
import {
  ShopifyProduct,
  ProductFilters,
  ShopifyResponse,
  Companion,
} from "./types";
import { processMetafields } from "./metafields";

export async function getProducts(
  options?: ProductFilters
): Promise<ShopifyResponse<ShopifyProduct[]>> {
  try {
    let products;

    const defaultFilters = {
      limit: 250,
      status: "active",
      published_status: "published",
      fields: "id,title,body_html,handle,images,vendor,product_type,tags",
      ...options,
    };

    if (options?.collection_id) {
      const { collection_id, ...restFilters } = defaultFilters;
      if (collection_id) {
        // Filter products by collection_id
        products = await shopify.product.list({
          ...restFilters,
          collection_id: collection_id,
        });
      } else {
        products = await shopify.product.list(defaultFilters);
      }
    } else {
      products = await shopify.product.list(defaultFilters);
    }

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

export async function getProductsWithMetafields(
  options?: ProductFilters
): Promise<ShopifyResponse<ShopifyProduct[]>> {
  try {
    // First get all products
    const productsResult = await getProducts(options);

    if (!productsResult.success || !productsResult.data) {
      return productsResult;
    }

    // Use GraphQL to fetch metafields for all products in a single query
    const productIds = productsResult.data.map(product => `"gid://shopify/Product/${product.id}"`).join(', ');
    
    const graphqlQuery = `
      {
        nodes(ids: [${productIds}]) {
          ... on Product {
            id
            metafields(first: 50) {
              edges {
                node {
                  id
                  namespace
                  key
                  value
                  type
                  description
                }
              }
            }
          }
        }
      }
    `;

    try {
      const graphqlResponse = await shopify.graphql(graphqlQuery);

      // Create a map of product ID to metafields
      const metafieldsMap = new Map();
      
      if (graphqlResponse.nodes) {
        graphqlResponse.nodes.forEach((node: { id?: string; metafields?: { edges?: Array<{ node: { id: string; namespace: string; key: string; value: string | number; type: string; description?: string } }> } }) => {
          if (node && node.id) {
            // Extract numeric ID from GraphQL global ID
            const numericId = node.id.split('/').pop();
            if (numericId) {
              const metafields = node.metafields?.edges?.map((edge) => ({
                id: edge.node.id,
                namespace: edge.node.namespace,
                key: edge.node.key,
                value: String(edge.node.value),
                type: edge.node.type,
                description: edge.node.description,
              })) || [];
              
              metafieldsMap.set(parseInt(numericId), metafields);
            }
          }
        });
      }

      // Combine products with their metafields
      const productsWithMetafields = productsResult.data.map(product => ({
        ...product,
        metafields: metafieldsMap.get(product.id) || [],
      }));

      return {
        success: true,
        data: productsWithMetafields,
        error: null,
      };

    } catch (graphqlError) {
      console.error('GraphQL error fetching metafields:', graphqlError);
      
      // Fallback: return products without metafields
      return {
        success: true,
        data: productsResult.data.map(product => ({ ...product, metafields: [] })),
        error: null,
      };
    }
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

export async function getProductWithMetafields(
  productId: string
): Promise<ShopifyResponse<ShopifyProduct>> {
  try {
    const product = await shopify.product.get(parseInt(productId, 10), {
      fields: "id,title,body_html,handle,images,vendor,product_type,tags",
    });

    let metafields: Array<{
      id?: string;
      namespace?: string;
      key: string;
      value: string;
      type?: string;
      description?: string;
    }> = [];
    
    try {
      const graphqlQuery = `
        {
          product(id: "gid://shopify/Product/${productId}") {
            metafields(first: 50) {
              edges {
                node {
                  id
                  namespace
                  key
                  value
                  type
                  description
                }
              }
            }
          }
        }
      `;
      
      const graphqlResponse = await shopify.graphql(graphqlQuery);
      
      if (graphqlResponse.product?.metafields?.edges) {
        metafields = graphqlResponse.product.metafields.edges.map((edge: { node: { id: string; namespace: string; key: string; value: string | number; type: string; description?: string } }) => ({
          id: edge.node.id,
          namespace: edge.node.namespace,
          key: edge.node.key,
          value: String(edge.node.value),
          type: edge.node.type,
          description: edge.node.description,
        }));
      }
    } catch (metafieldError) {
      console.warn("Error fetching metafields via GraphQL:", metafieldError);
    }

    return {
      success: true,
      data: {
        ...product,
        metafields: metafields.map((field) => ({
          id: field.id?.toString(),
          namespace: field.namespace || "companion",
          key: field.key,
          value: field.value,
          type: field.type || "single_line_text_field",
          description: field.description,
        })),
      },
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

export async function createCompanionProduct(productData: {
  title: string;
  body_html: string;
  vendor?: string;
  product_type?: string;
  tags?: string;
}): Promise<ShopifyResponse<ShopifyProduct>> {
  try {
    const product = await shopify.product.create({
      title: productData.title,
      body_html: productData.body_html,
      vendor: productData.vendor || "MiniTeach",
      product_type: productData.product_type || "Companion",
      tags: productData.tags || "companion,childcare,education",
      status: "active",
      published: true,
      published_scope: "web",
    });

    return {
      success: true,
      data: product,
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

export async function createProductMetafields(
  productId: number,
  metafields: Array<{
    namespace: string;
    key: string;
    value: string;
    type: string;
  }>
): Promise<ShopifyResponse<Array<unknown>>> {
  try {
    const createdMetafields = [];

    for (const metafieldData of metafields) {
      try {
        if (metafieldData.value !== "" && metafieldData.value !== "[]") {
          const metafield = await shopify.metafield.create({
            owner_resource: "product",
            owner_id: productId,
            namespace: metafieldData.namespace,
            key: metafieldData.key,
            value: metafieldData.value,
            type: metafieldData.type,
          });
          createdMetafields.push(metafield);
        }
      } catch (singleMetafieldError) {
        console.warn(
          `Failed to create metafield ${metafieldData.key}:`,
          singleMetafieldError
        );
      }
    }

    return {
      success: true,
      data: createdMetafields,
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

export function transformProductToCompanion(
  product: ShopifyProduct
): Companion {
  return {
    id: product.id,
    title: product.title,
    body_html: product.body_html,
    handle: product.handle,
    image:
      product.images && product.images.length > 0
        ? {
            src: product.images[0].src,
            alt: product.images[0].alt || product.title,
          }
        : undefined,
    images: product.images?.map((img) => ({
      src: img.src,
      alt: img.alt || product.title,
    })),
    metafields: product.metafields
      ? processMetafields(product.metafields)
      : undefined,
  };
}
