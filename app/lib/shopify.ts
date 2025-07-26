import shopify from "../api/initialShopify";

interface Metaobject {
  handle?: string;
  fields?: unknown;
  product_id?: number;
  [key: string]: unknown;
}

interface ShopifyWithMetaobjects {
  metaobject?: {
    list: () => Promise<Metaobject[]>;
  };
  graphql?: (query: string, variables?: Record<string, unknown>) => Promise<unknown>;
}

interface GraphQLImageEdge {
  node: {
    id: string;
    url: string;
    altText: string;
    width: number;
    height: number;
  };
}

interface GraphQLMetafieldEdge {
  node: {
    id: string;
    namespace: string;
    key: string;
    value: string;
    type: string;
    description?: string;
  };
}

interface GraphQLProduct {
  legacyResourceId: string;
  title: string;
  bodyHtml: string;
  handle: string;
  vendor: string;
  productType: string;
  tags?: string[];
  images?: {
    edges: GraphQLImageEdge[];
  };
  metafields?: {
    edges: GraphQLMetafieldEdge[];
  };
}

interface ProductFilters {
  collection_id?: string;
  limit?: number;
  status?: "active" | "archived" | "draft";
  published_status?: "published" | "unpublished";
  fields?: string;
  vendor?: string;
  product_type?: string;
  ids?: string;
  created_at_min?: string;
  created_at_max?: string;
  updated_at_min?: string;
  updated_at_max?: string;
  published_at_min?: string;
  published_at_max?: string;
  // Pagination parameters
  page_info?: string;
  since_id?: string;
  [key: string]: unknown; // Allow any additional parameters for pagination
}

