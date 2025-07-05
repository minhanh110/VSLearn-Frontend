"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface CompletionData {
  subtopicName: string;
  hasNextSubtopic: boolean;
  hasSentenceBuilding: boolean;
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
    // Lấy dữ liệu từ URL params hoặc sessionStorage
    const subtopicName = searchParams.get('subtopicName') || "Subtopic"
    const hasNextSubtopic = searchParams.get('hasNextSubtopic') === 'true'
    const hasSentenceBuilding = searchParams.get('hasSentenceBuilding') === 'true'
    const nextSubtopicId = searchParams.get('nextSubtopicId') || undefined
    const topicId = searchParams.get('topicId') || undefined

    setCompletionData({
      subtopicName,
      hasNextSubtopic,
      hasSentenceBuilding,
      nextSubtopicId,
      topicId
    })
    setLoading(false)
  }, [searchParams])

  const handleRetry = () => {
    // Quay lại subtopic hiện tại
    const currentSubtopicId = searchParams.get('currentSubtopicId')
    if (currentSubtopicId) {
      router.push(`/flashcard?subtopicId=${currentSubtopicId}`)
    } else {
      router.push('/homepage')
    }
  }

  const handleNext = () => {
    if (completionData?.hasNextSubtopic && completionData?.nextSubtopicId) {
      // Chuyển đến subtopic tiếp theo
      router.push(`/flashcard?subtopicId=${completionData.nextSubtopicId}`)
    } else if (completionData?.topicId) {
      // Chuyển đến bài test
      router.push(`/test-start?topicId=${completionData.topicId}`)
    } else {
      router.push('/homepage')
    }
  }

  const handleSentenceBuilding = () => {
    const currentSubtopicId = searchParams.get('currentSubtopicId')
    if (currentSubtopicId) {
      router.push(`/practice?lessonId=${currentSubtopicId}&mode=sentence-building`)
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
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {completionData.hasNextSubtopic ? "➡️ Học tiếp subtopic kế" : "📝 Làm bài test"}
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