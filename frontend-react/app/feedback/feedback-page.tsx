"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react" // Sử dụng lucide-react cho Star
import Image from "next/image"
import { FeedbackService, type FeedbackRequest } from "@/app/services/feedback.service"
import authService from "@/app/services/auth.service"
import { jwtDecode } from "jwt-decode"

const ratingLabels = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Xuất sắc"]

export default function FeedbackPage() {
  // Changed to default export
  const router = useRouter()
  const searchParams = useSearchParams()
  const topicId = searchParams.get("topicId")

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId, setUserId] = useState<string>("1")

  const fromTestResult = searchParams.get("fromTestResult") === "1"

  // Get user ID from JWT token
  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const token = authService.getCurrentToken()
        if (token) {
          const decoded = jwtDecode(token) as any
          if (decoded && decoded.id) {
            setUserId(decoded.id.toString())
            console.log("Current user ID from token:", decoded.id)
          } else {
            console.log("No user ID in token, using default ID: 1")
          }
        } else {
          console.log("No token found, using default ID: 1")
        }
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }

    getCurrentUserId()
  }, [])

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1)
  }

  const handleStarHover = (starIndex: number) => {
    setHoverRating(starIndex + 1)
  }

  const handleStarLeave = () => {
    setHoverRating(0)
  }

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá!")
      return
    }

    if (!topicId) {
      alert("Thiếu thông tin topic!")
      return
    }

    setIsSubmitting(true)

    try {
      const request: FeedbackRequest = {
        topicId: Number.parseInt(topicId),
        rating: rating,
        feedbackContent: feedback || undefined,
      }

      const response = await FeedbackService.submitFeedback(request, Number.parseInt(userId))

      // Show success message and redirect
      alert("Cảm ơn bạn đã gửi phản hồi!")
      if (fromTestResult) {
        router.push("/test-result")
      } else {
        router.push("/homepage")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    if (fromTestResult) {
      router.push("/test-result")
    } else {
      router.back()
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden">
      {/* Decorative Stars Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-8 h-8 text-yellow-300 animate-pulse">⭐</div>
        <div className="absolute top-32 right-24 w-6 h-6 text-blue-300 animate-bounce">⭐</div>
        <div className="absolute top-40 left-1/4 w-5 h-5 text-green-300 animate-pulse">⭐</div>
        <div className="absolute top-60 right-1/3 w-7 h-7 text-purple-300 animate-bounce">⭐</div>
        <div className="absolute bottom-40 left-16 w-6 h-6 text-pink-300 animate-pulse">⭐</div>
        <div className="absolute bottom-32 right-20 w-8 h-8 text-yellow-300 animate-bounce">⭐</div>
      </div>

      {/* Animated Study Mascot */}
      <div className="absolute bottom-20 left-4 lg:bottom-12 lg:left-8 animate-bounce z-20">
        <Image
          src="/images/study-mascot-new.png"
          alt="Study mascot"
          width={80}
          height={80}
          className="object-contain lg:w-36 lg:h-36 opacity-75 hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Feedback Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-blue-300 p-6 sm:p-8">
            {/* Title */}
            <h1 className="text-2xl font-bold text-blue-800 text-center mb-3">Cảm nhận của bạn thế nào?</h1>

            {/* Subtitle */}
            <p className="text-base text-blue-600 text-center mb-6">
              Hãy cho chúng tôi biết trải nghiệm học tập của bạn hôm nay
            </p>

            {/* Enhanced Rating Section */}
            <div className="mb-6">
              <p className="text-base font-semibold text-blue-700 mb-3 text-center">Đánh giá bài học này:</p>

              {/* Stars */}
              <div className="flex justify-center gap-2 mb-3">
                {[0, 1, 2, 3, 4].map((index) => (
                  <button
                    key={index}
                    onClick={() => handleStarClick(index)}
                    onMouseEnter={() => handleStarHover(index)}
                    onMouseLeave={handleStarLeave}
                    className="p-1 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-full"
                  >
                    <Star
                      size={40} // Tăng kích thước sao
                      className={`transition-colors duration-200 ${
                        index < displayRating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 hover:text-yellow-200"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Rating Label */}
              <div className="text-center">
                {displayRating > 0 && (
                  <p className="text-base font-semibold text-blue-700 animate-fade-in">
                    {ratingLabels[displayRating - 1]} ({displayRating}/5 sao)
                  </p>
                )}
                {displayRating === 0 && <p className="text-base text-gray-500">Nhấn vào sao để đánh giá</p>}
              </div>

              {/* Selected Rating Indicator */}
              {rating > 0 && (
                <div className="mt-4 p-3 bg-blue-100 rounded-xl border border-blue-300">
                  <p className="text-sm text-blue-800 text-center font-medium">
                    ✓ Bạn đã chọn {rating} sao - {ratingLabels[rating - 1]}
                  </p>
                </div>
              )}
            </div>

            {/* Feedback Text Area */}
            <div className="mb-6">
              <p className="text-base font-semibold text-blue-700 mb-3">Góp ý thêm (tùy chọn):</p>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về bài học..."
                className="w-full h-28 p-4 border-2 border-blue-300 rounded-xl bg-blue-50 text-blue-800 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-base"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">{feedback.length}/500 ký tự</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleGoBack}
                className="flex-1 bg-gradient-to-r from-blue-300 to-cyan-300 hover:from-blue-400 hover:to-cyan-400 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-base"
                disabled={isSubmitting}
              >
                QUAY LẠI
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                className={`flex-1 font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-base ${
                  rating > 0
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? "ĐANG GỬI..." : "GỬI PHẢN HỒI"}
              </Button>
            </div>

            {/* Validation Message */}
            {rating === 0 && (
              <p className="text-sm text-red-500 text-center mt-3 font-medium">
                * Vui lòng chọn số sao để đánh giá trước khi gửi
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
