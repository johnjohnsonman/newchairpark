import { createClient } from "@/lib/supabase/server"
import { GalleryClient } from "@/components/gallery-client"

export const metadata = {
  title: "갤러리 | 체어파크",
  description: "체어파크의 프리미엄 가구 갤러리를 둘러보세요",
}

export default async function GalleryPage() {
  const supabase = await createClient()

  const { data: galleryItems } = await supabase.from("gallery").select("id, title, description, brand, product_name, image_url, images, featured_image_index, created_at").order("created_at", { ascending: false })

  const { data: brands } = await supabase.from("brands").select("name").order("name")

  return <GalleryClient galleryItems={galleryItems || []} brands={brands || []} />
}
