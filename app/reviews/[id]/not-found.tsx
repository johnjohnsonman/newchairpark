import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"

export default function ReviewNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl">리뷰를 찾을 수 없습니다</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              요청하신 리뷰가 존재하지 않거나 삭제되었을 수 있습니다.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild variant="outline">
                <Link href="/reviews" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  리뷰 목록으로
                </Link>
              </Button>
              <Button asChild>
                <Link href="/">홈으로 가기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}