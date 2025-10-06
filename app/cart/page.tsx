import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CartList } from "@/components/cart-list"

export default async function CartPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch cart items with product details
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      product_id,
      recycle_items (
        id,
        title,
        price,
        image_url,
        status
      )
    `,
    )
    .eq("user_id", user.id)

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">장바구니</h1>
      <CartList cartItems={cartItems || []} />
    </div>
  )
}
