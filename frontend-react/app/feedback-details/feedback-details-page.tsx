"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, User, Mail, BookOpen, Calendar, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface FeedbackDetail {
  id: string
  studentName: string
  studentEmail: string
  topic: string
  score: number
  createdDate: string
  starRating: number
  comment: string
  suggestions: string
  difficulty: "easy" | "medium" | "hard"
  wouldRecommend: boolean
}

export function FeedbackDetailsPageComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const feedbackId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackDetail | null>(null)

  // Sample feedback detail data
  useEffect(() => {
    // Simulate API call
    const sampleFeedback: FeedbackDetail = {
      id: feedbackId || "fb1",
      studentName: "Nguyễn Văn An",
      studentEmail: "an.nguyen@email.com",
      topic: "BẢNG CHỮ CÁI",
      score: 100,
      createdDate: "13/05/2022",
      starRating: 5,
      comment:
        "Khóa học rất hay và bổ ích. Tôi đã học được rất nhiều kiến thức mới về bảng chữ cái. Giáo viên giảng dạy rất tận tình và dễ hiểu. Các bài tập thực hành cũng rất phong phú và đa dạng.",
      suggestions: "Hy vọng sẽ có thêm nhiều bài tập thực hành hơn nữa. Có thể thêm video minh họa để dễ hiểu hơn.",
      difficulty: "easy",
      wouldRecommend: true,
    }
    setFeedback(sampleFeedback)
  }, [feedbackId])

  const handleGoBack = () => {
    router.back()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`w-6 h-6 ${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300"
      case "medium":
        return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border-orange-300"
      case "hard":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-300"
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "DỄ"
      case "medium":
        return "TRUNG BÌNH"
      case "hard":
        return "KHÓ"
      default:
        return "KHÔNG XÁC ĐỊNH"
    }
  }

  if (!feedback) {
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
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 leading-relaxed">
              CHI TIẾT PHẢN HỒI
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
          </div>

          {/* Feedback Information Summary Card */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
              <h2 className="text-xl font-bold text-gray-700 mb-6 text-center">THÔNG TIN PHẢN HỒI</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-blue-600 mb-2">
                      <User className="w-4 h-4" />
                      TÊN NGƯỜI HỌC:
                    </label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm text-gray-800 font-medium flex items-center group-hover:border-blue-300 transition-all duration-300">
                        {feedback.studentName}
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-blue-600 mb-2">
                      <Mail className="w-4 h-4" />
                      EMAIL:
                    </label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm text-gray-800 font-medium flex items-center group-hover:border-blue-300 transition-all duration-300">
                        {feedback.studentEmail}
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-blue-600 mb-2">
                      <BookOpen className="w-4 h-4" />
                      CHỦ ĐỀ:
                    </label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm text-gray-800 font-medium flex items-center group-hover:border-blue-300 transition-all duration-300">
                        {feedback.topic}
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-sm font-bold text-blue-600 mb-2">SỐ ĐIỂM:</label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm text-gray-800 font-bold text-lg flex items-center group-hover:border-blue-300 transition-all duration-300">
                        {feedback.score}/100
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-blue-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      NGÀY TẠO:
                    </label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm text-gray-800 font-medium flex items-center group-hover:border-blue-300 transition-all duration-300">
                        {feedback.createdDate}
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-blue-600 mb-2">ĐỘ KHÓ:</label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm flex items-center group-hover:border-blue-300 transition-all duration-300">
                        <Badge
                          className={`px-4 py-2 text-sm font-bold border-2 ${getDifficultyColor(feedback.difficulty)}`}
                        >
                          {getDifficultyText(feedback.difficulty)}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Star Rating - Full Width */}
              <div className="mt-6 group">
                <label className="block text-sm font-bold text-blue-600 mb-2">ĐÁNH GIÁ:</label>
                <div className="relative">
                  <div className="w-full h-16 px-4 py-3 border-2 border-blue-200/60 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm flex items-center justify-center group-hover:border-blue-300 transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">{renderStars(feedback.starRating)}</div>
                      <span className="text-2xl font-bold text-gray-700 ml-2">{feedback.starRating}/5</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>

            <div className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-10">
              {/* Form Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4 shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-3 leading-relaxed">
                  NỘI DUNG PHẢN HỒI CHI TIẾT
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-3"></div>
              </div>

              <div className="space-y-8">
                {/* Comment */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    NHẬN XÉT:
                  </label>
                  <div className="relative">
                    <div className="w-full min-h-[120px] px-4 py-3 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-800 font-medium flex items-start group-hover:border-blue-300 transition-all duration-300">
                      <p className="leading-relaxed">{feedback.comment}</p>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    GỢI Ý CẢI THIỆN:
                  </label>
                  <div className="relative">
                    <div className="w-full min-h-[100px] px-4 py-3 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-800 font-medium flex items-start group-hover:border-blue-300 transition-all duration-300">
                      <p className="leading-relaxed">{feedback.suggestions}</p>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-3">GIỚI THIỆU CHO NGƯỜI KHÁC:</label>
                  <div className="relative">
                    <div className="w-full h-16 px-4 py-3 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center group-hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        {feedback.wouldRecommend ? (
                          <>
                            <ThumbsUp className="w-6 h-6 text-green-600" />
                            <span className="text-green-600 font-bold text-lg">CÓ, TÔI SẼ GIỚI THIỆU</span>
                          </>
                        ) : (
                          <>
                            <ThumbsDown className="w-6 h-6 text-red-600" />
                            <span className="text-red-600 font-bold text-lg">KHÔNG, TÔI SẼ KHÔNG GIỚI THIỆU</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center mt-12">
                <Button
                  onClick={handleGoBack}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ArrowLeft className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">QUAY LẠI</span>
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

export default FeedbackDetailsPageComponent
