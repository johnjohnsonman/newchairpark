import { createClient } from "@/lib/supabase/server"
import { ResourceForm } from "@/components/admin/resource-form"

export default async function NewResourcePage() {
  const supabase = await createClient()

  // 브랜드 목록 가져오기
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, logo_url")
    .order("name")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">자료 추가</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <ResourceForm brands={brands || []} />
      </div>
    </div>
  )
}
