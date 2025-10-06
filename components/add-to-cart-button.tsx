"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { ShoppingCart, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  productId: string
  className?: string
}

export function AddToCartButton({ productId, className }: AddToCartButtonProps) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)

    try {
      // Check if user is logged in
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "장바구니를 사용하려면 로그인하세요",
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }

      // Check if item already in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single()

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({
            quantity: existingItem.quantity + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingItem.id)

        if (error) throw error
      } else {
        // Add new item
        const { error } = await supabase.from("cart_items").insert([
          {
            user_id: user.id,
            product_id: productId,
            quantity: 1,
          },
        ])

        if (error) throw error
      }

      toast({
        title: "장바구니에 추가되었습니다",
        description: "장바구니에서 확인하세요",
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Add to cart error:", error)
      toast({
        title: "오류가 발생했습니다",
        description: "다시 시도해주세요",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleAddToCart} disabled={isLoading} size="lg" className={className}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          추가 중...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          장바구니에 추가
        </>
      )}
    </Button>
  )
}
