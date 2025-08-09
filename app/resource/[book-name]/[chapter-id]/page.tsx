import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapter } from "../../../../lib/shopify";
import { getServerAuthSession } from "../../../../lib/auth";
import ChapterImageGallery from "./ChapterImageGallery";
import UnauthenticatedPreview from "./UnauthenticatedPreview";
import DownloadButton from "./DownloadButton";

interface ChapterPageProps {
  params: Promise<{
    "book-name": string;
    "chapter-id": string;
  }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { "book-name": encodedBookName, "chapter-id": chapterId } =
    await params;
  const bookName = decodeURIComponent(encodedBookName);

  // Get authentication session
  const session = await getServerAuthSession();
  const isAuthenticated = !!session?.user;

  // Fetch chapter data
  const chapterResult = await getChapter(bookName, chapterId);

  if (!chapterResult.success || !chapterResult.data) {
    notFound();
  }

  const chapter = chapterResult.data;
  const images = chapter.images || [];

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <Link
                href={`/resource/${encodeURIComponent(bookName)}`}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {bookName}
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
              <span className="text-gray-900 font-medium">{chapter.title}</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {chapter.title}
          </h1>
          <p className="text-lg text-gray-600">来自《{bookName}》</p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href={`/resource/${encodeURIComponent(bookName)}`}
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
                transform="rotate(180)"
              />
            </svg>
            返回章节列表
          </Link>
          
          <DownloadButton
            images={images}
            chapterTitle={chapter.title}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* Image Gallery */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {images.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-24 w-24 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                暂无图片
              </h3>
              <p className="text-gray-600">此章节暂时没有可用的图片内容。</p>
            </div>
          ) : !isAuthenticated ? (
            /* Unauthenticated user - show only first image with login prompt and modal */
            <UnauthenticatedPreview 
              images={images} 
              chapterTitle={chapter.title}
              redirectUrl={`/resource/${encodeURIComponent(bookName)}/${chapterId}`}
            />
          ) : (
            /* Authenticated user - show full gallery */
            <ChapterImageGallery
              images={images}
              isAuthenticated={isAuthenticated}
              chapterTitle={chapter.title}
              redirectUrl={`/resource/${encodeURIComponent(bookName)}/${chapterId}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
