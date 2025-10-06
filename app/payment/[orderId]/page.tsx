import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NaverPayButton } from "@/components/naver-pay-button"

export default async function PaymentPage({ params }: { params: { orderId: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch order details
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *
      )
    `,
    )
    .eq("id", params.orderId)
    .eq("user_id", user.id)
    .single()

  if (error || !order) {
    redirect("/my-page/orders")
  }

  // If already paid, redirect to success page
  if (order.status === "paid") {
    redirect("/payment/success?orderId=" + order.id)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">결제하기</h1>
        <NaverPayButton order={order} />
      </div>
    </div>
  )
}
