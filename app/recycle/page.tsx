import { createServerClient } from "@/lib/supabase/server"
import RecycleMarketplace from "@/components/recycle-marketplace"

export const metadata = {
  title: "리싸이클 | 체어파크",
  description: "합리적인 가격의 프리미엄 중고 가구를 만나보세요",
}

export default async function RecyclePage() {
  const supabase = await createServerClient()

  const { data: items } = await supabase.from("recycle_items").select("*").order("created_at", { ascending: false })

  return <RecycleMarketplace items={items || []} />
}
