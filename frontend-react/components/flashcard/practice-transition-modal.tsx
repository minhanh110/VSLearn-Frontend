"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, X, Play } from "lucide-react" // Import icons for buttons
import Image from "next/image"

interface PracticeTransitionModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  onReview: () => void
  practiceCardCount: number // Số câu hỏi luyện tập sắp tới
  completedCardCount: number // Số từ đã học (từ flashcard)
  currentGroupSize: number // Kích thước nhóm hiện tại
}

export function PracticeTransitionModal({
  isOpen,
  onClose,
  onContinue,
  onReview,
  practiceCardCount,
  completedCardCount,
  currentGroupSize,
}: PracticeTransitionModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Modal Content */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xs sm:max-w-md mx-4">
        <div className="relative">
          <div className="bg-blue-50 rounded-3xl p-4 sm:p-8 text-center shadow-2xl border-4 border-blue-200">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 sm:top-4 sm:right-4 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 h-8 w-8 sm:h-10 sm:w-10"
              onClick={onClose}
              aria-label="Đóng"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            {/* Play Icon */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <Image
                src="/images/study-mascot-new.png"
                alt="Study mascot"
                width={100} // Base size for Image component
                height={100} // Base size for Image component
                className="object-contain animate-bounce w-16 h-16 sm:w-24 sm:h-24" // Responsive rendered size
              />
            </div>

            {/* Main Title */}
            <h2 className="text-xl sm:text-3xl font-bold text-blue-700 mb-2 sm:mb-3">Sẵn sàng làm bài tập?</h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Bây giờ hãy làm bài tập để kiểm tra kiến thức!
            </p>

            {/* Stats Section */}
            <div className="bg-blue-100 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex justify-around items-center border border-blue-200">
              <div className="text-center">
                <p className="text-blue-700 font-bold text-2xl sm:text-3xl">{practiceCardCount}</p>
                <p className="text-blue-600 text-xs sm:text-sm font-semibold">TỪ ĐÃ HỌC</p>
              </div>
              <div className="w-px h-10 sm:h-12 bg-blue-300 mx-3 sm:mx-4" /> {/* Responsive divider */}
              <div className="text-center">
                <p className="text-green-600 font-bold text-2xl sm:text-3xl">{practiceCardCount}</p>
                <p className="text-blue-600 text-xs sm:text-sm font-semibold">CÂU HỎI</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Button
                onClick={onReview}
                className="flex-1 bg-white border-2 border-blue-300 text-blue-700 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <BookOpen className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" /> ÔN LẠI
              </Button>
              <Button
                onClick={onContinue}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <Play className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" /> BẮT ĐẦU
              </Button>
            </div>

            {/* "Maybe later" option */}
            <Button variant="link" onClick={onClose} className="text-gray-500 text-xs sm:text-sm underline">
              Có thể sau
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
