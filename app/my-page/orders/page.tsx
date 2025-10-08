import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OrdersList } from "@/components/orders-list"

export default async function OrdersPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch orders with order items
  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">주문 내역</h1>
      <OrdersList orders={orders || []} />
    </div>
  )
}
