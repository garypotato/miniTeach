import { CompanionMetafields, getMetafieldLabel, getMetafieldIcon, formatMetafieldValue, METAFIELD_KEYS } from "../services/shopify";

interface MetafieldsDisplayProps {
  metafields: CompanionMetafields;
}

const FIELD_ORDER = [
  METAFIELD_KEYS.AGE,
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
  METAFIELD_KEYS.WECHAT_ID,
];

export default function MetafieldsDisplay({ metafields }: MetafieldsDisplayProps) {
  const displayFields = FIELD_ORDER.filter(key => {
    const value = metafields[key as keyof CompanionMetafields];
    return value !== undefined && value !== null && value !== "";
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
        <h4 className="text-lg font-semibold text-blue-900 mb-2">
          Professional Details Coming Soon
        </h4>
        <p className="text-blue-700 mb-4">
          Detailed professional information for this companion is currently being updated. Please check back soon or contact us for more information.
        </p>
        <div className="text-sm text-blue-600">
          <p>Information we typically provide includes:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-left max-w-md mx-auto">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Education</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Skills</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Languages</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Certifications</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Availability</span>
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
        const displayValue = formatMetafieldValue(key, value);
        
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-1">
                    <h4 className="text-base font-semibold text-gray-900">
                      {getMetafieldLabel(key)}
                    </h4>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-gray-700 leading-relaxed">
                      {displayValue}
                    </p>
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