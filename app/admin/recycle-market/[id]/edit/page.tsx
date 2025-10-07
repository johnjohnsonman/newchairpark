import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { RecycleMarketForm } from "@/components/admin/recycle-market-form"

export default async function EditRecycleMarketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: recycleItem }, { data: brands }] = await Promise.all([
    supabase.from("recycle_items").select("*").eq("id", id).single(),
    supabase.from("brands").select("id, name").order("name"),
  ])

  if (!recycleItem) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Recycle Market Item</h1>
      </div>
      <RecycleMarketForm recycleItem={recycleItem} brands={brands || []} />
    </div>
  )
}
