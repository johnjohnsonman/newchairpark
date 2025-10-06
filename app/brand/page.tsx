import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"

export default async function BrandPage() {
  const supabase = await createServerClient()

  const { data: brands, error } = await supabase.from("brands").select("*").order("name")

  if (error) {
    return (
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="py-16 text-center text-neutral-500">
            <p>브랜드를 불러오는 중 오류가 발생했습니다.</p>
            <p className="mt-2 text-sm">잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="mb-2 text-3xl font-bold">BRAND ({brands?.length || 0})</h1>
        </div>

        {brands && brands.length > 0 ? (
          <div className="grid grid-cols-2 gap-px border-t border-l border-border md:grid-cols-4">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brand/${brand.slug}`}
                className="group flex aspect-square items-center justify-center border-r border-b border-border bg-white p-8 transition-colors hover:bg-accent"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={brand.logo_url || "/placeholder.svg"}
                    alt={brand.name}
                    fill
                    className="object-contain transition-transform group-hover:scale-105"
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-neutral-500">
            <p>등록된 브랜드가 없습니다.</p>
            <p className="mt-2 text-sm">어드민 페이지에서 브랜드를 등록해주세요.</p>
          </div>
        )}
      </div>
    </div>
  )
}
