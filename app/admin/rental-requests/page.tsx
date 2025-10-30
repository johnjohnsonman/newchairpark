"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Phone, Mail, Package, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import type { RentalRequest } from "@/types/rental"

export default function AdminRentalRequestsPage() {
  const [requests, setRequests] = useState<RentalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/rental-requests")
      const result = await response.json()
      
      if (response.ok) {
        setRequests(result.data || [])
      } else {
        console.error("Error fetching requests:", result.error)
        alert("요청 목록을 가져오는데 실패했습니다.")
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
      alert("요청 목록을 가져오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/rental-requests/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()

      if (response.ok) {
        alert(result.message || "상태가 업데이트되었습니다.")
        fetchRequests()
      } else {
        alert(result.error || "상태 업데이트 중 오류가 발생했습니다.")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("상태 업데이트 중 오류가 발생했습니다.")
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "대기중", variant: "outline" },
      approved: { label: "승인됨", variant: "default" },
      rejected: { label: "거절됨", variant: "destructive" },
      completed: { label: "완료됨", variant: "secondary" },
    }
    const config = variants[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">렌탈/데모 신청 관리</h1>
          <p className="text-muted-foreground">고객의 렌탈 및 데모 신청을 관리합니다</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">신청 내역이 없습니다.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {request.service_type === "rental" ? "🔄 렌탈" : "🎯 데모"} 신청
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      신청일: {format(new Date(request.created_at), "PPP p", { locale: ko })}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{request.name}</span>
                      {request.company && <span className="text-muted-foreground">({request.company})</span>}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{request.phone}</span>
                    </div>
                    {request.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{request.email}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>수량: {request.quantity}개</span>
                    </div>
                    {request.rental_period && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>렌탈 기간: {request.rental_period}</span>
                      </div>
                    )}
                    {request.preferred_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          희망 날짜: {format(new Date(request.preferred_date), "PPP", { locale: ko })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {request.message && (
                  <div className="rounded-md bg-muted p-4">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">추가 요청사항</p>
                        <p className="text-sm text-muted-foreground">{request.message}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  {request.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => updateStatus(request.id, "approved")}>
                        승인
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(request.id, "rejected")}
                      >
                        거절
                      </Button>
                    </>
                  )}
                  {request.status === "approved" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(request.id, "completed")}>
                      완료 처리
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}




