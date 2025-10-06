"use client"

import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

type GalleryItem = {
  id: string
  title: string
  description: string | null
  category: string | null
  image_url: string
  featured: boolean
  created_at: string
}

type Brand = {
  name: string
}

export function GalleryClient({ galleryItems, brands }: { galleryItems: GalleryItem[]; brands: Brand[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const featuredItems = galleryItems.filter((item) => item.featured).slice(0, 4)
  const displayFeaturedItems = featuredItems.length > 0 ? featuredItems : galleryItems.slice(0, 4)

  useEffect(() => {
    if (!isAutoPlaying || displayFeaturedItems.length === 0) return
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % displayFeaturedItems.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, displayFeaturedItems.length])

  const filteredItems = galleryItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(galleryItems.map((item) => item.category).filter(Boolean)))

  const nextFeatured = () => {
    setIsAutoPlaying(false)
    setFeaturedIndex((prev) => (prev + 1) % displayFeaturedItems.length)
  }

  const prevFeatured = () => {
    setIsAutoPlaying(false)
    setFeaturedIndex((prev) => (prev - 1 + displayFeaturedItems.length) % displayFeaturedItems.length)
  }

  const openGalleryItem = (item: GalleryItem) => {
    setSelectedItem(item)
  }

  if (displayFeaturedItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">갤러리 아이템이 없습니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden bg-black">
        {displayFeaturedItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === featuredIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={item.image_url || "/placeholder.svg"} alt={item.title} className="h-full w-full object-contain" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
        ))}

        <button
          onClick={prevFeatured}
          className="absolute left-8 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur-sm transition-all hover:bg-white/20"
          aria-label="Previous"
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </button>
        <button
          onClick={nextFeatured}
          className="absolute right-8 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur-sm transition-all hover:bg-white/20"
          aria-label="Next"
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </button>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-20">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-2 text-sm font-light uppercase tracking-widest text-white/70">Featured Gallery</p>
            <h1 className="mb-4 font-serif text-5xl font-light text-white md:text-6xl lg:text-7xl">
              {displayFeaturedItems[featuredIndex].title}
            </h1>
            {displayFeaturedItems[featuredIndex].category && (
              <p className="mb-2 text-lg text-white/90">{displayFeaturedItems[featuredIndex].category}</p>
            )}
            {displayFeaturedItems[featuredIndex].description && (
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
                {displayFeaturedItems[featuredIndex].description}
              </p>
            )}
          </div>

          <div className="mt-12 flex gap-3">
            {displayFeaturedItems.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false)
                  setFeaturedIndex(index)
                }}
                className={`h-2 rounded-full transition-all ${
                  index === featuredIndex ? "w-12 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="제품명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category as string}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-light">Collection</h2>
          <p className="text-muted-foreground">{filteredItems.length}개의 제품을 찾았습니다</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openGalleryItem(item)}
              className="group cursor-pointer overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="mb-1 font-semibold">{item.title}</h3>
                {item.category && <p className="mb-2 text-sm text-muted-foreground">{item.category}</p>}
                {item.description && <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">검색 결과가 없습니다</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-5xl">
          <DialogTitle className="sr-only">{selectedItem?.title} 갤러리</DialogTitle>
          {selectedItem && (
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                <img
                  src={selectedItem.image_url || "/placeholder.svg"}
                  alt={selectedItem.title}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="space-y-2 border-t pt-4">
                <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                {selectedItem.category && <p className="text-lg text-muted-foreground">{selectedItem.category}</p>}
                {selectedItem.description && <p className="text-sm">{selectedItem.description}</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
