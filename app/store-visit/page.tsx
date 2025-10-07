import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Phone, Mail, Store, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { NaverBookingButtonGreen } from "@/components/naver-booking-button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "매장 방문 예약 | 체어파크 - 직접 앉아보고 선택하세요",
  description: "체어파크 매장에서 허먼밀러, 스틸케이스 등 프리미엄 오피스 체어를 직접 체험해보세요. 전문 상담과 맞춤형 솔루션을 제공합니다.",
}

export default function StoreVisitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* 헤더 섹션 */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">매장 방문 예약</h1>
          <p className="text-xl opacity-90 mb-8">직접 앉아보고 선택하는 특별한 경험</p>
          <div className="flex items-center justify-center gap-2 text-lg">
            <Store className="h-6 w-6" />
            <span>체어파크 매장에서만 경험할 수 있는 프리미엄 서비스</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* 예약 폼 */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  방문 예약 신청
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 네이버 예약 안내 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full p-1">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">간편한 네이버 예약</h3>
                      <p className="text-sm text-blue-700">
                        네이버 예약을 통해 원하는 날짜와 시간을 쉽게 예약하실 수 있습니다.
                        예약 시 전화번호만 입력하면 즉시 예약이 완료됩니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <NaverBookingButtonGreen className="w-full">
                    네이버 예약으로 바로 예약하기
                  </NaverBookingButtonGreen>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">또는</span>
                  </div>
                </div>

                {/* 대안 연락 방법 */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">직접 연락하기</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      네이버 예약이 어려우시거나 특별한 요청사항이 있으시면 직접 연락해주세요.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">이름 *</Label>
                      <Input id="name" placeholder="홍길동" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">연락처 *</Label>
                      <Input id="phone" placeholder="010-1234-5678" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="interest">관심 제품</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="관심 있는 제품을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="herman-miller">허먼밀러 (Herman Miller)</SelectItem>
                        <SelectItem value="steelcase">스틸케이스 (Steelcase)</SelectItem>
                        <SelectItem value="knoll">놀 (Knoll)</SelectItem>
                        <SelectItem value="vitra">비트라 (Vitra)</SelectItem>
                        <SelectItem value="all">전체 제품</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="purpose">방문 목적</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="방문 목적을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="purchase">구매 예정</SelectItem>
                        <SelectItem value="consultation">상담 및 체험</SelectItem>
                        <SelectItem value="rental">렌탈 문의</SelectItem>
                        <SelectItem value="repair">수리 문의</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">요청사항</Label>
                    <Textarea 
                      id="message" 
                      placeholder="희망 방문일, 시간, 특별한 요청사항 등을 적어주세요"
                      rows={4}
                    />
                  </div>

                  <Button className="w-full" size="lg" variant="outline">
                    전화 상담 요청하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 매장 정보 및 혜택 */}
          <div className="space-y-6">
            {/* 매장 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  매장 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-500 mt-1" />
                  <div>
                    <p className="font-medium">체어파크 본점</p>
                    <p className="text-sm text-slate-600">서울시 강남구 테헤란로 123</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      asChild
                    >
                      <a 
                        href="http://map.naver.com/p/search/%EC%B2%B4%EC%96%B4%ED%8C%8C%ED%81%AC/place/2029627196" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        네이버 지도에서 보기
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-slate-500 mt-1" />
                  <div>
                    <p className="font-medium">운영시간</p>
                    <p className="text-sm text-slate-600">평일: 10:00 - 19:00</p>
                    <p className="text-sm text-slate-600">토요일: 10:00 - 18:00</p>
                    <p className="text-sm text-slate-600">일요일: 휴무</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-slate-500 mt-1" />
                  <div>
                    <p className="font-medium">전화 문의</p>
                    <p className="text-sm text-slate-600">02-1234-5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-slate-500 mt-1" />
                  <div>
                    <p className="font-medium">네이버 예약</p>
                    <p className="text-sm text-slate-600">온라인 예약 시스템 운영</p>
                    <NaverBookingButtonGreen size="sm" className="mt-2">
                      네이버 예약하기
                    </NaverBookingButtonGreen>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 매장 방문 혜택 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  매장 방문 혜택
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">실제 체험</p>
                      <p className="text-sm text-slate-600">모든 제품을 직접 앉아보고 비교해보세요</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">전문 상담</p>
                      <p className="text-sm text-slate-600">인체공학 전문가의 맞춤형 솔루션</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">특별 할인</p>
                      <p className="text-sm text-slate-600">매장 방문 고객 전용 특가 혜택</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">당일 배송</p>
                      <p className="text-sm text-slate-600">재고 있는 제품은 당일 배송 가능</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 연락처 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  빠른 문의
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="tel:02-1234-5678">
                      <Phone className="h-4 w-4 mr-2" />
                      전화 상담: 02-1234-5678
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="mailto:info@chairpark.co.kr">
                      <Mail className="h-4 w-4 mr-2" />
                      이메일 문의
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/bulk-inquiry">
                      <Users className="h-4 w-4 mr-2" />
                      온라인 문의하기
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
