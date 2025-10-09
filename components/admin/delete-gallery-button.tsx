"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface DeleteGalleryButtonProps {
  itemId: string
  itemTitle: string
}

export function DeleteGalleryButton({ itemId, itemTitle }: DeleteGalleryButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${itemTitle}"?`)) {
      return
    }

    setIsDeleting(true)
    const supabase = createBrowserClient()

    try {
      const { error } = await supabase.from("gallery").delete().eq("id", itemId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      alert("Failed to delete gallery item")
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
