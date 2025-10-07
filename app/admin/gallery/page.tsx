import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit } from "lucide-react"
import { DeleteGalleryButton } from "@/components/admin/delete-gallery-button"

export default async function GalleryManagementPage() {
  const supabase = await createClient()

  // 필요한 필드만 선택하고 제한된 수만 가져오기
  const { data: galleryItems, error } = await supabase
    .from("gallery")
    .select("id, title, description, image_url, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(50) // 최대 50개만 가져오기

  if (error) {
    console.error('Gallery fetch error:', error)
  }

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
            <h1 className="text-2xl font-bold">Gallery Management</h1>
          </div>
          <Link href="/admin/gallery/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {!galleryItems || galleryItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">No gallery images yet</p>
              <Link href="/admin/gallery/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Image
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative bg-gray-100">
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title || "Gallery image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    priority={false}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1">{item.title}</h3>
                  {item.description && <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.description}</p>}
                  <div className="flex gap-2">
                    <Link href={`/admin/gallery/${item.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteGalleryButton itemId={item.id} itemTitle={item.title} />
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
