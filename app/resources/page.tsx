import Link from "next/link";
import { getBooks } from "../../lib/shopify";

export default async function ResourcesPage() {
  const booksResult = await getBooks();

  if (!booksResult.success || !booksResult.data) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">学习资源</h1>
            <p className="text-xl text-gray-600">
              抱歉，暂时无法加载资源。请稍后重试。
            </p>
          </div>
        </div>
      </div>
    );
  }

  const books = booksResult.data;

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">学习资源</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            探索我们精心整理的教育资源，按主题分类，帮助您的孩子更好地学习和成长。
          </p>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-24 w-24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              暂无可用资源
            </h3>
            <p className="text-gray-600">
              我们正在努力添加更多学习资源，请稍后再来查看。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <Link
                key={book.name}
                href={`/resource/${encodeURIComponent(book.name)}`}
                className="group h-full"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 overflow-hidden h-full flex flex-col">
                  {/* Book Cover - Use first chapter's first image */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 p-4 flex items-center justify-center overflow-hidden">
                    {book.chapters[0]?.images?.[0] ? (
                      <div className="w-full h-full bg-white rounded-lg shadow-sm overflow-hidden p-2">
                        <img
                          src={book.chapters[0].images[0].src}
                          alt={book.name}
                          className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-white rounded-lg shadow-sm flex items-center justify-center p-6">
                        <div className="text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-blue-400 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <p className="text-blue-600 font-medium text-sm">
                            {book.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {book.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
