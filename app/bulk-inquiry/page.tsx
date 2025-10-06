import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Building2, Users, Award, TrendingUp } from "lucide-react"

export default function BulkInquiryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">특판가 문의</h1>
            <p className="text-xl mb-8 opacity-90">
              체어파크는 2001년부터 1만건 이상의 B2B 고객에게 프리미엄 오피스 가구를 납품해왔습니다
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="rounded-full bg-white/10 p-3">
                    <Building2 className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">23년</div>
                <div className="text-sm opacity-80">업계 경력</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="rounded-full bg-white/10 p-3">
                    <Users className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">10,000+</div>
                <div className="text-sm opacity-80">B2B 납품 실적</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="rounded-full bg-white/10 p-3">
                    <Award className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm opacity-80">정품 보증</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="rounded-full bg-white/10 p-3">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">최대 30%</div>
                <div className="text-sm opacity-80">특판 할인</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">견적 문의하기</CardTitle>
                <CardDescription>아래 정보를 입력해주시면 담당자가 24시간 내에 연락드립니다</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  {/* Customer Type */}
                  <div className="space-y-3">
                    <Label>고객 유형 *</Label>
                    <RadioGroup defaultValue="company" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="company" id="company" />
                        <Label htmlFor="company" className="font-normal cursor-pointer">
                          기업
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual" className="font-normal cursor-pointer">
                          개인
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Contact Info */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">이름 *</Label>
                      <Input id="name" placeholder="홍길동" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">회사명</Label>
                      <Input id="company" placeholder="(주)체어파크" />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">이메일 *</Label>
                      <Input id="email" type="email" placeholder="example@company.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">연락처 *</Label>
                      <Input id="phone" type="tel" placeholder="010-1234-5678" required />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <Label htmlFor="brand">관심 브랜드 *</Label>
                    <Select>
                      <SelectTrigger id="brand">
                        <SelectValue placeholder="브랜드를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="herman-miller">Herman Miller</SelectItem>
                        <SelectItem value="steelcase">Steelcase</SelectItem>
                        <SelectItem value="knoll">Knoll</SelectItem>
                        <SelectItem value="humanscale">Humanscale</SelectItem>
                        <SelectItem value="okamura">Okamura</SelectItem>
                        <SelectItem value="fursys">Fursys</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product">제품명</Label>
                    <Input id="product" placeholder="예: Aeron Chair, Gesture Chair" />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">수량 *</Label>
                      <Input id="quantity" type="number" min="1" placeholder="10" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">지역 *</Label>
                      <Select>
                        <SelectTrigger id="region">
                          <SelectValue placeholder="지역을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="seoul">서울</SelectItem>
                          <SelectItem value="gyeonggi">경기</SelectItem>
                          <SelectItem value="incheon">인천</SelectItem>
                          <SelectItem value="busan">부산</SelectItem>
                          <SelectItem value="daegu">대구</SelectItem>
                          <SelectItem value="gwangju">광주</SelectItem>
                          <SelectItem value="daejeon">대전</SelectItem>
                          <SelectItem value="ulsan">울산</SelectItem>
                          <SelectItem value="sejong">세종</SelectItem>
                          <SelectItem value="other">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delivery">희망 납기</Label>
                    <Input id="delivery" type="date" />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">문의 내용</Label>
                    <Textarea
                      id="message"
                      placeholder="추가로 문의하실 내용이나 요청사항을 자유롭게 작성해주세요"
                      rows={6}
                    />
                  </div>

                  {/* Privacy Agreement */}
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" id="privacy" className="mt-1" required />
                    <Label htmlFor="privacy" className="text-sm font-normal leading-relaxed cursor-pointer">
                      개인정보 수집 및 이용에 동의합니다. 수집된 정보는 견적 문의 응대 목적으로만 사용되며, 목적 달성 후
                      즉시 파기됩니다.
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" size="lg" className="w-full">
                    견적 문의하기
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">전화 문의</h3>
                  <p className="text-sm text-muted-foreground mb-2">평일 09:00 - 18:00</p>
                  <p className="text-lg font-semibold text-primary">02-532-1113</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">이메일 문의</h3>
                  <p className="text-sm text-muted-foreground mb-2">24시간 접수 가능</p>
                  <p className="text-lg font-semibold text-primary">hello@chairpark.com</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
