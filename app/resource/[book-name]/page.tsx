import Link from "next/link";
import { notFound } from "next/navigation";
import { getChaptersByBookName } from "../../../lib/shopify";

interface BookPageProps {
  params: Promise<{
    "book-name": string;
  }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { "book-name": encodedBookName } = await params;
  const bookName = decodeURIComponent(encodedBookName);

  const chaptersResult = await getChaptersByBookName(bookName);

  if (
    !chaptersResult.success ||
    !chaptersResult.data ||
    chaptersResult.data.length === 0
  ) {
    notFound();
  }

  const chapters = chaptersResult.data;

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link
                href="/resources"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                学习资源
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                className="h-4 w-4 text-gray-300 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-900 font-medium">{bookName}</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{bookName}</h1>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter, index) => (
            <Link
              key={chapter.id}
              href={`/resource/${encodeURIComponent(bookName)}/${chapter.id}`}
              className="group h-full"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 overflow-hidden h-full flex flex-col">
                {/* Chapter Thumbnail */}
                <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 p-3 overflow-hidden">
                  {chapter.images?.[0] ? (
                    <div className="w-full h-full bg-white rounded-lg shadow-sm overflow-hidden p-2">
                      <img
                        src={chapter.images[0].src}
                        alt={chapter.title}
                        className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <div className="text-center p-4">
                        <svg
                          className="mx-auto h-10 w-10 text-gray-400 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                          />
                        </svg>
                        <p className="text-gray-500 text-sm">
                          第 {index + 1} 章
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chapter Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                    {chapter.title}
                  </h3>

                  {/* Call to Action */}
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors mt-auto">
                    <span>查看详情</span>
                    <svg
                      className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
