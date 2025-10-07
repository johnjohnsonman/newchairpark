import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ProductEditNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">
          제품을 찾을 수 없습니다
        </h2>
        <p className="text-slate-600 mb-8">
          요청하신 제품이 존재하지 않거나 삭제되었을 수 있습니다.
        </p>
        <Button asChild>
          <Link href="/admin/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            제품 관리로 돌아가기
          </Link>
        </Button>
      </div>
    </div>
  )
}

