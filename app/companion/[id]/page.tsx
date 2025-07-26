import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductWithMetaobjects } from "../../lib/shopify";
import { ImageGallery } from "./ImageGallery";

interface Companion {
  id: number;
  title: string;
  body_html: string;
  handle: string;
  image?: {
    src: string;
    alt: string | null;
  };
  images?: Array<{
    src: string;
    alt: string | null;
  }>;
  metafields?: Array<Record<string, unknown>>; // Properly typed as an array of metafield objects
}

interface CompanionDetailProps {
  params: Promise<{
    id: string;
  }>;
}

async function getCompanion(id: string): Promise<Companion | null> {
  try {
    // Directly fetch the product with metaobjects to avoid duplicate API calls
    const detailedResult = await getProductWithMetaobjects(id);

    if (detailedResult.success && detailedResult.data) {
      return {
        id: detailedResult.data.id,
        title: detailedResult.data.title,
        body_html: detailedResult.data.body_html,
        handle: detailedResult.data.handle,
        image: detailedResult.data.image,
        images: detailedResult.data.images,
        metafields: detailedResult.data.metafields as Array<
          Record<string, unknown>
        >,
      };
    }

    return null;
  } catch (error) {
    console.error("Error in getCompanion:", error);
    return null;
  }
}

export default async function CompanionDetail({
  params,
}: CompanionDetailProps) {
  const { id } = await params;
  const companion = await getCompanion(id);

  if (!companion) {
    notFound();
  }

  const images = companion.images || (companion.image ? [companion.image] : []);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
      }}
    >
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold hover:opacity-80"
                style={{ color: "#47709B" }}
              >
                MiniTeach
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:opacity-80 font-medium"
              >
                Home
              </Link>
              <Link
                href="/companions"
                className="text-gray-700 hover:opacity-80 font-medium"
              >
                All Companions
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:opacity-80 font-medium"
              >
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:opacity-80">
                  Home
                </Link>
              </li>
              <li>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li>
                <span className="text-gray-700 font-medium">
                  {companion.title}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <ImageGallery images={images} companionTitle={companion.title} />

          {/* Companion Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {companion.title}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: "#AFC8DA", color: "#47709B" }}
                >
                  Child Companion
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Available
                </span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                About Me
              </h3>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: companion.body_html }}
              />
            </div>

            {/* Companion Details with Metafields */}
            {companion.metafields &&
              typeof companion.metafields === "object" && (
                <div className="border-t pt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Professional Details
                  </h3>
                  <div className="space-y-6">
                    {Array.isArray(companion.metafields) &&
                      companion.metafields.length > 0 && (
                        <>
                          {(() => {
                            // Filter and map metafields to relevant ones only
                            const relevantFields = [
                              "available_times_to_take_jobs", // timetable
                              "relevant_skills", // skills
                              "other_certificates", // cert
                              "australian_police_check", // police_check
                              "blue_card_status", // blue_card/wwcc
                              "preferred_age_group_to_work", // age_group
                              "school_major_you_re_studying", // school_major
                              "current_location_in_australia", // location
                              "age",
                            ];

                            companion.metafields.map(
                              (metafield: unknown) => {
                                const field = metafield as Record<
                                  string,
                                  unknown
                                >;
                                return field.key;
                              }
                            );

                            const getFieldLabel = (key: string) => {
                              const labels: Record<string, string> = {
                                available_times_to_take_jobs: "Available Times",
                                relevant_skills: "Skills & Expertise",
                                other_certificates: "Certifications",
                                australian_police_check: "Police Check",
                                blue_card_status: "Blue Card/WWCC",
                                preferred_age_group_to_work:
                                  "Suitable Age Group",
                                school_major_you_re_studying:
                                  "Education Background",
                                current_location_in_australia: "Location",
                                age: "Age",
                              };
                              return labels[key] || key;
                            };

                            const getFieldIcon = (key: string) => {
                              const icons: Record<string, string> = {
                                available_times_to_take_jobs:
                                  "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                                relevant_skills:
                                  "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
                                other_certificates:
                                  "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
                                australian_police_check:
                                  "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                                blue_card_status:
                                  "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2",
                                preferred_age_group_to_work:
                                  "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                                school_major_you_re_studying:
                                  "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
                                current_location_in_australia:
                                  "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
                                age: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                              };
                              return (
                                icons[key] ||
                                "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              );
                            };

                            const filteredMetafields = companion.metafields
                              .map((metafield: unknown) => {
                                const field = metafield as Record<
                                  string,
                                  unknown
                                >;
                                const key =
                                  field.key && typeof field.key === "string"
                                    ? field.key
                                    : "";
                                return { ...field, key };
                              })
                              .filter((field) =>
                                relevantFields.includes(field.key)
                              )
                              .sort((a, b) => {
                                // Sort by the order in relevantFields array
                                const aIndex = relevantFields.indexOf(a.key);
                                const bIndex = relevantFields.indexOf(b.key);
                                return aIndex - bIndex;
                              });


                            // Temporary debug display
                            return (
                              <div className="space-y-6">
                                {filteredMetafields.length === 0 ? (
                                  <div className="text-center py-8">
                                    <div className="text-gray-400 mb-2">
                                      <svg
                                        className="w-12 h-12 mx-auto"
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
                                    <p className="text-gray-500">
                                      Professional details will be available
                                      soon.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    {filteredMetafields.map((field, index) => {
                                      const fieldData = field as Record<
                                        string,
                                        unknown
                                      >;
                                      const value = fieldData.value;

                                      // Better value formatting
                                      let displayValue: string;
                                      if (typeof value === "object") {
                                        displayValue = JSON.stringify(
                                          value,
                                          null,
                                          2
                                        );
                                      } else if (typeof value === "string") {
                                        // Handle list fields that come as JSON strings
                                        if (
                                          value.startsWith("[") &&
                                          value.endsWith("]")
                                        ) {
                                          try {
                                            const parsedArray =
                                              JSON.parse(value);
                                            displayValue = Array.isArray(
                                              parsedArray
                                            )
                                              ? parsedArray.join(", ")
                                              : value;
                                          } catch {
                                            displayValue = value;
                                          }
                                        } else {
                                          displayValue = value;
                                        }
                                      } else {
                                        displayValue = String(
                                          value || "Not specified"
                                        );
                                      }

                                      return (
                                        <div
                                          key={index}
                                          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:bg-gray-50 transition-colors"
                                        >
                                          <div className="flex items-center space-x-4">
                                            <div
                                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                              style={{
                                                backgroundColor: "#f0f7ff",
                                              }}
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
                                                  d={getFieldIcon(
                                                    fieldData.key as string
                                                  )}
                                                />
                                              </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                                <div className="sm:col-span-1">
                                                  <h4 className="text-base font-semibold text-gray-900">
                                                    {getFieldLabel(
                                                      fieldData.key as string
                                                    )}
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
                                )}
                              </div>
                            );
                          })()}
                        </>
                      )}
                  </div>
                </div>
              )}

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ready to Connect?
              </h3>
              <p className="text-gray-600 mb-6">
                {`Get in touch with ${companion.title} to discuss how they can support your child's development.`}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="flex-1 text-white px-6 py-3 rounded-full font-semibold transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#47709B" }}
                >
                  Contact {companion.title}
                </button>
                <button
                  className="flex-1 border-2 px-6 py-3 rounded-full font-semibold transition-colors hover:bg-gray-50"
                  style={{ borderColor: "#47709B", color: "#47709B" }}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Companions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Other Companions
            </h3>
            <p className="text-lg text-gray-600">
              Discover more caring professionals
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center text-white px-8 py-3 rounded-full font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: "#47709B" }}
            >
              View All Companions
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5
                className="text-2xl font-bold mb-4"
                style={{ color: "#47709B" }}
              >
                MiniTeach
              </h5>
              <p className="text-gray-400">
                Connecting families with qualified child companions and
                educators.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Services</h6>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/companions"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    Find Companions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Support</h6>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/help"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/safety"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    Safety
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Connect</h6>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="#"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:opacity-80"
                    style={{ color: "#AFC8DA" }}
                  >
                    Twitter
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MiniTeach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
