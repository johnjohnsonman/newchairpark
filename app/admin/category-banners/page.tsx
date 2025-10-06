import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Pencil } from "lucide-react"

export default async function CategoryBannersPage() {
  const supabase = await createServerClient()
  const { data: banners } = await supabase.from("category_banners").select("*").order("category_id")

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">카테고리 배너 관리</h1>
            <p className="mt-2 text-muted-foreground">스토어 카테고리별 배너 이미지와 설명을 관리합니다</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">대시보드로 돌아가기</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {banners?.map((banner) => (
            <Card key={banner.id} className="overflow-hidden">
              <div className="relative aspect-video bg-neutral-100">
                {banner.background_image && (
                  <Image
                    src={banner.background_image || "/placeholder.svg"}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{banner.category_name}</span>
                  <Link href={`/admin/category-banners/${banner.id}/edit`}>
                    <Button size="sm" variant="ghost">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm font-semibold">{banner.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{banner.description}</p>
                <div className="mt-4 flex gap-2">
                  <div className="relative h-16 w-16 overflow-hidden rounded border">
                    {banner.featured_image && (
                      <Image
                        src={banner.featured_image || "/placeholder.svg"}
                        alt="Featured"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
