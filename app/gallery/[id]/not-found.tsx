import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function GalleryNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="text-center px-6 max-w-2xl">
        {/* 404 Icon */}
        <div className="mb-8">
          <h1 className="text-9xl font-thin text-slate-300">404</h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-light text-slate-800 mb-4">
          갤러리 작품을 찾을 수 없습니다
        </h2>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          요청하신 작품이 존재하지 않거나 이동되었을 수 있습니다.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button 
            asChild 
            size="lg"
            className="gap-2"
          >
            <Link href="/gallery">
              <ArrowLeft className="w-4 h-4" />
              갤러리로 돌아가기
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              홈으로 가기
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-slate-100/50 rounded-lg">
          <p className="text-sm text-slate-600">
            문제가 계속되면 고객 센터로 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  )
}

