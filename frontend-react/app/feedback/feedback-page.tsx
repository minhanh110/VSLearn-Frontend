"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import Image from "next/image"

export function FeedbackPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ratingLabels = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Xuất sắc"]

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

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Show success message and redirect
    alert("Cảm ơn bạn đã gửi phản hồi!")
    router.push("/homepage")
  }

  const handleGoBack = () => {
    router.back()
  }

  const displayRating = hoverRating || rating

  return (
    <div className="min-h-screen bg-blue-100 relative overflow-hidden">
      {/* Background decorative image */}
      <div className="absolute inset-0 z-0">
        <Image src="/placeholder.svg?height=800&width=1200" alt="Feedback background" fill className="object-cover" />
      </div>

      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Feedback Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-blue-200 p-6">
            {/* Title */}
            <h1 className="text-xl font-bold text-gray-800 text-center mb-2">Cảm nhận của bạn thế nào?</h1>

            {/* Subtitle */}
            <p className="text-sm text-gray-600 text-center mb-6">
              Hãy cho chúng tôi biết trải nghiệm học tập của bạn hôm nay
            </p>

            {/* Enhanced Rating Section */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3 text-center">Đánh giá bài học này:</p>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-3">
                {[0, 1, 2, 3, 4].map((index) => (
                  <button
                    key={index}
                    onClick={() => handleStarClick(index)}
                    onMouseEnter={() => handleStarHover(index)}
                    onMouseLeave={handleStarLeave}
                    className="p-1 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded"
                  >
                    <Star
                      size={32}
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
                  <p className="text-sm font-medium text-blue-600 animate-fade-in">
                    {ratingLabels[displayRating - 1]} ({displayRating}/5 sao)
                  </p>
                )}
                {displayRating === 0 && <p className="text-sm text-gray-400">Nhấn vào sao để đánh giá</p>}
              </div>

              {/* Selected Rating Indicator */}
              {rating > 0 && (
                <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 text-center">
                    ✓ Bạn đã chọn {rating} sao - {ratingLabels[rating - 1]}
                  </p>
                </div>
              )}
            </div>

            {/* Feedback Text Area */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Góp ý thêm (tùy chọn):</p>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về bài học..."
                className="w-full h-24 p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-colors"
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{feedback.length}/500 ký tự</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleGoBack}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                QUAY LẠI
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                className={`flex-1 font-bold py-3 px-4 rounded-lg transition-colors ${
                  rating > 0
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? "ĐANG GỬI..." : "GỬI PHẢN HỒI"}
              </Button>
            </div>

            {/* Validation Message */}
            {rating === 0 && (
              <p className="text-xs text-red-500 text-center mt-2">* Vui lòng chọn số sao để đánh giá trước khi gửi</p>
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

export default FeedbackPage
