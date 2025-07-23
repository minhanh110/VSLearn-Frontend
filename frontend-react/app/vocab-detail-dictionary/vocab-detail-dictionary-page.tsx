"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

interface VocabularyDetail {
  id: string
  name: string
  topic: string
  videoUrl: string
  imageUrl: string
  description: string
  regions: string[]
}

export function VocabDetailDictionaryPageComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vocabId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [vocabulary, setVocabulary] = useState<VocabularyDetail | null>(null)

  // Sample vocabulary data
  useEffect(() => {
    // Simulate API call
    const sampleVocab: VocabularyDetail = {
      id: vocabId || "1",
      name: "BO MẸ",
      topic: "GIA ĐÌNH",
      videoUrl: "/videos/sign-language-demo.mp4",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-t36M7PWPIykaxheON7NJb9yKfAn6lm.png",
      description:
        "Tay phải giống chữ cái ngón tay 'B', lòng bàn tay hướng vào trong, đặt lên các đầu ngón tay vào cằm. Lòng bàn tay hướng sang trái, đầu ngón tay hướng lên trên, đặt vào hai bên miệng.",
      regions: ["TOÀN QUỐC", "MIỀN BẮC", "MIỀN TRUNG", "MIỀN NAM"],
    }
    setVocabulary(sampleVocab)
  }, [vocabId])

  if (!vocabulary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating circles */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-200/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-40 left-16 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-300/25 rounded-full blur-xl animate-bounce"></div>

        {/* Sparkle stars */}
        <div className="absolute top-32 left-1/4 w-6 h-6 text-blue-400 animate-pulse">✨</div>
        <div className="absolute top-48 right-1/4 w-5 h-5 text-cyan-400 animate-bounce">⭐</div>
        <div className="absolute bottom-48 left-1/3 w-4 h-4 text-indigo-400 animate-pulse">💫</div>
        <div className="absolute bottom-36 right-1/3 w-6 h-6 text-blue-400 animate-bounce">✨</div>
      </div>

      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Search Section */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 z-10" />
                  <Input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 h-16 border-3 border-blue-300/60 rounded-2xl bg-white/90 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-gray-700 placeholder:text-gray-400 w-full text-lg"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Vocabulary Detail Container */}
          <div className="relative">
            {/* Glow effect behind container */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>

            <div className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-10 max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 leading-relaxed">
                  {vocabulary.name}
                </h1>
                <span className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl text-lg font-bold shadow-lg">
                  {vocabulary.topic}
                </span>
              </div>

              {/* Video/Image Section */}
              <div className="flex justify-center mb-8">
                <div className="relative w-full max-w-2xl h-80 rounded-2xl overflow-hidden border-4 border-blue-300 bg-gradient-to-br from-blue-900 to-cyan-900 shadow-2xl">
                  <Image
                    src={vocabulary.imageUrl || "/placeholder.svg"}
                    alt="Sign language demonstration"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Region Tags */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {vocabulary.regions.map((region, index) => (
                  <Button
                    key={index}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-100 to-cyan-200 hover:from-cyan-200 hover:to-cyan-300 text-cyan-700 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
                  >
                    {region}
                  </Button>
                ))}
              </div>

              {/* Description Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-2xl blur-lg"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📝</span>
                    </div>
                    CÁCH THỰC HIỆN
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg font-medium">{vocabulary.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default VocabDetailDictionaryPageComponent
