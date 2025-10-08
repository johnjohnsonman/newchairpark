import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { RecycleMarketForm } from "@/components/admin/recycle-market-form"

export default async function EditRecycleMarketPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerClient()

    const [{ data: recycleItem, error: itemError }, { data: brands }] = await Promise.all([
      supabase.from("recycle_items").select("*").eq("id", id).single(),
      supabase.from("brands").select("id, name").order("name"),
    ])

    if (itemError || !recycleItem) {
      console.error('Recycle item not found:', { id, itemError })
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
  } catch (error) {
    console.error('Edit recycle item page error:', error)
    notFound()
  }
}
