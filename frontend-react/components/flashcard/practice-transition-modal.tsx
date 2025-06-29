"use client"

import { Button } from "@/components/ui/button"
import { X, Play, BookOpen, Star } from "lucide-react"

interface PracticeTransitionModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  onReview: () => void
  practiceCardCount: number
  completedCardCount: number
  currentGroupSize?: number
}

export function PracticeTransitionModal({ 
  isOpen, 
  onClose, 
  onContinue, 
  onReview,
  practiceCardCount,
  completedCardCount,
  currentGroupSize
}: PracticeTransitionModalProps) {
  if (!isOpen) return null

  const displayCompletedCount = currentGroupSize || completedCardCount;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Modal content */}
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-blue-200 p-6 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Sẵn sàng làm bài tập?
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Bạn đã hoàn thành {displayCompletedCount} từ vựng. Bây giờ hãy làm bài tập để kiểm tra kiến thức!
            </p>

            {/* Stats */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{displayCompletedCount}</div>
                  <div className="text-xs text-gray-600">TỪ ĐÃ HỌC</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{practiceCardCount}</div>
                  <div className="text-xs text-gray-600">CÂU HỎI</div>
                </div>
              </div>
            </div>

            {/* Features list */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Bài tập sẽ bao gồm:</h3>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Câu hỏi trắc nghiệm với 4 đáp án
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Video minh họa cho mỗi câu hỏi
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Phản hồi ngay lập tức khi chọn đáp án
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Theo dõi tiến độ học tập
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mb-4">
              <Button
                onClick={onReview}
                variant="outline"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl border-2 border-gray-300"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                ÔN LẠI
              </Button>
              <Button
                onClick={onContinue}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <Play className="w-4 h-4 mr-2" />
                BẮT ĐẦU
              </Button>
            </div>

            {/* Secondary action */}
            <button
              onClick={onClose}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Có thể sau
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 