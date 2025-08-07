export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  vendor?: string;
  product_type?: string;
  tags?: string;
  images?: Array<{
    id: number;
    src: string;
    alt: string | null;
    width: number;
    height: number;
  }>;
  metafields?: Array<{
    id?: string;
    namespace: string;
    key: string;
    value: string;
    type: string;
    description?: string;
  }>;
}

export interface Companion {
  id: number;
  title: string;
  handle: string;
  vendor?: string;
  product_type?: string;
  tags?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  image?: {
    src: string;
    alt: string | null;
  };
  images?: Array<{
    src: string;
    alt: string | null;
  }>;
  metafields?: CompanionMetafields;
}

export interface CompanionMetafields {
  wechat_id?: string;
  major?: string;
  education?: string;
  language?: string[];
  age?: string;
  age_range?: string;
  location?: string;
  age_group?: string[];
  blue_card?: string;
  police_check?: string;
  skill?: string[];
  certification?: string[];
  availability?: string[];
  description?: string;
  user_name?: string; // Email - required for creation but optional for display
  first_name?: string; // Required for creation but optional for display
  last_name?: string; // Required for creation but optional for display
  password?: string; // Required for creation but not displayed
}

export interface CompanionCreateMetafields extends CompanionMetafields {
  user_name: string; // Required for creation
  first_name: string; // Required for creation
  last_name: string; // Required for creation
  password: string; // Required for creation
}

export interface ProductFilters {
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
  page_info?: string;
  since_id?: string;
  [key: string]: unknown;
}

export interface ShopifyResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}