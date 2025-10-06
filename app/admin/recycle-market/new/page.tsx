import { createClient } from "@/lib/supabase/server"
import { RecycleMarketForm } from "@/components/admin/recycle-market-form"

export default async function NewRecycleMarketPage() {
  const supabase = await createClient()

  const { data: brands } = await supabase.from("brands").select("id, name").order("name")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Add Recycle Market Item</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <RecycleMarketForm brands={brands || []} />
      </div>
    </div>
  )
}
