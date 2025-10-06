"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DeleteRecycleItemButtonProps {
  itemId: string
  itemTitle: string
}

export function DeleteRecycleItemButton({ itemId, itemTitle }: DeleteRecycleItemButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${itemTitle}"?`)) {
      return
    }

    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("recycle_market").delete().eq("id", itemId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      alert("Failed to delete item")
      console.error(error)
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
