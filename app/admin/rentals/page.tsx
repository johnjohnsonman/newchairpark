"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit } from "lucide-react"
import { DeleteRentalButton } from "@/components/admin/delete-rental-button"

interface Rental {
  id: string
  name: string
  type: "rental" | "demo"
  price_monthly?: number
  price_daily?: number
  image_url: string
  available: boolean
  featured?: boolean
  brand_id?: string
  created_at: string
  brands?: {
    id: string
    name: string
  }
}

export default function RentalsManagementPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRentals()
  }, [])

  const fetchRentals = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/rentals")
      const result = await response.json()
      
      if (response.ok) {
        setRentals(result.data || [])
      } else {
        console.error("Error fetching rentals:", result.error)
        alert("렌탈 목록을 가져오는데 실패했습니다.")
      }
    } catch (error) {
      console.error("Error fetching rentals:", error)
      alert("렌탈 목록을 가져오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-2xl font-bold">렌탈/데모 관리</h1>
          </div>
          <Link href="/admin/rentals/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              렌탈/데모 추가
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500">렌탈 목록을 불러오는 중...</p>
            </CardContent>
          </Card>
        ) : !rentals || rentals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">등록된 렌탈/데모 상품이 없습니다</p>
              <Link href="/admin/rentals/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  첫 렌탈/데모 상품 추가
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rentals.map((rental) => (
              <Card key={rental.id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={rental.image_url || "/placeholder.svg"}
                    alt={rental.name}
                    className="w-full h-full object-contain p-4"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      rental.type === "rental" 
                        ? "bg-blue-500 text-white" 
                        : "bg-green-500 text-white"
                    }`}>
                      {rental.type === "rental" ? "렌탈" : "데모"}
                    </span>
                  </div>
                  {!rental.available && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      대여 불가
                    </div>
                  )}
                  {rental.featured && (
                    <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      추천
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{rental.name}</h3>
                    <p className="text-sm text-gray-500">{rental.brands?.name || "브랜드 없음"}</p>
                  </div>
                  <div className="mb-4">
                    {rental.type === "rental" ? (
                      <>
                        <p className="text-lg font-bold">₩{Number(rental.price_monthly || 0).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">/월</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-bold">₩{Number(rental.price_daily || 0).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">/일</p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/rentals/${rental.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="w-4 h-4 mr-1" />
                        수정
                      </Button>
                    </Link>
                    <DeleteRentalButton rentalId={rental.id} rentalName={rental.name} />
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




