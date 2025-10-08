"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ProductError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Product page error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              문제가 발생했습니다
            </h1>
            <p className="text-gray-600 mb-4">
              제품 페이지를 불러오는 중 오류가 발생했습니다.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left mb-4 p-3 bg-gray-100 rounded text-sm">
                <summary className="cursor-pointer font-medium">오류 세부사항</summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={reset}
              className="w-full flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              다시 시도
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/store'}
              className="w-full"
            >
              스토어로 돌아가기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
