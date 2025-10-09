import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Package, ImageIcon } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function MyPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user's gallery items
  const { data: galleryItems } = await supabase
    .from("gallery")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch user's recycle items
  const { data: recycleItems } = await supabase
    .from("recycle_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">마이 페이지</CardTitle>
                <CardDescription className="mt-2">{profile?.display_name || user.email}</CardDescription>
              </div>
              <Link href="/my-page/profile/edit">
                <Button>프로필 수정</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground">이메일</p>
                <p className="font-medium">{user.email}</p>
              </div>
              {profile?.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">전화번호</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
              )}
              {profile?.address && (
                <div>
                  <p className="text-sm text-muted-foreground">주소</p>
                  <p className="font-medium">{profile.address}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Content Tabs */}
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gallery">
              <ImageIcon className="mr-2 h-4 w-4" />내 갤러리 ({galleryItems.length})
            </TabsTrigger>
            <TabsTrigger value="recycle">
              <Package className="mr-2 h-4 w-4" />내 중고마켓 ({recycleItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">내 갤러리</h2>
              <Link href="/my-page/gallery/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  갤러리 추가
                </Button>
              </Link>
            </div>
            {galleryItems && galleryItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <img
                        src={item.image_url || "/placeholder.svg?height=200&width=300"}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">{item.description}</CardDescription>
                      <div className="mt-4 flex gap-2">
                        <Link href={`/my-page/gallery/${item.id}/edit`} className="flex-1">
                          <Button variant="outline" className="w-full bg-transparent">
                            수정
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">아직 등록한 갤러리가 없습니다.</p>
                  <Link href="/my-page/gallery/new">
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />첫 갤러리 추가하기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recycle" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">내 중고마켓</h2>
              <Link href="/my-page/recycle/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  중고상품 등록
                </Button>
              </Link>
            </div>
            {recycleItems && recycleItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recycleItems.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <img
                        src={item.image_url || "/placeholder.svg?height=200&width=300"}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {item.brand} · {item.condition}
                      </CardDescription>
                      <p className="mt-2 text-xl font-bold">{item.price?.toLocaleString()}원</p>
                      <div className="mt-4 flex gap-2">
                        <Link href={`/my-page/recycle/${item.id}/edit`} className="flex-1">
                          <Button variant="outline" className="w-full bg-transparent">
                            수정
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">아직 등록한 중고상품이 없습니다.</p>
                  <Link href="/my-page/recycle/new">
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />첫 중고상품 등록하기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
