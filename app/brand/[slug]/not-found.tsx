import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-3xl font-bold">브랜드를 찾을 수 없습니다</h2>
      <p className="mb-8 text-muted-foreground">요청하신 브랜드 페이지가 존재하지 않습니다.</p>
      <Button asChild>
        <Link href="/brand">브랜드 목록으로 돌아가기</Link>
      </Button>
    </div>
  )
}
