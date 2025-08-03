"use server";

import shopify from "./client";
import {
  ShopifyProduct,
  ProductFilters,
  ShopifyResponse,
} from "./types";

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
    const productIds = productsResult.data
      .map((product) => `"gid://shopify/Product/${product.id}"`)
      .join(", ");

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
        graphqlResponse.nodes.forEach(
          (node: {
            id?: string;
            metafields?: {
              edges?: Array<{
                node: {
                  id: string;
                  namespace: string;
                  key: string;
                  value: string | number;
                  type: string;
                  description?: string;
                };
              }>;
            };
          }) => {
            if (node && node.id) {
              // Extract numeric ID from GraphQL global ID
              const numericId = node.id.split("/").pop();
              if (numericId) {
                const metafields =
                  node.metafields?.edges?.map((edge) => ({
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
          }
        );
      }

      // Combine products with their metafields
      const productsWithMetafields = productsResult.data.map((product) => ({
        ...product,
        metafields: metafieldsMap.get(product.id) || [],
      }));

      return {
        success: true,
        data: productsWithMetafields,
        error: null,
      };
    } catch (graphqlError) {
      console.error("GraphQL error fetching metafields:", graphqlError);

      // Fallback: return products without metafields
      return {
        success: true,
        data: productsResult.data.map((product) => ({
          ...product,
          metafields: [],
        })),
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
            metafields(first: 100) {
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
        metafields = graphqlResponse.product.metafields.edges.map(
          (edge: {
            node: {
              id: string;
              namespace: string;
              key: string;
              value: string | number;
              type: string;
              description?: string;
            };
          }) => ({
            id: edge.node.id,
            namespace: edge.node.namespace,
            key: edge.node.key,
            value: String(edge.node.value),
            type: edge.node.type,
            description: edge.node.description,
          })
        );
      }
    } catch (metafieldError) {
      console.warn("Error fetching metafields via GraphQL:", metafieldError);
    }

    return {
      success: true,
      data: {
        ...product,
        metafields: metafields.map((field) => {
          return {
            id: field.id?.toString(),
            namespace: field.namespace || "custom",
            key: field.key,
            value: field.value,
            type: field.type || "single_line_text_field",
            description: field.description,
          };
        }),
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
  images?: Array<{
    attachment: string;
    filename: string;
    alt: string;
    position: number;
  }>;
}): Promise<ShopifyResponse<ShopifyProduct>> {
  try {
    const productCreateData = {
      title: productData.title,
      body_html: productData.body_html,
      vendor: productData.vendor || "MiniTeach",
      product_type: productData.product_type || "Companion",
      tags: productData.tags || "companion,childcare,education",
      status: "active",
      published: true,
      published_scope: "web",
      ...(productData.images && { images: productData.images }),
    };

    const product = await shopify.product.create(productCreateData);

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

export async function addProductToCollection(
  productId: number,
  collectionId: number
): Promise<ShopifyResponse<unknown>> {
  try {
    const collect = await shopify.collect.create({
      product_id: productId,
      collection_id: collectionId,
    });

    return {
      success: true,
      data: collect,
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

export async function updateProductStatus(
  productId: number,
  status: "active" | "archived" | "draft"
): Promise<ShopifyResponse<unknown>> {
  try {
    const updatedProduct = await shopify.product.update(productId, {
      status: status,
    });

    return {
      success: true,
      data: updatedProduct,
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

export async function updateProductMetafields(
  productId: number,
  metafields: Array<{
    namespace: string;
    key: string;
    value: string;
    type: string;
  }>
): Promise<ShopifyResponse<Array<unknown>>> {
  try {
    const updatedMetafields = [];

    // First, get existing metafields for this product
    const existingProduct = await getProductWithMetafields(productId.toString());
    if (!existingProduct.success || !existingProduct.data) {
      throw new Error("Failed to fetch existing product data");
    }

    const existingMetafields = existingProduct.data.metafields || [];

    for (const metafieldData of metafields) {
      try {
        if (metafieldData.value !== "" && metafieldData.value !== "[]") {
          // Check if metafield already exists
          const existingMetafield = existingMetafields.find(
            (existing) => 
              existing.namespace === metafieldData.namespace && 
              existing.key === metafieldData.key
          );

          let metafield;
          if (existingMetafield && existingMetafield.id) {
            // Update existing metafield
            metafield = await shopify.metafield.update(parseInt(existingMetafield.id), {
              value: metafieldData.value,
              type: metafieldData.type,
            });
          } else {
            // Create new metafield
            metafield = await shopify.metafield.create({
              owner_resource: "product",
              owner_id: productId,
              namespace: metafieldData.namespace,
              key: metafieldData.key,
              value: metafieldData.value,
              type: metafieldData.type,
            });
          }
          updatedMetafields.push(metafield);
        }
      } catch (singleMetafieldError) {
        console.warn(
          `Failed to update metafield ${metafieldData.key}:`,
          singleMetafieldError
        );
      }
    }

    return {
      success: true,
      data: updatedMetafields,
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

