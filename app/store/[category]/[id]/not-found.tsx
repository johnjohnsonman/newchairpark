import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h2 className="mb-4 text-3xl font-bold">제품을 찾을 수 없습니다</h2>
      <p className="mb-8 text-muted-foreground">요청하신 제품이 존재하지 않거나 삭제되었습니다.</p>
      <Button asChild>
        <Link href="/store">스토어로 돌아가기</Link>
      </Button>
    </div>
  )
}
