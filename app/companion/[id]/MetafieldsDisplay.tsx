"use client";

import { CompanionMetafields } from "../../types/companion";
import {
  getMetafieldIcon,
  formatMetafieldValue,
  METAFIELD_KEYS,
} from "../../utils/metafields";
import { useTranslation } from "@/app/i18n";

interface MetafieldsDisplayProps {
  metafields: CompanionMetafields;
}

// Fields to exclude from display for privacy/security reasons
const EXCLUDED_FIELDS = [
  "password",
  "wechat_id",
  "user_name",
  "first_name",
  "last_name",
  "age", // Don't display raw age, use age_range instead
  "description", // Displayed separately in "About Me" section
];

const FIELD_ORDER = [
  METAFIELD_KEYS.AGE_RANGE,
  METAFIELD_KEYS.LOCATION,
  METAFIELD_KEYS.EDUCATION,
  METAFIELD_KEYS.MAJOR,
  METAFIELD_KEYS.LANGUAGE,
  METAFIELD_KEYS.AGE_GROUP,
  METAFIELD_KEYS.SKILL,
  METAFIELD_KEYS.CERTIFICATION,
  METAFIELD_KEYS.AVAILABILITY,
  METAFIELD_KEYS.BLUE_CARD,
  METAFIELD_KEYS.POLICE_CHECK,
];

export default function MetafieldsDisplay({
  metafields,
}: MetafieldsDisplayProps) {
  const { t, translations } = useTranslation();

  // Function to get translated metafield label
  const getTranslatedLabel = (key: string): string => {
    const labelMap: Record<string, { zh: string; en: string }> = {
      wechat_id: translations.companionDetail.wechatId,
      major: translations.companionDetail.major,
      education: translations.companionDetail.educationBg,
      language: translations.companionDetail.language,
      age_range: translations.companionDetail.ageRange,
      location: translations.companionDetail.location,
      age_group: translations.companionDetail.ageGroup,
      blue_card: translations.companionDetail.blueCard,
      police_check: translations.companionDetail.policeCheck,
      skill: translations.companionDetail.skill,
      certification: translations.companionDetail.certification,
      availability: translations.companionDetail.availabilitySchedule,
    };
    return labelMap[key] ? t(labelMap[key]) : key;
  };

  // Fields that should be displayed as bullet points (list fields from specs.md)
  const LIST_FIELDS = [
    "education",
    "language",
    "age_group",
    "skill",
    "certification",
    "availability",
  ];

  // Function to render metafield value with proper formatting
  const renderMetafieldValue = (
    key: string,
    value: string | string[] | number | boolean | undefined
  ) => {
    if (!value) return "";

    // For boolean/status fields (blue_card, police_check), convert to translated text
    if (key === "blue_card" || key === "police_check") {
      const stringValue = String(value).toLowerCase();
      let displayText = "";

      switch (stringValue) {
        case "true":
        case "yes":
        case "是":
        case "有":
          displayText = t(translations.companionDetail.yes);
          break;
        case "false":
        case "no":
        case "否":
        case "没有":
          displayText = t(translations.companionDetail.no);
          break;
        case "pending":
        case "申请中":
          displayText = t(translations.companionDetail.pending);
          break;
        default:
          displayText = String(value);
      }

      return (
        <span className="text-gray-700 leading-relaxed">{displayText}</span>
      );
    }

    // For list fields, display as bullet points if it's an array or comma-separated string
    if (LIST_FIELDS.includes(key)) {
      let items: string[] = [];

      if (Array.isArray(value)) {
        items = value.filter((item) => item && item.trim());
      } else if (typeof value === "string") {
        // Handle both JSON arrays and comma-separated strings
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            items = parsed.filter((item) => item && item.trim());
          } else {
            items = value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean);
          }
        } catch {
          items = value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      if (items.length > 1) {
        return (
          <ul className="list-disc list-inside space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-gray-700 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        );
      } else if (items.length === 1) {
        return (
          <span className="text-gray-700 leading-relaxed">{items[0]}</span>
        );
      }
    }

    // For non-list fields, use the original formatting
    const stringValue = Array.isArray(value) ? value : String(value);
    return (
      <span className="text-gray-700 leading-relaxed">
        {formatMetafieldValue(key, stringValue)}
      </span>
    );
  };

  // Get all metafield keys and filter out excluded ones
  const allMetafieldKeys = Object.keys(metafields).filter(
    (key) => !EXCLUDED_FIELDS.includes(key)
  );

  // Create display fields with preferred order, then remaining fields
  const orderedKeys = FIELD_ORDER.filter((key) =>
    allMetafieldKeys.includes(key)
  );
  const fieldOrderStrings = FIELD_ORDER as string[];
  const remainingKeys = allMetafieldKeys.filter(
    (key) => !fieldOrderStrings.includes(key)
  );
  const allKeys = [...orderedKeys, ...remainingKeys];

  const displayFields = allKeys.filter((key) => {
    const value = metafields[key as keyof CompanionMetafields];

    // Filter out undefined, null, empty strings
    if (value === undefined || value === null || value === "") {
      return false;
    }

    // Filter out empty arrays
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    // Filter out arrays with only empty strings
    if (Array.isArray(value) && value.every((item) => item === "")) {
      return false;
    }

    return true;
  });

  if (displayFields.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
        <div className="text-blue-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {t(translations.companionDetail.detailsComingSoon)}
        </h2>
        <p className="text-gray-600 mb-6">
          {t(translations.companionDetail.detailsUpdating)}
        </p>
        <div>
          <p>{t(translations.companionDetail.infoWeProvide)}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-left max-w-md mx-auto">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{t(translations.companionDetail.education)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{t(translations.companionDetail.location)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{t(translations.companionDetail.skills)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{t(translations.companionDetail.languages)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{t(translations.companionDetail.certification)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{t(translations.companionDetail.availabilitySchedule)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayFields.map((key) => {
        const value = metafields[key as keyof CompanionMetafields];

        return (
          <div
            key={key}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#f0f7ff" }}
              >
                <svg
                  className="w-4 h-4"
                  style={{ color: "#47709B" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={getMetafieldIcon(key)}
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1 flex items-center">
                    <h4 className="text-base font-semibold text-gray-900 leading-tight">
                      {getTranslatedLabel(key)}
                    </h4>
                  </div>
                  <div className="sm:col-span-2">
                    {renderMetafieldValue(key, value)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
