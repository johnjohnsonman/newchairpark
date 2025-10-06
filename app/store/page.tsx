import type { Metadata } from "next"
import StoreClientPage from "./store-client"

const categories = [
  { id: "all", name: "전체", displayName: "전체 체어" },
  { id: "office-chair", name: "Office Chair", displayName: "오피스 체어" },
  { id: "executive-chair", name: "Executive Chair", displayName: "임원용 체어" },
  { id: "lounge-chair", name: "Lounge Chair", displayName: "라운지 체어" },
  { id: "conference-chair", name: "Conference Chair", displayName: "회의용 체어" },
  { id: "dining-chair", name: "Dining Chair", displayName: "다이닝 체어" },
  { id: "design-chair", name: "Design Chair", displayName: "디자인 체어" },
]

export const metadata: Metadata = {
  title: "스토어 | 프리미엄 오피스 가구",
  description:
    "허먼밀러, 스틸케이스 등 세계적인 프리미엄 오피스 체어와 가구를 만나보세요. 인체공학적 디자인과 최고의 품질을 경험하세요.",
  openGraph: {
    title: "체어파크 스토어 | 프리미엄 오피스 가구",
    description: "허먼밀러, 스틸케이스 등 세계적인 프리미엄 오피스 체어와 가구",
  },
}

export default function StorePage() {
  return <StoreClientPage categories={categories} />
}
