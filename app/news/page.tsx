import Link from "next/link"
import { ExternalLink, Calendar, Tag } from "lucide-react"

export default function NewsPage() {
  const newsItems = [
    {
      title: "Osuu chair blends sculptural elegance with precision craftsmanship",
      source: "interiordaily",
      date: "2025.08.28",
      category: "Design"
    },
    {
      title: "HNI Corporation to Acquire Steelcase Inc.",
      source: "Yahoo Finance",
      date: "2025.08.05",
      category: "Business"
    },
    {
      title: "MillerKnoll opens new design archive showcasing over one million objects from the company's history",
      source: "archpaper",
      date: "2025.06.13",
      category: "Design"
    },
    {
      title: "Herman Miller Latest News Update",
      source: "9meters",
      date: "2025.06.13",
      category: "Brand"
    },
    {
      title: "Okamura Awarded Second Prize at ORGATEC TOKYO Awards 2025",
      source: "Okamura",
      date: "2025.06.09",
      category: "Awards"
    },
    {
      title: "ITOKI to release new task chair \"Act2\" on June 4th",
      source: "ITOKI",
      date: "2025.05.13",
      category: "Product"
    },
    {
      title: "Diffrient lounge chair by Niels Diffrient for Humanscale",
      source: "Dezeen",
      date: "2025.04.04",
      category: "Design"
    },
    {
      title: "Boss Design acquired by Japanese based furniture giant Okamura",
      source: "workplace insight",
      date: "2025.03.25",
      category: "Business"
    },
    {
      title: "고흐의 의자·다이애나의 침대…고단한 하루를 위로하는 시간",
      source: "한국경제",
      date: "2025.02.21",
      category: "Culture"
    },
    {
      title: "Knoll opens New York flagship showroom on Park Avenue",
      source: "dezeen",
      date: "2025.02.15",
      category: "Retail"
    },
    {
      title: "Industrial Facility가 디자인한 Herman Miller의 OE1 Sit-to-Stand 테이블이 Archiproducts Design Award 수상",
      source: "MillerKnoll",
      date: "2025.01.24",
      category: "Awards"
    },
    {
      title: "Humanscale, B Corporation 인증 획득",
      source: "Humanscale",
      date: "2024.12.30",
      category: "Sustainability"
    },
    {
      title: "Knoll presents Willo Perron sofa at Salone del Mobile 2024, 'a piece that can stay with you forever'",
      source: "Wallpaper",
      date: "2024.12.19",
      category: "Design"
    },
    {
      title: "First Look: 'It's a chair that smiles at you,' says designer Bruce Hannah",
      source: "Wall Paper",
      date: "2024.11.10",
      category: "Design"
    },
    {
      title: "Tottenham Hotspur forge new partnership with FURSYS GROUP",
      source: "SportsMint Media",
      date: "2024.11.02",
      category: "Partnership"
    },
    {
      title: "에르고노믹스에서 탄생한 컨셉 \"낮은 자리·후경\"",
      source: "Okamura Corp.",
      date: "2024.10.24",
      category: "Ergonomics"
    },
    {
      title: "Six Top Trends in Healthcare Design",
      source: "Steelcase",
      date: "2024.10.09",
      category: "Healthcare"
    },
    {
      title: "구글·애플 사무실서 쓴다, 과학을 담은 쾌적한 의자",
      source: "중앙일보",
      date: "2024.10.03",
      category: "Technology"
    },
    {
      title: "Knoll and photographer Adam Jason Cohen put a contemporary lens on Bauhaus design",
      source: "knoll",
      date: "2024.09.19",
      category: "Design"
    },
    {
      title: "\"이제 이거 없으면 일 못하겠어요\"…삼성도 400억 쏜다",
      source: "김채연기자",
      date: "2024.09.06",
      category: "Business"
    }
  ]

  const categories = ["All", "Design", "Business", "Product", "Awards", "Brand", "Culture", "Retail", "Sustainability", "Partnership", "Ergonomics", "Healthcare", "Technology"]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">NEWS</h1>
            <p className="text-lg text-gray-600">
              오피스 가구 업계의 최신 소식과 트렌드를 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* News List */}
          <div className="space-y-8">
            {newsItems.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-relaxed">
                      {item.title}
                    </h2>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        <span className="font-medium">{item.source}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{item.date}</span>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <ExternalLink className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              더 많은 소식 보기
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 border-t">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">체어파크 고객센터</h3>
                <p className="text-gray-600 mb-2">02 532 1113</p>
                <p className="text-sm text-gray-500">
                  상호: 체어파크 | 대표: John Park<br />
                  사업자등록번호: 662-27-00450<br />
                  통신판매업번호: 2018-성남분당-0890
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">SHOWROOM</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>한남점:</strong> 서울시 용산구 한남대로 55 2층</p>
                  <p>평일: 10:00-19:00 | 주말: 10:00-18:00 | 전화: 02-532-1113</p>
                  <p className="mt-4"><strong>강남점:</strong> 서울시 강남구 역삼로 461 LS1빌딩 1층</p>
                  <p>평일: 10:00-19:00 | 주말,공휴일: 12:00-18:00 | 전화: 0507-1372-3275</p>
                  <p className="mt-4"><strong>일산점:</strong> 고양시 일산동구 중앙로1347 쌍용플래티넘 109호</p>
                  <p>평일: 10:00-19:00 | 주말,공휴일: 12:00-18:00</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Copyrightⓒ Chairpark.com All right reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
