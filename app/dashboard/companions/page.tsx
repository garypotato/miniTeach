import Link from "next/link";
import { getProducts, getProductsWithMetafields } from "../../lib/shopify";
import CompanionRow from "./components/CompanionRow";

interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  handle: string;
  vendor?: string;
  product_type?: string;
  tags?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  images?: Array<{
    id: number;
    src: string;
    alt: string | null;
    width: number;
    height: number;
  }>;
}

interface Companion {
  id: number;
  title: string;
  body_html: string;
  handle: string;
  vendor?: string;
  product_type?: string;
  tags?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  images?: Array<{
    id: number;
    src: string;
    alt: string | null;
    width: number;
    height: number;
  }>;
  image?: {
    src: string;
    alt: string | null;
  };
  metafields?: Array<{
    id: string;
    namespace: string;
    key: string;
    value: string;
    type: string;
    description?: string;
  }>;
}

async function getAllCompanions(): Promise<Companion[]> {
  try {
    // Step 1: Fetch ALL basic companion data using proper Shopify pagination
    const allBasicCompanions: ShopifyProduct[] = [];
    let params: Record<string, unknown> | undefined = {
      collection_id: "491355177275",
      status: "active",
      published_status: "published",
      limit: 250, // Maximum per request
      fields:
        "id,title,body_html,handle,images,vendor,product_type,tags,status,created_at,updated_at",
    };

    let pageCount = 0;

    do {
      pageCount++; // eslint-disable-line @typescript-eslint/no-unused-vars

      const result = await getProducts(params);

      if (result.success && result.data) {
        allBasicCompanions.push(...result.data);

        // Get next page parameters from Shopify API
        const nextParams = (
          result.data as unknown as {
            nextPageParameters?: Record<string, unknown>;
          }
        ).nextPageParameters;
        params = nextParams;
      } else {
        console.warn("Failed to fetch companions page:", result.error);
        break;
      }
    } while (params !== undefined);

    // Step 2: Fetch metafields for all products using GraphQL in batches
    const productIds = allBasicCompanions.map((p) => p.id.toString());
    const batchSize = 100; // GraphQL can handle larger batches
    const companionsWithMetafields: Companion[] = [];

    for (let i = 0; i < productIds.length; i += batchSize) {
      const batchIds = productIds.slice(i, i + batchSize);

      const metafieldsResult = await getProductsWithMetafields(batchIds);

      if (metafieldsResult.success && metafieldsResult.data) {
        // Transform and merge with basic data
        const transformedBatch = metafieldsResult.data.map(
          transformShopifyProduct
        );
        companionsWithMetafields.push(...transformedBatch);
      } else {
        console.warn(
          "Failed to fetch metafields for batch:",
          metafieldsResult.error
        );
        // Fall back to basic data without metafields for this batch
        const fallbackBatch = allBasicCompanions
          .slice(i, i + batchSize)
          .map(transformShopifyProduct);
        companionsWithMetafields.push(...fallbackBatch);
      }
    }

    return companionsWithMetafields;
  } catch (error) {
    console.error("Error in getAllCompanions:", error);
    return [];
  }
}

// Helper function to transform Shopify product data
function transformShopifyProduct(product: ShopifyProduct): Companion {
  return {
    ...product,
    // Transform images array to single image object (use first image)
    image:
      product.images && product.images.length > 0
        ? {
            src: product.images[0].src,
            alt: product.images[0].alt || product.title,
          }
        : undefined,
  };
}

// Helper function to extract text from HTML
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&[^;]+;/g, " ")
    .trim();
}

// Helper function to get metafield value
function getMetafieldValue(companion: Companion, key: string): string {
  const metafield = companion.metafields?.find((m) => m.key === key);
  return metafield?.value || "";
}

export default async function DashboardCompanionsPage() {
  const companions = await getAllCompanions();

  return (
    <div className="w-full max-w-none overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Companions</h1>
            <p className="text-gray-600 mt-2">
              Manage all companions in your platform
            </p>
          </div>
          <Link
            href="/companions/create"
            className="px-6 py-3 text-white rounded-lg font-semibold transition-colors hover:opacity-90"
            style={{ backgroundColor: "#47709B" }}
          >
            Add New Companion
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Companions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {companions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {companions.filter((c) => c.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Locations</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  new Set(
                    companions
                      .map((c) =>
                        getMetafieldValue(c, "current_location_in_australia")
                      )
                      .filter(Boolean)
                  ).size
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">With Photos</p>
              <p className="text-2xl font-bold text-gray-900">
                {companions.filter((c) => c.image).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden w-full max-w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Companions</h3>
        </div>

        {companions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No companions found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first companion.
            </p>
            <Link
              href="/companions/create"
              className="inline-flex items-center text-white px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: "#47709B" }}
            >
              Add First Companion
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                    Companion
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Location
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Age
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companions.map((companion) => (
                  <CompanionRow key={companion.id} companion={companion}>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                          {companion.image ? (
                            <img
                              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                              src={companion.image.src}
                              alt={companion.image.alt || companion.title}
                            />
                          ) : (
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {companion.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate hidden sm:block">
                            {stripHtml(companion.body_html).substring(0, 60)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                      <span className="hidden sm:inline">
                        {getMetafieldValue(
                          companion,
                          "current_location_in_australia"
                        ) || "Not specified"}
                      </span>
                      <span className="sm:hidden">
                        {getMetafieldValue(
                          companion,
                          "current_location_in_australia"
                        )?.substring(0, 8) || "Not specified"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                      {getMetafieldValue(companion, "age") || "Not specified"}
                    </td>
                  </CompanionRow>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
