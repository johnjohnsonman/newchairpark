import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ResourcesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
        </div>

        {/* Resources by Brand */}
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-8 h-8 rounded" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Card key={j}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-8 h-8" />
                          <div>
                            <Skeleton className="h-5 w-48 mb-2" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-12" />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
