export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* 브레드크럼 스켈레톤 */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 스켈레톤 */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 이미지 갤러리 스켈레톤 */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* 제품 정보 스켈레톤 */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>

            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>

            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>

            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