export async function getProducts(options?: ProductFilters) {
  try {
    let products;

    // Set default filters for better performance and data quality
    const defaultFilters = {
      limit: 250, // Maximum allowed
      status: "active",
      published_status: "published",
      fields: "id,title,body_html,handle,images,vendor,product_type,tags",
      ...options,
    };

    // If filtering by collection, use collection.products for better performance
    if (options?.collection_id) {
      const { collection_id, ...restFilters } = defaultFilters;
      if (collection_id) {
        const collectionId = parseInt(collection_id, 10);
        products = await shopify.collection.products(collectionId, restFilters);
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

// Function to get all products with pagination for large datasets
export async function getAllProductsPaginated(options?: ProductFilters) {
  try {
    // For now, use the regular getProducts function with max limit
    // This can be enhanced later if pagination is specifically needed
    return await getProducts({
      ...options,
      limit: 250, // Maximum allowed per request
    });
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

// Function to get a single product with metafields
export async function getProductWithMetafields(productId: string) {
  try {

    // Method 1: Try to get product with metafields included
    let productWithMetafields;
    try {
      productWithMetafields = await shopify.product.get(
        parseInt(productId, 10),
        {
          fields:
            "id,title,body_html,handle,images,vendor,product_type,tags,metafields",
        }
      );
    } catch {
      productWithMetafields = await shopify.product.get(
        parseInt(productId, 10)
      );
    }


    // Method 2: Try different metafield fetch approaches

    let metafields: unknown[] = [];

    // Try approach 1: Direct metafield.list
    try {
      metafields = await shopify.metafield.list({
        owner_resource: "product",
        owner_id: parseInt(productId, 10),
      });

      if (metafields.length === 0) {
        // No metafields found with Method 1, trying alternative approaches
      }
    } catch {

      // Try approach 2: Different parameter structure
      try {
        metafields = await shopify.metafield.list({
          metafield: {
            owner_resource: "product",
            owner_id: parseInt(productId, 10),
          },
        });
        // Method 2 - metafield.list with nested params
      } catch {
      }
    }

    // Try approach 3: List all metafields and check what's available
    if (metafields.length === 0) {
      try {
        const allMetafields = await shopify.metafield.list();

        if (allMetafields.length > 0) {
          // Sample metafields structure

          // Filter for product metafields
          const productMetafields = allMetafields.filter((mf: unknown) => {
            const metafield = mf as Record<string, unknown>;
            return metafield.owner_resource === "product";
          });

          // Total product metafields found

          // Filter for this specific product
          metafields = allMetafields.filter((mf: unknown) => {
            const metafield = mf as Record<string, unknown>;
            return (
              metafield.owner_resource === "product" &&
              metafield.owner_id === parseInt(productId, 10)
            );
          });


          if (metafields.length === 0 && productMetafields.length > 0) {
            // Found other product metafields but not for this product
          }
        } else {
          // No metafields found at all - this suggests API permission issues
        }
      } catch (error3) {
        // This might indicate insufficient API permissions for metafields

        // Log the specific error details
        if (error3 instanceof Error) {
          // Error details: message, name, stack
        }
      }
    }

    // Metafields count

    return {
      success: true,
      data: {
        ...productWithMetafields,
        metafields: metafields,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching product with metafields:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}

// Function to get a single product with metaobjects (newer Shopify API)
export async function getProductWithMetaobjects(productId: string) {
  try {
    const product = await shopify.product.get(parseInt(productId, 10));
    let metaobjects: Metaobject[] = [];

    // Check if shopify library has metaobjects support
    try {
      // Check if metaobjects method exists
      if ((shopify as ShopifyWithMetaobjects).metaobject) {
        metaobjects = await (shopify as ShopifyWithMetaobjects).metaobject!.list();

        // Filter for metaobjects related to this product
        const productMetaobjects = metaobjects.filter((mo: Metaobject) => {
          return (
            (mo.handle && mo.handle.includes(productId)) ||
            (mo.fields && JSON.stringify(mo.fields).includes(productId)) ||
            mo.product_id === parseInt(productId, 10)
          );
        });

        metaobjects = productMetaobjects;
      } else {
        // Try to use GraphQL API for metafields
        const graphqlQuery = `
          query getProductMetafields($id: ID!) {
            product(id: $id) {
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

        // Check if GraphQL is available
        if ((shopify as ShopifyWithMetaobjects).graphql) {
          const graphqlResult = await (shopify as ShopifyWithMetaobjects).graphql!(graphqlQuery, {
            id: `gid://shopify/Product/${productId}`,
          }) as Record<string, unknown>;

          // Try both response structures - with and without .data
          let edges = null;
          const resultData = graphqlResult as { data?: { product?: { metafields?: { edges?: unknown[] } } }, product?: { metafields?: { edges?: unknown[] } } };
          if (resultData.data?.product?.metafields?.edges) {
            edges = resultData.data.product.metafields.edges;
          } else if (resultData.product?.metafields?.edges) {
            edges = resultData.product.metafields.edges;
          }

          if (edges) {
            metaobjects = edges.map((edge: unknown) => {
              const edgeObj = edge as Record<string, unknown>;
              return edgeObj.node;
            }) as Metaobject[];

            // Exit early since we found metafields
            return {
              success: true,
              data: {
                ...product,
                metafields: metaobjects,
              },
              error: null,
            };
          }
        }
      }
    } catch (error) {
      console.error("Error fetching metaobjects:", error);
    }

    return {
      success: true,
      data: {
        ...product,
        metafields: metaobjects, // Keep the same property name for compatibility
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching product with metaobjects:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}

// Function to get multiple products with metafields using GraphQL
export async function getProductsWithMetafields(productIds: string[]) {
  try {
    if (productIds.length === 0)
      return { success: true, data: [], error: null };

    // Build GraphQL query for multiple products
    const graphqlQuery = `
      query getProductsMetafields($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on Product {
            id
            legacyResourceId
            title
            bodyHtml
            handle
            vendor
            productType
            tags
            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
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

    // Convert productIds to Shopify GIDs
    const shopifyIds = productIds.map((id) => `gid://shopify/Product/${id}`);

    // Execute GraphQL query
    if ((shopify as ShopifyWithMetaobjects).graphql) {
      const graphqlResult = await (shopify as ShopifyWithMetaobjects).graphql!(graphqlQuery, {
        ids: shopifyIds,
      }) as Record<string, unknown>;

      const resultData = graphqlResult as { data?: { nodes?: GraphQLProduct[] }, nodes?: GraphQLProduct[] };
      const products = resultData.data?.nodes || resultData.nodes || [];

      // Transform GraphQL response to match expected format
      const transformedProducts = products.map((product: GraphQLProduct) => ({
        id: parseInt(product.legacyResourceId, 10),
        title: product.title,
        body_html: product.bodyHtml,
        handle: product.handle,
        vendor: product.vendor,
        product_type: product.productType,
        tags: product.tags?.join(", "),
        images:
          product.images?.edges?.map((edge: GraphQLImageEdge) => ({
            id: parseInt(edge.node.id.split("/").pop() || "0", 10),
            src: edge.node.url,
            alt: edge.node.altText,
            width: edge.node.width,
            height: edge.node.height,
          })) || [],
        metafields:
          product.metafields?.edges?.map((edge: GraphQLMetafieldEdge) => edge.node) || [],
      }));

      return {
        success: true,
        data: transformedProducts,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: "GraphQL not available",
    };
  } catch (error) {
    console.error("Error fetching products with metafields:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}
