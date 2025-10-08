"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Heart, 
  Share2, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductDetailViewProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    original_price?: number
    images: string[]
    in_stock: boolean
    featured: boolean
    specifications?: any
    brands?: {
      name: string
      description?: string
      logo_url?: string
    }
    product_options?: Array<{
      id: string
      name: string
      type: string
      required: boolean
      values: Array<{
        value: string
        color?: string
        label?: string
      }>
    }>
    product_variants?: Array<{
      id: string
      name: string
      price: number
      original_price?: number
      stock_quantity: number
      options: any
      images: string[]
      is_default: boolean
    }>
  }
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // 선택된 옵션에 따른 변형 찾기
  const selectedVariant = product.product_variants?.find(variant => {
    return Object.keys(selectedOptions).every(optionName => 
      variant.options[optionName] === selectedOptions[optionName]
    )
  }) || product.product_variants?.find(v => v.is_default)

  const currentPrice = selectedVariant?.price || product.price
  const currentOriginalPrice = selectedVariant?.original_price || product.original_price
  const currentImages = selectedVariant?.images?.length ? selectedVariant.images : product.images
  const currentStock = selectedVariant?.stock_quantity ?? (product.in_stock ? 999 : 0)

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }))
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, currentStock)))
  }

  const discountPercentage = currentOriginalPrice && currentOriginalPrice > currentPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* 이미지 갤러리 */}
      <div className="space-y-4">
        {/* 메인 이미지 */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
              {currentImages[selectedImageIndex] ? (
                <Image
                  src={currentImages[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-300 hover:scale-105"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <span>이미지 없음</span>
                </div>
              )}
              
              {/* 네비게이션 버튼 */}
              {currentImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === 0 ? currentImages.length - 1 : prev - 1
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === currentImages.length - 1 ? 0 : prev + 1
                    )}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* 배지들 */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {discountPercentage}% 할인
                  </Badge>
                )}
                {product.featured && (
                  <Badge variant="secondary">추천</Badge>
                )}
                {!currentStock && (
                  <Badge variant="destructive">품절</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 썸네일 이미지들 */}
        {currentImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {currentImages.map((image, index) => (
              <Card 
                key={index} 
                className={cn(
                  "cursor-pointer overflow-hidden transition-all",
                  selectedImageIndex === index 
                    ? "ring-2 ring-primary" 
                    : "hover:ring-1 hover:ring-gray-300"
                )}
                onClick={() => setSelectedImageIndex(index)}
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 제품 정보 */}
      <div className="space-y-6">
        {/* 브랜드 */}
        {product.brands?.name && (
          <div className="flex items-center gap-3">
            {product.brands.logo_url && (
              <Image
                src={product.brands.logo_url}
                alt={product.brands.name}
                width={32}
                height={32}
                className="rounded"
              />
            )}
            <Badge variant="outline" className="text-sm">
              {product.brands.name}
            </Badge>
          </div>
        )}

        {/* 제품명 */}
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

        {/* 가격 */}
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-primary">
            {currentPrice.toLocaleString()}원
          </div>
          {currentOriginalPrice && currentOriginalPrice > currentPrice && (
            <div className="text-lg text-muted-foreground line-through">
              {currentOriginalPrice.toLocaleString()}원
            </div>
          )}
        </div>

        {/* 평점 (임시) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">(4.8) · 리뷰 127개</span>
        </div>

        {/* 옵션 선택 */}
        {product.product_options && product.product_options.length > 0 && (
          <div className="space-y-4">
            <Separator />
            {product.product_options.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="font-medium">{option.name}</label>
                  {option.required && (
                    <Badge variant="destructive" className="text-xs">필수</Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <Button
                      key={value.value}
                      variant={selectedOptions[option.name] === value.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleOptionSelect(option.name, value.value)}
                      className="flex items-center gap-2"
                    >
                      {option.type === 'color' && value.color && (
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: value.color }}
                        />
                      )}
                      {value.label || value.value}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 수량 선택 */}
        <div className="space-y-2">
          <label className="font-medium">수량</label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= currentStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button 
              size="lg" 
              className="flex-1"
              disabled={!currentStock}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {currentStock ? '장바구니 담기' : '품절'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={cn(
                "transition-colors",
                isWishlisted && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart className={cn(
                "h-5 w-5",
                isWishlisted && "fill-current"
              )} />
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          
          <Button variant="secondary" size="lg" className="w-full">
            바로 구매하기
          </Button>
        </div>

        {/* 배송/보장 정보 */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-4 w-4 text-green-600" />
              <span>무료배송 (50,000원 이상 구매 시)</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>정품 보증 및 A/S 지원</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="h-4 w-4 text-orange-600" />
              <span>30일 무료 교환/반품</span>
            </div>
          </CardContent>
        </Card>

        {/* 제품 설명 */}
        {product.description && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">제품 설명</h3>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {product.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 브랜드 정보 */}
        {product.brands?.description && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">{product.brands.name}</h3>
              <p className="text-sm text-muted-foreground">
                {product.brands.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
