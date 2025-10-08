import { createServerClient } from "@/lib/supabase/server"
import { RecycleMarketForm } from "@/components/admin/recycle-market-form"

export default async function NewRecycleMarketPage() {
  const supabase = await createServerClient()

  const { data: brands } = await supabase.from("brands").select("id, name").order("name")

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Recycle Market Item</h1>
      </div>
      <RecycleMarketForm brands={brands || []} />
    </div>
  )
}
