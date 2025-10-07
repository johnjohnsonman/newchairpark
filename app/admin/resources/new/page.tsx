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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">자료 추가</h1>
      </div>
      <ResourceForm brands={brands || []} />
    </div>
  )
}
