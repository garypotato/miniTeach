// Client-safe metafield utilities

export const METAFIELD_KEYS = {
  WECHAT_ID: "wechat_id",
  MAJOR: "major",
  EDUCATION: "education",
  LANGUAGE: "language",
  AGE: "age",
  LOCATION: "location",
  AGE_GROUP: "age_group",
  BLUE_CARD: "blue_card",
  POLICE_CHECK: "police_check",
  SKILL: "skill",
  CERTIFICATION: "certification",
  AVAILABILITY: "availability",
} as const;

export const METAFIELD_LABELS = {
  [METAFIELD_KEYS.WECHAT_ID]: "WeChat ID",
  [METAFIELD_KEYS.MAJOR]: "Major/Study Field",
  [METAFIELD_KEYS.EDUCATION]: "Education Level",
  [METAFIELD_KEYS.LANGUAGE]: "Languages",
  [METAFIELD_KEYS.AGE]: "Age",
  [METAFIELD_KEYS.LOCATION]: "Location",
  [METAFIELD_KEYS.AGE_GROUP]: "Suitable Age Groups",
  [METAFIELD_KEYS.BLUE_CARD]: "Blue Card / WWCC",
  [METAFIELD_KEYS.POLICE_CHECK]: "Police Check",
  [METAFIELD_KEYS.SKILL]: "Skills",
  [METAFIELD_KEYS.CERTIFICATION]: "Certifications",
  [METAFIELD_KEYS.AVAILABILITY]: "Availability",
} as const;

export const METAFIELD_ICONS = {
  [METAFIELD_KEYS.WECHAT_ID]:
    "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  [METAFIELD_KEYS.MAJOR]:
    "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
  [METAFIELD_KEYS.EDUCATION]:
    "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  [METAFIELD_KEYS.LANGUAGE]:
    "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129",
  [METAFIELD_KEYS.AGE]:
    "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  [METAFIELD_KEYS.LOCATION]:
    "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  [METAFIELD_KEYS.AGE_GROUP]:
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  [METAFIELD_KEYS.BLUE_CARD]: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  [METAFIELD_KEYS.POLICE_CHECK]:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  [METAFIELD_KEYS.SKILL]:
    "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  [METAFIELD_KEYS.CERTIFICATION]:
    "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  [METAFIELD_KEYS.AVAILABILITY]: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
} as const;

export function getMetafieldLabel(key: string): string {
  return METAFIELD_LABELS[key as keyof typeof METAFIELD_LABELS] || key;
}

export function getMetafieldIcon(key: string): string {
  return METAFIELD_ICONS[key as keyof typeof METAFIELD_ICONS] || "";
}

export function formatMetafieldValue(
  key: string,
  value: string | string[] | undefined
): string {
  if (!value) return "";

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "string") {
    return value;
  }

  return String(value);
}
