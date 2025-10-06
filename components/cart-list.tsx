"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"

interface CartItem {
  id: string
  quantity: number
  product_id: string
  recycle_items: {
    id: string
    title: string
    price: number | null
    image_url: string | null
    status: string | null
  } | null
}

interface CartListProps {
  cartItems: CartItem[]
}

export function CartList({ cartItems: initialCartItems }: CartListProps) {
  const router = useRouter()
  const supabase = createClient()
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleRemove = async (cartItemId: string) => {
    setIsLoading(cartItemId)
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId)

      if (error) throw error

      setCartItems(cartItems.filter((item) => item.id !== cartItemId))
    } catch (error) {
      console.error("Error removing item:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = item.recycle_items?.price || 0
    return sum + price * item.quantity
  }, 0)

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">장바구니가 비어있습니다</h2>
        <p className="text-muted-foreground mb-6">중고마켓에서 상품을 둘러보세요</p>
        <Link href="/recycle-market">
          <Button>중고마켓 보기</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map((item) => {
          const product = item.recycle_items
          if (!product) return null

          return (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={product.image_url || "/placeholder.svg?height=96&width=96"}
                      alt={product.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{product.title}</h3>
                    <p className="text-lg font-bold text-primary">{product.price?.toLocaleString()}원</p>
                    {product.status === "sold" && <p className="text-sm text-destructive mt-1">판매완료</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.id)}
                    disabled={isLoading === item.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold">주문 요약</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">상품 수</span>
                <span>{cartItems.length}개</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>총 금액</span>
                <span className="text-primary">{totalAmount.toLocaleString()}원</span>
              </div>
            </div>
            <Link href="/checkout" className="block">
              <Button className="w-full" size="lg">
                주문하기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
