"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import authService from "@/app/services/auth.service"
import { jwtDecode } from "jwt-decode"

interface CompletionData {
  subtopicName: string;
  hasNextSubtopic: boolean;
  hasSentenceBuilding: boolean;
  allSubtopicsCompleted: boolean;
  nextSubtopicId?: string;
  topicId?: string;
}

export default function CompletionSubtopicPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [completionData, setCompletionData] = useState<CompletionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCompletionData = async () => {
      // Lấy dữ liệu từ URL params
      const subtopicName = searchParams.get('subtopicName') || "Subtopic"
      const hasNextSubtopic = searchParams.get('hasNextSubtopic') === 'true'
      const nextSubtopicId = searchParams.get('nextSubtopicId') || undefined
      const topicId = searchParams.get('topicId') || undefined
      let hasSentenceBuilding = searchParams.get('hasSentenceBuilding') === 'true'
      let allSubtopicsCompleted = searchParams.get('allSubtopicsCompleted') === 'true'

      // Nếu không có thông tin sentence building từ params, kiểm tra từ API
      if (!hasSentenceBuilding && topicId) {
        try {
          const { FlashcardService } = await import('@/app/services/flashcard.service');
          hasSentenceBuilding = await FlashcardService.hasSentenceBuildingForTopic(parseInt(topicId));
        } catch (error) {
          console.warn("Failed to check sentence building:", error);
          hasSentenceBuilding = false;
        }
      }

      // Kiểm tra allSubtopicsCompleted trực tiếp từ database nếu có topicId
      if (topicId) {
        try {
          const { FlashcardService } = await import('@/app/services/flashcard.service');
          
          // Lấy userId thực tế từ authService
          let userId = 'default-user';
          if (authService.isAuthenticated()) {
            try {
              const token = authService.getCurrentToken();
              if (token) {
                const decoded = jwtDecode(token);
                userId = decoded.sub || 'default-user';
              }
            } catch (error) {
              console.warn("Failed to decode token:", error);
            }
          }
          
          // Gọi API mới để kiểm tra completion status
          const completionResponse = await fetch(`http://localhost:8080/api/v1/flashcards/topic/${topicId}/completion-status?userId=${userId}`);
          if (completionResponse.ok) {
            const completionData = await completionResponse.json();
            allSubtopicsCompleted = completionData.allSubtopicsCompleted || false;
            console.log("📊 Database check - allSubtopicsCompleted:", allSubtopicsCompleted);
            console.log("📊 Total subtopics:", completionData.totalSubtopics);
            console.log("📊 Completed subtopics:", completionData.completedCount);
            console.log("📊 Completed subtopic IDs:", completionData.completedSubtopicIds);
          }
        } catch (error) {
          console.warn("Failed to check all subtopics completion from database:", error);
          // Giữ lại giá trị từ URL params nếu API call thất bại
        }
      }

      setCompletionData({
        subtopicName,
        hasNextSubtopic,
        hasSentenceBuilding,
        allSubtopicsCompleted,
        nextSubtopicId,
        topicId
      })
      setLoading(false)
    }

    loadCompletionData()
  }, [searchParams])

  const handleRetry = () => {
    // Quay lại subtopic hiện tại
    const currentSubtopicId = searchParams.get('currentSubtopicId')
    if (currentSubtopicId) {
      router.push(`/flashcard/${currentSubtopicId}`)
    } else {
      router.push('/homepage')
    }
  }

  const handleNext = async () => {
    if (completionData?.hasNextSubtopic && completionData?.nextSubtopicId) {
      // Chuyển đến subtopic tiếp theo
      router.push(`/flashcard/${completionData.nextSubtopicId}`)
    } else if (completionData?.topicId && completionData?.allSubtopicsCompleted) {
      // Tất cả subtopics đã hoàn thành - chuyển đến bài test
      router.push(`/test-start?topicId=${completionData.topicId}`)
    } else {
      // Chưa hoàn thành tất cả subtopics - về homepage
      router.push('/homepage')
    }
  }

  const handleSentenceBuilding = () => {
    const currentSubtopicId = searchParams.get('currentSubtopicId')
    const topicId = searchParams.get('topicId')
    if (currentSubtopicId && topicId) {
      router.push(`/practice?topicId=${topicId}&mode=sentence-building`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!completionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Không tìm thấy dữ liệu hoàn thành</p>
          <Button onClick={() => router.push('/homepage')}>
            Về trang chủ
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden flex flex-col">
      {/* Decorative Stars Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-6 h-6 text-yellow-300 animate-pulse">⭐</div>
        <div className="absolute top-32 right-24 w-5 h-5 text-blue-300 animate-bounce">⭐</div>
        <div className="absolute top-40 left-1/4 w-4 h-4 text-green-300 animate-pulse">⭐</div>
        <div className="absolute top-60 right-1/3 w-5 h-5 text-purple-300 animate-bounce">⭐</div>
        <div className="absolute top-80 left-1/3 w-4 h-4 text-pink-300 animate-pulse">⭐</div>
        <div className="absolute top-96 right-1/4 w-6 h-6 text-orange-300 animate-bounce">⭐</div>
      </div>

      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md text-center shadow-2xl border-4 border-green-300 relative">
          {/* Celebration mascot */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/whale-happy.png"
              alt="Happy whale"
              width={100}
              height={100}
              className="object-contain animate-bounce"
            />
          </div>
          
          {/* Congratulations message */}
          <h1 className="text-2xl font-bold text-green-700 mb-4">🎉 CHÚC MỪNG! 🎉</h1>
          <p className="text-lg font-semibold text-blue-700 mb-2">Bạn đã hoàn thành</p>
          <p className="text-xl font-bold text-blue-800 mb-6">{completionData.subtopicName}</p>
          
          {/* Thông báo khi không thể làm bài test */}
          {!completionData.hasNextSubtopic && !completionData.allSubtopicsCompleted && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Chưa thể làm bài test:</strong> Bạn cần hoàn thành tất cả các chủ đề nhỏ trong topic này trước khi làm bài test.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="flex flex-col gap-3">
            {completionData.hasSentenceBuilding && (
              <Button 
                onClick={handleSentenceBuilding}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🔤 Luyện tập ghép câu
              </Button>
            )}
            
            <Button 
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🔄 Học lại subtopic này
            </Button>
            
            {/* Luôn hiển thị nút tiếp theo - nếu có next subtopic thì học tiếp, không thì làm bài test */}
            <Button 
              onClick={handleNext}
              disabled={!completionData.hasNextSubtopic && !completionData.allSubtopicsCompleted}
              className={`w-full font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                completionData.hasNextSubtopic || completionData.allSubtopicsCompleted
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
            >
              {completionData.hasNextSubtopic ? "➡️ Học tiếp subtopic kế" : 
               completionData.allSubtopicsCompleted ? "📝 Làm bài test" : "🏠 Về trang chủ"}
            </Button>
            
            <Link href="/homepage">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                🏠 Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
} 