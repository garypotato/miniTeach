import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductWithMetafields,
  transformProductToCompanion,
  Companion,
} from "../../services/shopify";
import { ImageGallery } from "./ImageGallery";
import MetafieldsDisplay from "../../components/MetafieldsDisplay";

interface CompanionDetailProps {
  params: Promise<{
    id: string;
  }>;
}

async function getCompanion(id: string): Promise<Companion | null> {
  try {
    const result = await getProductWithMetafields(id);

    if (result.success && result.data) {
      return transformProductToCompanion(result.data);
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
            {companion.metafields && (
              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Professional Details
                </h3>
                <MetafieldsDisplay metafields={companion.metafields} />
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
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Support</h6>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <span className="text-gray-400">Contact us for support</span>
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
