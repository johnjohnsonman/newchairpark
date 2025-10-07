"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar, Clock, Building2, User, Phone, Package, MessageSquare, Send } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

export default function RentalPage() {
  const [serviceType, setServiceType] = useState<"rental" | "demo">("rental")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    product: "",
    quantity: "",
    preferredDate: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 폼 제출 로직
    console.log("폼 제출:", { serviceType, selectedDate, formData })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const productOptions = [
    "허먼밀러 에어론 체어",
    "스틸케이스 제스처 체어", 
    "스틸케이스 립 체어",
    "허먼밀러 엠바디 체어",
    "스탠딩 데스크",
    "회의용 테이블",
    "기타 (메시지에 기재)",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            렌탈/데모 신청
          </h1>
          <p className="text-lg text-slate-600">
            프리미엄 가구를 부담없이 체험하고 렌탈해보세요
          </p>
        </div>

        {/* 서비스 타입 선택 */}
        <Card className="mb-8 border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">서비스 선택</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-3">
                <Switch
                  checked={serviceType === "rental"}
                  onCheckedChange={(checked) => setServiceType(checked ? "rental" : "demo")}
                />
                <div className="text-center">
                  <div className={`text-lg font-semibold ${serviceType === "rental" ? "text-slate-900" : "text-slate-400"}`}>
                    렌탈
                  </div>
                  <div className="text-sm text-slate-500">장기 이용</div>
                </div>
              </div>
              
              <div className="w-px h-12 bg-slate-200"></div>
              
              <div className="flex items-center gap-3">
                <Switch
                  checked={serviceType === "demo"}
                  onCheckedChange={(checked) => setServiceType(checked ? "demo" : "rental")}
                />
                <div className="text-center">
                  <div className={`text-lg font-semibold ${serviceType === "demo" ? "text-slate-900" : "text-slate-400"}`}>
                    데모
                  </div>
                  <div className="text-sm text-slate-500">단기 체험</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 신청 폼 */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              {serviceType === "rental" ? "렌탈" : "데모"} 신청서
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 개인 정보 */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    이름 *
                  </Label>
                  <Input
                    id="name"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    회사명
                  </Label>
                  <Input
                    id="company"
                    placeholder="(주)체어파크"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    연락처 *
                  </Label>
                  <Input
                    id="phone"
                    placeholder="010-1234-5678"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>

              {/* 제품 정보 */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="product" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    원하는 제품 *
                  </Label>
                  <Select value={formData.product} onValueChange={(value) => handleInputChange("product", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="제품을 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {productOptions.map((product) => (
                        <SelectItem key={product} value={product}>
                          {product}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    수량 *
                  </Label>
                  <Input
                    id="quantity"
                    placeholder="1"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* 희망 날짜 */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  희망 {serviceType === "rental" ? "시작" : "체험"} 날짜 *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: ko }) : "날짜를 선택해주세요"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      locale={ko}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* 추가 메시지 */}
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  추가 요청사항
                </Label>
                <Textarea
                  id="message"
                  placeholder="특별한 요청사항이나 문의사항이 있으시면 자유롭게 작성해주세요..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows={4}
                />
              </div>

              {/* 제출 버튼 */}
              <div className="pt-6">
                <Button type="submit" className="w-full bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white py-6 text-lg font-semibold">
                  <Send className="mr-2 h-5 w-5" />
                  {serviceType === "rental" ? "렌탈" : "데모"} 신청하기
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 안내사항 */}
        <Card className="mt-8 border-0 bg-slate-50">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-slate-500 mt-1" />
                <div>
                  <p className="font-medium">처리 시간</p>
                  <p className="text-sm text-slate-600">신청 후 24시간 이내 연락드립니다</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-slate-500 mt-1" />
                <div>
                  <p className="font-medium">배송 및 설치</p>
                  <p className="text-sm text-slate-600">전국 무료 배송 및 설치 서비스</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
