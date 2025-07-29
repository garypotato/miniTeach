// Client-safe types that can be imported in client components
// without pulling in Node.js dependencies

export interface CompanionMetafields {
  wechat_id?: string;
  major?: string;
  education?: string;
  language?: string[];
  age?: string;
  location?: string;
  age_group?: string[];
  blue_card?: string;
  police_check?: string;
  skill?: string[];
  certification?: string[];
  availability?: string[];
}

export interface Companion {
  id: number;
  title: string;
  body_html: string;
  handle: string;
  vendor?: string;
  product_type?: string;
  tags?: string;
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

export interface CompanionImage {
  src: string;
  alt: string | null;
}
