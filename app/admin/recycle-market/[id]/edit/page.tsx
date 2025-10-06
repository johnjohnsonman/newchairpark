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
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Edit Recycle Market Item</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <RecycleMarketForm recycleItem={recycleItem} brands={brands || []} />
      </div>
    </div>
  )
}
