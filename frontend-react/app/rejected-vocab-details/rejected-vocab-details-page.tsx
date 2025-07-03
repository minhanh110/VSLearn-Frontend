"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Edit, RotateCcw, AlertTriangle, XCircle, Calendar, User, FileText, Globe } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

interface RejectedVocabDetail {
  id: string
  name: string
  topic: string
  region: string
  description: string
  videoLink: string
  imageUrl: string
  status: "rejected"
  rejectionReason: string
  rejectedDate: string
  rejectedBy: string
  creator: string
  createdDate: string
  submissionCount: number
}

export function RejectedVocabDetailsPageComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vocabId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [vocabulary, setVocabulary] = useState<RejectedVocabDetail | null>(null)

  // Sample rejected vocabulary data
  useEffect(() => {
    // Simulate API call
    const sampleVocab: RejectedVocabDetail = {
      id: vocabId || "#20462",
      name: "QUẢ TÁO",
      topic: "THIÊN NHIÊN",
      region: "TOÀN QUỐC",
      description:
        "Tay phải xòa ngón, các ngón tay hơi tập vào đầu tay trước tâm bàn ngực phải, sau đó xòa tay sang trái tạp lên và trở lại vị trí xuống một cái.",
      videoLink: "https://example.com/video.mp4",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-t36M7PWPIykaxheON7NJb9yKfAn6lm.png",
      status: "rejected",
      rejectionReason:
        "Video không rõ ràng, cần quay lại với chất lượng tốt hơn. Mô tả thiếu chi tiết về cách thực hiện động tác. Cần bổ sung thêm hướng dẫn cụ thể cho người học.",
      rejectedDate: "15/06/2022",
      rejectedBy: "Nguyễn Thị Duyệt",
      creator: "Trần Văn A",
      createdDate: "10/06/2022",
      submissionCount: 2,
    }
    setVocabulary(sampleVocab)
  }, [vocabId])

  const handleGoBack = () => {
    router.back()
  }

  const handleEdit = () => {
    router.push(`/vocab-edit?id=${vocabId}`)
  }

  const handleResubmit = () => {
    // Handle resubmit logic
    console.log("Resubmit vocabulary:", vocabId)
    alert("Từ vựng đã được gửi lại để xem xét!")
  }

  if (!vocabulary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-red-700 font-medium">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-100 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating circles with red/pink theme */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-pink-200/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-40 left-16 w-40 h-40 bg-orange-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-red-300/25 rounded-full blur-xl animate-bounce"></div>

        {/* Warning symbols */}
        <div className="absolute top-32 left-1/4 w-6 h-6 text-red-400 animate-pulse">⚠️</div>
        <div className="absolute top-48 right-1/4 w-5 h-5 text-pink-400 animate-bounce">❌</div>
        <div className="absolute bottom-48 left-1/3 w-4 h-4 text-orange-400 animate-pulse">⚠️</div>
        <div className="absolute bottom-36 right-1/3 w-6 h-6 text-red-400 animate-bounce">❌</div>
      </div>

      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4 shadow-2xl">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-700 to-pink-700 bg-clip-text text-transparent mb-4 leading-relaxed">
              TỪ VỰNG BỊ TỪ CHỐI
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto"></div>
          </div>

          {/* Rejection Alert */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-red-100/95 to-pink-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-red-200/50 p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center gap-3">
                    <span>LÝ DO TỪ CHỐI</span>
                    <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                      Lần {vocabulary.submissionCount}
                    </span>
                  </h3>
                  <p className="text-red-700 leading-relaxed text-lg font-medium mb-4">{vocabulary.rejectionReason}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-red-600">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Ngày từ chối: {vocabulary.rejectedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-600">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Người duyệt: {vocabulary.rejectedBy}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vocabulary Details Container */}
          <div className="relative">
            {/* Glow effect behind form */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-3xl blur-xl"></div>

            <div className="relative bg-gradient-to-br from-orange-100/95 to-red-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-10 max-w-4xl mx-auto">
              {/* Form Header with icon */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent mb-3 leading-relaxed">
                  {vocabulary.name}
                </h2>
                <p className="text-gray-600 text-sm font-medium mb-2">CHI TIẾT TỪ VỰNG BỊ TỪ CHỐI</p>
                <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mt-3"></div>
              </div>

              {/* Creator Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <User className="w-4 h-4 text-orange-500" />
                    NGƯỜI TẠO
                  </label>
                  <div className="relative">
                    <div className="w-full h-14 px-4 border-2 border-orange-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium flex items-center">
                      {vocabulary.creator}
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/5 to-red-500/5 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    NGÀY TẠO
                  </label>
                  <div className="relative">
                    <div className="w-full h-14 px-4 border-2 border-orange-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium flex items-center">
                      {vocabulary.createdDate}
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/5 to-red-500/5 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Topic */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <FileText className="w-4 h-4 text-orange-500" />
                      CHỦ ĐỀ
                    </label>
                    <div className="relative">
                      <Select value={vocabulary.topic.toLowerCase().replace(" ", "-")} disabled>
                        <SelectTrigger className="w-full h-14 px-4 border-2 border-orange-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thiên-nhiên">THIÊN NHIÊN</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/5 to-red-500/5 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Region */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <Globe className="w-4 h-4 text-orange-500" />
                      KHU VỰC
                    </label>
                    <div className="relative">
                      <Select value={vocabulary.region.toLowerCase().replace(" ", "-")} disabled>
                        <SelectTrigger className="w-full h-14 px-4 border-2 border-orange-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="toàn-quốc">TOÀN QUỐC</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/5 to-red-500/5 pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Video/Image Preview */}
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3">HÌNH ẢNH/VIDEO</label>
                    <div className="relative">
                      <div className="w-full h-48 rounded-2xl overflow-hidden border-2 border-orange-300 bg-gradient-to-br from-orange-900 to-red-900 shadow-xl">
                        <Image
                          src={vocabulary.imageUrl || "/placeholder.svg"}
                          alt="Sign language demonstration"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="group mb-8">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <FileText className="w-4 h-4 text-orange-500" />
                  MÔ TẢ
                </label>
                <div className="relative">
                  <div className="w-full min-h-32 p-4 border-2 border-orange-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium leading-relaxed">
                    {vocabulary.description}
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/5 to-red-500/5 pointer-events-none"></div>
                </div>
              </div>

              {/* Video Link */}
              <div className="group mb-8">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <FileText className="w-4 h-4 text-orange-500" />
                  LINK VIDEO
                </label>
                <div className="relative">
                  <div className="w-full h-14 px-4 border-2 border-orange-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium flex items-center">
                    {vocabulary.videoLink || "Chưa có video"}
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/5 to-red-500/5 pointer-events-none"></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-6 justify-center">
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
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Edit className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">CHỈNH SỬA</span>
                </Button>

                <Button
                  onClick={handleResubmit}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <RotateCcw className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">GỬI LẠI</span>
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

export default RejectedVocabDetailsPageComponent
