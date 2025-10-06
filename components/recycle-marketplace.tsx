"use client"

import { useState } from "react"
import { Search, MapPin, Map, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import Link from "next/link"

const MapView = dynamic(() => import("./map-view"), { ssr: false })

type RecycleItem = {
  id: string
  title: string
  description: string | null
  price: number
  original_price: number | null
  condition: string | null
  category: string | null
  brand: string | null
  location: string | null
  seller_name: string | null
  seller_contact: string | null
  status: string
  image_url: string | null
  images: string[] | null
  created_at: string
}

export default function RecycleMarketplace({ items }: { items: RecycleItem[] }) {
  const [viewMode, setViewMode] = useState<"list" | "map">("map")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [condition, setCondition] = useState<string>("all")
  const [location, setLocation] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")

  const activeItems = items.filter((item) => item.status === "active")

  const filteredListings = activeItems.filter((item) => {
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false
    if (condition !== "all" && item.condition !== condition) return false
    if (location !== "all" && item.location !== location) return false
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      if (max && (item.price < min || item.price > max)) return false
      if (!max && item.price < min) return false
    }
    return true
  })

  const categories = Array.from(new Set(activeItems.map((item) => item.category).filter(Boolean)))
  const locations = Array.from(new Set(activeItems.map((item) => item.location).filter(Boolean)))
  const conditions = Array.from(new Set(activeItems.map((item) => item.condition).filter(Boolean)))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">체어파크 리싸이클</h1>
            <Link href="/my-page">
              <Button variant="outline">내 페이지</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="가구 검색..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category as string}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="가격대" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="0-50000">5만원 이하</SelectItem>
                  <SelectItem value="50000-100000">5만원-10만원</SelectItem>
                  <SelectItem value="100000-200000">10만원-20만원</SelectItem>
                  <SelectItem value="200000">20만원 이상</SelectItem>
                </SelectContent>
              </Select>

              {conditions.length > 0 && (
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {conditions.map((cond) => (
                      <SelectItem key={cond} value={cond as string}>
                        {cond}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {locations.length > 0 && (
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="지역" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc as string}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div className="ml-auto flex gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("map")}
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">총 {filteredListings.length}개의 매물</p>
        </div>

        {viewMode === "list" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredListings.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                  <p className="mb-3 text-xl font-bold text-primary">{item.price.toLocaleString()}원</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {item.location && (
                      <>
                        <MapPin className="h-4 w-4" />
                        <span>{item.location}</span>
                      </>
                    )}
                    {item.condition && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.condition}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="h-[calc(100vh-300px)] overflow-hidden rounded-lg border">
            <MapView listings={filteredListings} />
          </div>
        )}

        {filteredListings.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">검색 결과가 없습니다</p>
            <Link href="/my-page/recycle/new" className="mt-4 inline-block">
              <Button>첫 번째 매물 등록하기</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
