import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TouchOptimizedButton } from "@/components/ui/touch-optimized-button"

export default function ReviewNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold">리뷰를 찾을 수 없습니다</h1>
            <p className="text-muted-foreground">
              요청하신 리뷰가 존재하지 않거나 삭제되었을 수 있습니다.
            </p>
          </div>
          
          <div className="space-y-4">
            <TouchOptimizedButton asChild className="w-full">
              <Link href="/reviews">
                리뷰 목록으로 돌아가기
              </Link>
            </TouchOptimizedButton>
            <TouchOptimizedButton variant="outline" asChild className="w-full">
              <Link href="/reviews/new">
                새 리뷰 작성하기
              </Link>
            </TouchOptimizedButton>
          </div>
        </div>
      </div>
    </div>
  )
}
