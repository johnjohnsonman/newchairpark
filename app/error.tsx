"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="text-center">
        <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
        <h2 className="mb-4 text-3xl font-bold">문제가 발생했습니다</h2>
        <p className="mb-8 text-lg text-muted-foreground">페이지를 불러오는 중 오류가 발생했습니다.</p>
        <Button onClick={reset} size="lg">
          다시 시도
        </Button>
      </div>
    </div>
  )
}
