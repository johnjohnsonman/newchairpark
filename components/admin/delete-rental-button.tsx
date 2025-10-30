"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface DeleteRentalButtonProps {
  rentalId: string
  rentalName: string
}

export function DeleteRentalButton({ rentalId, rentalName }: DeleteRentalButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`정말로 "${rentalName}"을(를) 삭제하시겠습니까?`)) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/rentals/${rentalId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "삭제에 실패했습니다.")
      }

      alert("렌탈이 성공적으로 삭제되었습니다.")
      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      alert(error instanceof Error ? error.message : "삭제에 실패했습니다.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-700 bg-transparent"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}




