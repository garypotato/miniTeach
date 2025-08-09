"use server";

import { getProductsWithMetafields, getProductWithMetafields } from "./products";
import { ShopifyResponse, Resource, Book } from "./types";

// Resource Collection ID from specs.md
const RESOURCE_COLLECTION_ID = "492851167547";

/**
 * Get all resources from the Resource collection
 */
export async function getResources(): Promise<ShopifyResponse<Resource[]>> {
  try {
    const result = await getProductsWithMetafields({
      collection_id: RESOURCE_COLLECTION_ID,
    });

    if (!result.success || !result.data) {
      return result as ShopifyResponse<Resource[]>;
    }

    // Transform ShopifyProduct to Resource
    const resources: Resource[] = result.data.map((product) => {
      const lastNameMetafield = product.metafields?.find(
        (field) => field.namespace === "custom" && field.key === "last_name"
      );

      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        vendor: product.vendor,
        product_type: product.product_type,
        tags: product.tags,
        images: product.images,
        metafields: {
          last_name: lastNameMetafield?.value || "",
        },
      };
    });

    return {
      success: true,
      data: resources,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}

/**
 * Get a single resource by ID
 */
export async function getResource(resourceId: string): Promise<ShopifyResponse<Resource>> {
  try {
    const result = await getProductWithMetafields(resourceId);

    if (!result.success || !result.data) {
      return result as ShopifyResponse<Resource>;
    }

    const product = result.data;
    const lastNameMetafield = product.metafields?.find(
      (field) => field.namespace === "custom" && field.key === "last_name"
    );

    const resource: Resource = {
      id: product.id,
      title: product.title,
      handle: product.handle,
      vendor: product.vendor,
      product_type: product.product_type,
      tags: product.tags,
      images: product.images,
      metafields: {
        last_name: lastNameMetafield?.value || "",
      },
    };

    return {
      success: true,
      data: resource,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}

/**
 * Group resources by book (last_name metafield)
 */
export async function getBooks(): Promise<ShopifyResponse<Book[]>> {
  try {
    const resourcesResult = await getResources();

    if (!resourcesResult.success || !resourcesResult.data) {
      return {
        success: false,
        error: resourcesResult.error || "Failed to fetch resources",
        data: null
      };
    }

    const resources = resourcesResult.data;

    // Group resources by book name (last_name)
    const booksMap = new Map<string, Resource[]>();

    resources.forEach((resource) => {
      const bookName = resource.metafields?.last_name || "未分类";
      
      if (!booksMap.has(bookName)) {
        booksMap.set(bookName, []);
      }
      
      booksMap.get(bookName)!.push(resource);
    });

    // Convert map to array and sort chapters by title
    const books: Book[] = Array.from(booksMap.entries()).map(([name, chapters]) => ({
      name,
      chapters: chapters.sort((a, b) => a.title.localeCompare(b.title)),
    })).sort((a, b) => a.name.localeCompare(b.name));

    return {
      success: true,
      data: books,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}

/**
 * Get all chapters (resources) for a specific book
 */
export async function getChaptersByBookName(bookName: string): Promise<ShopifyResponse<Resource[]>> {
  try {
    const resourcesResult = await getResources();

    if (!resourcesResult.success || !resourcesResult.data) {
      return resourcesResult as ShopifyResponse<Resource[]>;
    }

    const resources = resourcesResult.data;

    // Filter resources by book name (last_name)
    const chapters = resources
      .filter((resource) => resource.metafields?.last_name === bookName)
      .sort((a, b) => a.title.localeCompare(b.title));

    return {
      success: true,
      data: chapters,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}

/**
 * Get a specific chapter by book name and chapter ID
 */
export async function getChapter(bookName: string, chapterId: string): Promise<ShopifyResponse<Resource>> {
  try {
    const resourceResult = await getResource(chapterId);

    if (!resourceResult.success || !resourceResult.data) {
      return resourceResult;
    }

    const resource = resourceResult.data;

    // Verify that this resource belongs to the specified book
    if (resource.metafields?.last_name !== bookName) {
      return {
        success: false,
        data: null,
        error: "Chapter not found in the specified book",
      };
    }

    return {
      success: true,
      data: resource,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}