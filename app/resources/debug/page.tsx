import { getResources, getBooks } from "../../../lib/shopify";

export default async function DebugResourcesPage() {
  // First, let's get raw resources
  const resourcesResult = await getResources();
  

  // Then get processed books
  const booksResult = await getBooks();
  

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">资源调试页面</h1>
        
        {/* Raw Resources Debug */}
        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">原始资源数据 (Raw Resources)</h2>
          <div className="bg-white p-4 rounded border">
            <p><strong>成功:</strong> {String(resourcesResult.success)}</p>
            <p><strong>错误:</strong> {resourcesResult.error || "无"}</p>
            <p><strong>数据条数:</strong> {resourcesResult.data?.length || 0}</p>
            
            {resourcesResult.data && resourcesResult.data.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">资源列表:</h3>
                {resourcesResult.data.map((resource, index) => (
                  <div key={resource.id} className="border p-2 mb-2 bg-gray-50">
                    <p><strong>#{index + 1}</strong></p>
                    <p><strong>ID:</strong> {resource.id}</p>
                    <p><strong>标题:</strong> {resource.title}</p>
                    <p><strong>书名 (last_name):</strong> &quot;{resource.metafields?.last_name || '未设置'}&quot;</p>
                    <p><strong>图片数量:</strong> {resource.images?.length || 0}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Processed Books Debug */}
        <div className="bg-blue-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">处理后的书籍数据 (Processed Books)</h2>
          <div className="bg-white p-4 rounded border">
            <p><strong>成功:</strong> {String(booksResult.success)}</p>
            <p><strong>错误:</strong> {booksResult.error || "无"}</p>
            <p><strong>书籍数量:</strong> {booksResult.data?.length || 0}</p>
            
            {booksResult.data && booksResult.data.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">书籍列表:</h3>
                {booksResult.data.map((book, index) => (
                  <div key={book.name} className="border p-2 mb-2 bg-gray-50">
                    <p><strong>#{index + 1}</strong></p>
                    <p><strong>书名:</strong> &quot;{book.name}&quot;</p>
                    <p><strong>章节数量:</strong> {book.chapters.length}</p>
                    {book.chapters.length > 0 && (
                      <div className="ml-4 mt-2">
                        <p><strong>章节列表:</strong></p>
                        {book.chapters.map((chapter) => (
                          <div key={chapter.id} className="text-sm text-gray-600 ml-2">
                            • {chapter.title} (ID: {chapter.id})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cache Refresh */}
        <div className="mt-8 bg-green-100 p-4 rounded-lg">
          <h3 className="font-bold text-green-800 mb-2">缓存刷新:</h3>
          <p className="text-green-700 mb-4">如果在生产环境中看不到新产品，点击下面的按钮清除缓存:</p>
          <form action="/api/refresh-resources" method="POST">
            <button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              清除资源页面缓存
            </button>
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-yellow-100 p-4 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-2">调试说明:</h3>
          <ol className="list-decimal list-inside text-yellow-800 space-y-1">
            <li>检查&quot;原始资源数据&quot;部分，确认新产品是否被获取</li>
            <li>查看每个资源的&quot;书名 (last_name)&quot;字段是否正确设置</li>
            <li>检查&quot;处理后的书籍数据&quot;部分，看新书是否出现在列表中</li>
            <li>如果资源未出现，检查Shopify中的产品集合ID是否正确</li>
            <li>如果last_name为&quot;未设置&quot;，检查Shopify中的元字段配置</li>
            <li><strong>生产环境:</strong> 如果在Vercel上看不到新产品，点击上面的&quot;清除资源页面缓存&quot;按钮</li>
          </ol>
        </div>
      </div>
    </div>
  );
}