"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { testService } from "@/app/services/testService"
import authService from "@/app/services/auth.service"
import { LoginModal } from "@/components/login-modal"

export function TestStartPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = searchParams.get("testId")
  const topicId = searchParams.get("topicId") || testId // Use testId as topicId if topicId not provided
  const userId = searchParams.get("userId") || "1" // Default user ID for testing

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [topicName, setTopicName] = useState<string>("Đang tải...")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Check authentication and load topic name when component mounts
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          // Show login modal instead of redirecting
          setShowLoginModal(true)
          setIsLoading(false)
          return
        }

        // Load topic name if authenticated
        if (topicId) {
          const name = await testService.getTopicName(parseInt(topicId))
          setTopicName(name)
        }
        setIsLoading(false)
      } catch (error: any) {
        console.error("Error loading topic name:", error)
        
        // Handle authentication errors
        if (error.message?.includes('Authentication required') || error.message?.includes('Network Error')) {
          setError("Vui lòng đăng nhập để tiếp tục")
          setShowLoginModal(true)
        } else {
          setTopicName("Chủ đề không xác định")
          setError("Không thể tải thông tin chủ đề")
        }
        setIsLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [topicId])

  const handleGoBack = () => {
    router.back()
  }

  const handleStartTest = () => {
    // Check authentication again before starting test
    if (!authService.isAuthenticated()) {
      setShowLoginModal(true)
      return
    }

    // Navigate to test page with all necessary parameters
    const params = new URLSearchParams({
      testId: testId || "",
      topicId: topicId || "",
      userId: userId
    })
    router.push(`/test-topic?${params.toString()}`)
  }

  const handleCloseLoginModal = () => {
    setShowLoginModal(false)
    // Redirect back to homepage if user closes the modal
    router.push("/homepage")
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  // Show error state (but not for authentication errors since we show modal)
  if (error && !error.includes("đăng nhập")) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-100 relative overflow-hidden">
      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-20 pb-28 lg:pb-20">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-auto border-4 border-blue-100">
          {/* Test mascot */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test-mascot-G8XHYRh9RxcugfBPcrIKl040K3hSLD.png"
                alt="Test mascot"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">BẮT ĐẦU BÀI TEST</h1>

          {/* Test Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Chủ đề:</span>
                <span className="font-medium">{topicName}</span>
              </div>
              <div className="flex justify-between">
                <span>Số câu hỏi:</span>
                <span className="font-medium">20 câu</span>
              </div>
              <div className="flex justify-between">
                <span>Điểm đạt:</span>
                <span className="font-medium text-green-600">≥ 90%</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            {/* Go back button */}
            <Button
              onClick={handleGoBack}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-full transition-all duration-200 hover:shadow-lg"
            >
              QUAY VỀ
            </Button>

            {/* Start test button */}
            <Button
              onClick={handleStartTest}
              className="flex-1 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:shadow-lg"
            >
              BẮT ĐẦU
            </Button>
          </div>
        </div>
      </div>

      {/* Additional floating elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-32 w-6 h-6 bg-cyan-200 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute bottom-40 left-32 w-5 h-5 bg-blue-300 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-60 right-20 w-4 h-4 bg-cyan-300 rounded-full opacity-50 animate-pulse"></div>

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseLoginModal}
        returnUrl={window.location.href}
      />
    </div>
  )
}

export default TestStartPage
