export default function GalleryDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section Skeleton */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 배경 스켈레톤 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
        
        {/* 네비게이션 스켈레톤 */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6">
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-white/20 rounded animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-white/20 rounded-full animate-pulse" />
              <div className="h-8 w-8 bg-white/20 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 스켈레톤 */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <div className="mb-8">
            {/* 태그 스켈레톤 */}
            <div className="flex justify-center gap-3 mb-6">
              <div className="h-6 w-24 bg-white/20 rounded-full animate-pulse" />
              <div className="h-6 w-32 bg-white/20 rounded-full animate-pulse" />
            </div>
            
            {/* 제목 스켈레톤 */}
            <div className="h-16 md:h-20 bg-white/20 rounded-lg mb-6 animate-pulse" />
            <div className="h-16 md:h-20 bg-white/20 rounded-lg mb-6 animate-pulse" />
            
            {/* 설명 스켈레톤 */}
            <div className="space-y-3">
              <div className="h-6 bg-white/20 rounded-lg animate-pulse" />
              <div className="h-6 bg-white/20 rounded-lg animate-pulse" />
              <div className="h-6 w-3/4 mx-auto bg-white/20 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* 메타 정보 스켈레톤 */}
          <div className="flex justify-center items-center gap-8">
            <div className="h-4 w-20 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
          </div>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* 작품 정보 섹션 스켈레톤 */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* 메인 정보 스켈레톤 */}
            <div className="lg:col-span-2">
              <div className="h-8 w-48 bg-slate-200 rounded mb-8 animate-pulse" />
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-16 bg-slate-200 rounded mb-2 animate-pulse" />
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* 사이드바 스켈레톤 */}
            <div className="space-y-8">
              <div className="p-6 bg-white/80 rounded-lg">
                <div className="h-6 w-32 bg-slate-200 rounded mb-4 animate-pulse" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                      <div className="w-15 h-15 bg-slate-200 rounded-lg animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-24 bg-slate-200 rounded mb-2 animate-pulse" />
                        <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                      </div>
                      <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-slate-800 rounded-lg">
                <div className="h-6 w-24 bg-slate-700 rounded mb-4 animate-pulse" />
                <div className="h-4 w-full bg-slate-700 rounded mb-6 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-10 w-full bg-slate-700 rounded animate-pulse" />
                  <div className="h-10 w-full bg-slate-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 리뷰 섹션 스켈레톤 */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-48 bg-slate-200 rounded mb-12 mx-auto animate-pulse" />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 bg-white rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, j) => (
                          <div key={j} className="w-4 h-4 bg-slate-200 rounded animate-pulse" />
                        ))}
                      </div>
                      <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
