import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Phone, Mail, Store, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
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
                  <Label htmlFor="email">이메일</Label>
                  <Input id="email" type="email" placeholder="example@email.com" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="visit-date">희망 방문일 *</Label>
                    <Input id="visit-date" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="visit-time">희망 시간 *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="시간 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10:00">오전 10:00</SelectItem>
                        <SelectItem value="11:00">오전 11:00</SelectItem>
                        <SelectItem value="14:00">오후 2:00</SelectItem>
                        <SelectItem value="15:00">오후 3:00</SelectItem>
                        <SelectItem value="16:00">오후 4:00</SelectItem>
                        <SelectItem value="17:00">오후 5:00</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <Label htmlFor="message">추가 요청사항</Label>
                  <Textarea 
                    id="message" 
                    placeholder="특별한 요청사항이나 궁금한 점이 있으시면 적어주세요"
                    rows={4}
                  />
                </div>

                <Button className="w-full" size="lg">
                  예약 신청하기
                </Button>
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
