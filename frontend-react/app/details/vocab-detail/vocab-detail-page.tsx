"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Edit, Ban, BookOpen } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface VocabularyDetail {
  id: string
  name: string
  topic: string
  region: string
  description: string
  videoLink: string
  status: "active" | "disabled"
}

export function VocabDetailPageComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vocabId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [vocabulary, setVocabulary] = useState<VocabularyDetail | null>(null)

  // Sample vocabulary data
  useEffect(() => {
    // Simulate API call
    const sampleVocab: VocabularyDetail = {
      id: vocabId || "1",
      name: "QUẢ TÁO",
      topic: "THIÊN NHIÊN",
      region: "TOÀN QUỐC",
      description:
        "Tay phải xòa ngón, các ngón tay hơi tập vào đầu tay trước tâm bàn ngực phải, sau đó xòa tay sang trái tạp lên và trở lại vị trí xuống một cái.",
      videoLink: "https://example.com/video.mp4",
      status: "active",
    }
    setVocabulary(sampleVocab)
  }, [vocabId])

  const handleGoBack = () => {
    router.back()
  }

  const handleEdit = () => {
    router.push(`/vocab-edit?id=${vocabId}`)
  }

  const handleDisable = () => {
    // Handle disable vocabulary
    console.log("Disable vocabulary:", vocabId)
  }

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
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-2">
              CHI TIẾT TỪ VỰNG: {vocabulary.name}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
          </div>

          {/* Detail Container */}
          <div className="relative">
            {/* Glow effect behind form */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>

            <div className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-10 max-w-4xl mx-auto">
              {/* Form Header with icon */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-2">
                  {vocabulary.name}
                </h2>
                <p className="text-gray-600 text-sm font-medium">CHI TIẾT TỪ VỰNG</p>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-3"></div>
              </div>

              {/* Form Fields */}
              <div className="space-y-8">
                {/* Topic */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-3">CHỦ ĐỀ:</label>
                  <div className="relative">
                    <Select value={vocabulary.topic.toLowerCase().replace(" ", "-")} disabled>
                      <SelectTrigger className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thiên-nhiên">THIÊN NHIÊN</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
                  </div>
                </div>

                {/* Region */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-3">KHU VỰC:</label>
                  <div className="relative">
                    <Select value={vocabulary.region.toLowerCase().replace(" ", "-")} disabled>
                      <SelectTrigger className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="toàn-quốc">TOÀN QUỐC</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
                  </div>
                </div>

                {/* Description */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-3">MÔ TẢ:</label>
                  <div className="relative">
                    <div className="w-full min-h-32 p-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium leading-relaxed">
                      {vocabulary.description}
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
                  </div>
                </div>

                {/* Video Link */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-3">LINK VIDEO:</label>
                  <div className="relative">
                    <div className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium flex items-center">
                      {vocabulary.videoLink || "Chưa có video"}
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-6 mt-12 justify-center">
                <Button
                  onClick={handleGoBack}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ArrowLeft className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">QUAY LẠI</span>
                </Button>

                <Button
                  onClick={handleEdit}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Edit className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">CHỈNH SỬA</span>
                </Button>

                <Button
                  onClick={handleDisable}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Ban className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">VÔ HIỆU HÓA</span>
                </Button>
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

export default VocabDetailPageComponent
