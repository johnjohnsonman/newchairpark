import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

const brandsData: Record<
  string,
  {
    name: string
    description: string
    heroImage: string
    products: Array<{
      id: string
      name: string
      brand: string
      price: string
      image: string
      badge?: string
    }>
  }
> = {
  "herman-miller": {
    name: "HermanMiller",
    description:
      "Herman Miller is a pioneer in design, and we continue to usher in new ways of living and working, just as we've done for the past 100-plus years.",
    heroImage: "/placeholder.svg?height=400&width=1200",
    products: [
      {
        id: "1",
        name: "Eames Wire Base Elliptical Table SLS",
        brand: "HERMANMILLER / 테이블",
        price: "3,600,000원",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "2",
        name: "Eames Executive Chairs",
        brand: "HERMANMILLER / 의자",
        price: "36,750,000원",
        image: "/placeholder.svg?height=300&width=300",
        badge: "단종품",
      },
      {
        id: "3",
        name: "Aeron Chair (Mineral)",
        brand: "HERMANMILLER / 의자",
        price: "2,820,000원",
        image: "/placeholder.svg?height=300&width=300",
        badge: "재입고",
      },
      {
        id: "4",
        name: "Eames Tables 타원형 테이블",
        brand: "HERMANMILLER / 테이블",
        price: "2,790,000원",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "5",
        name: "Aeron Chair (Graphite)",
        brand: "HERMANMILLER / 의자",
        price: "2,420,000원",
        image: "/placeholder.svg?height=300&width=300",
        badge: "단종품",
      },
      {
        id: "6",
        name: "Eames Soft Pad Chairs 알루미늄 체어 - 하이",
        brand: "HERMANMILLER / 의자",
        price: "6,970,000원",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "7",
        name: "Eames Aluminum Group Lounge Chair",
        brand: "HERMANMILLER / 의자",
        price: "5,680,000원",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "8",
        name: "Verus",
        brand: "HERMANMILLER / 의자",
        price: "1,850,000원",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "9",
        name: "Eames Conference Table Oval (Walnut)",
        brand: "HERMANMILLER / 테이블",
        price: "6,090,000원",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "10",
        name: "Cosm Highback Leaf arm",
        brand: "HERMANMILLER / 의자",
        price: "2,860,000원",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "11",
        name: "Eames Aluminum Group Chairs",
        brand: "HERMANMILLER / 의자",
        price: "6,190,000원",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "12",
        name: "Sayl",
        brand: "HERMANMILLER / 의자",
        price: "1,340,000원",
        image: "/placeholder.svg?height=300&width=300",
        badge: "재입고",
      },
    ],
  },
  steelcase: {
    name: "Steelcase",
    description:
      "For over 100 years, Steelcase has been designing innovative furniture and spaces to help people do their best work.",
    heroImage: "/placeholder.svg?height=400&width=1200",
    products: [
      {
        id: "1",
        name: "Gesture",
        brand: "STEELCASE / 의자",
        price: "1,890,000원",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "2",
        name: "Leap",
        brand: "STEELCASE / 의자",
        price: "1,650,000원",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "3",
        name: "Series 1",
        brand: "STEELCASE / 의자",
        price: "890,000원",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "4",
        name: "Think",
        brand: "STEELCASE / 의자",
        price: "1,420,000원",
        image: "/placeholder.svg?height=300&width=300",
      },
    ],
  },
  knoll: {
    name: "Knoll",
    description:
      "Knoll is a design firm that produces office systems, seating, files and storage, tables and desks, textiles and accessories.",
    heroImage: "/placeholder.svg?height=400&width=1200",
    products: [],
  },
}

export default function BrandDetailPage({ params }: { params: { slug: string } }) {
  const brand = brandsData[params.slug]

  if (!brand) {
    notFound()
  }

  return (
    <div className="bg-white">
      <div className="relative bg-slate-100">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2">
            <div className="flex items-center px-6 py-16 lg:px-12">
              <div>
                <div className="mb-4 text-4xl font-bold">{brand.name}</div>
                <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">{brand.description}</p>
              </div>
            </div>
            <div className="relative h-80 lg:h-auto">
              <Image src={brand.heroImage || "/placeholder.svg"} alt={brand.name} fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{brand.products.length}개 제품</div>
          <div className="flex items-center gap-4">
            <select className="rounded-md border border-border bg-white px-4 py-2 text-sm">
              <option>인기순</option>
              <option>최신순</option>
              <option>낮은 가격순</option>
              <option>높은 가격순</option>
            </select>
          </div>
        </div>

        {brand.products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {brand.products.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-border">
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition-transform group-hover:scale-105"
                  />
                  {product.badge && (
                    <div className="absolute left-3 top-3 rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white">
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute right-3 top-3 flex gap-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white shadow-sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-1 text-xs text-muted-foreground">{product.brand}</div>
                  <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-tight">{product.name}</h3>
                  <div className="text-base font-bold">{product.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">등록된 제품이 없습니다.</div>
        )}
      </div>
    </div>
  )
}
