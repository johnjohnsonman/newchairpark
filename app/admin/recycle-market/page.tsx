import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit } from "lucide-react"
import { DeleteRecycleItemButton } from "@/components/admin/delete-recycle-item-button"

export default async function RecycleMarketManagementPage() {
  const supabase = await createServerClient()

  const { data: recycleItems } = await supabase
    .from("recycle_items")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                ← Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Recycle Market Management</h1>
          </div>
          <Link href="/admin/recycle-market/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {!recycleItems || recycleItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">No recycle market items yet</p>
              <Link href="/admin/recycle-market/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Item
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recycleItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] relative bg-gray-100">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant={item.status === "available" ? "default" : "secondary"}>
                      {item.status === "available" ? "Available" : "Sold"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                    {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
                  </div>
                  <p className="text-xl font-bold text-green-600 mb-3">₩{item.price.toLocaleString()}</p>
                  {item.description && <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>}
                  <div className="flex gap-2">
                    <Link href={`/admin/recycle-market/${item.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteRecycleItemButton itemId={item.id} itemTitle={item.title} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
