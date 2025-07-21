"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function TestResultPageComponent() {
  const router = useRouter()
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedResults = sessionStorage.getItem("testResults")
    if (savedResults) {
      try {
        setTestResults(JSON.parse(savedResults))
      } catch {
        router.push("/homepage")
      }
    } else {
      router.push("/homepage")
    }
    setLoading(false)
  }, [router])

  if (loading || !testResults) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100">
        <div className="text-center text-blue-700 font-medium">Đang tải kết quả...</div>
      </div>
    )
  }

  const isPassed = testResults.accuracy >= 90

  const handleReview = () => router.push("/test-review")
  const handleFeedback = () =>
    router.push(`/feedback?topicId=${testResults.topicId}&fromTestResult=1`)
  const handleRetake = () => {
    if (testResults.topicId) {
      router.push(`/test-topic?topicId=${testResults.topicId}`)
    } else {
      router.push("/test-topic")
    }
  }
  const handleContinue = () => {
    sessionStorage.removeItem("testResults")
    router.push("/homepage")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden flex flex-col">
      <Header />

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />

      {/* Modal Content */}
      <div className="fixed top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[240px] sm:max-w-[320px] md:max-w-[400px] mx-4">
        <div className="relative">
          <div
            className={`rounded-3xl p-2 sm:p-4 md:p-6 w-full text-center shadow-2xl border-4 ${
              isPassed ? "bg-blue-50 border-blue-200" : "bg-pink-50 border-pink-200"
            }`}
          >
            {/* Mascot Image */}
            <div className="flex justify-center mb-2">
              <Image
                src={isPassed ? "/images/test-success-whale.png" : "/images/test-failure-whale.png"}
                alt={isPassed ? "Happy whale" : "Sad whale"}
                width={96}
                height={96}
                className="object-contain animate-bounce w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24"
              />
            </div>

            {/* Title */}
            <h1 className={`text-lg sm:text-xl font-bold mb-1 ${isPassed ? "text-blue-800" : "text-red-700"}`}>
              {isPassed ? "CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH !" : "ÔI, KHÔNG !"}
            </h1>

            {/* Subtitle */}
            <p className={`text-xs sm:text-sm font-semibold mb-2 ${isPassed ? "text-blue-600" : "text-gray-600"}`}>
              {isPassed ? "BẠN ĐÃ VƯỢT QUA BÀI KIỂM TRA" : "BẠN ĐÃ KHÔNG VƯỢT QUA BÀI KIỂM TRA"}
              <br />
              {testResults.topicName ? `"${testResults.topicName.toUpperCase()}"` : ""}
            </p>

            {/* Score Summary */}
            <div
              className={`rounded-3xl p-3 sm:p-5 shadow-xl border-2 mb-3 ${
                isPassed ? "bg-blue-100/80 border-blue-200" : "bg-red-100/80 border-red-200"
              }`}
            >
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center">
                  <div className={`text-2xl sm:text-3xl font-bold mb-0.5 ${isPassed ? "text-blue-700" : "text-red-700"}`}>
                    {testResults.totalQuestions}
                  </div>
                  <div className={`text-sm sm:text-base font-medium ${isPassed ? "text-blue-600" : "text-red-600"}`}>
                    TỪ VỰNG
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl sm:text-3xl font-extrabold mb-0.5 ${isPassed ? "text-blue-700" : "text-red-700"}`}>
                    {testResults.accuracy}%
                  </div>
                  <div className={`text-sm sm:text-base font-medium ${isPassed ? "text-blue-600" : "text-red-600"}`}>
                    ĐỘ CHÍNH XÁC
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleReview}
                className={`w-full font-bold py-2.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-sm ${
                  isPassed ? "bg-blue-300 hover:bg-blue-400 text-blue-700" : "bg-pink-300 hover:bg-pink-400 text-pink-800"
                }`}
              >
                XEM LẠI BÀI
              </Button>

              <Button
                onClick={handleFeedback}
                className={`w-full font-bold py-2.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-sm ${
                  isPassed ? "bg-blue-300 hover:bg-blue-400 text-blue-700" : "bg-pink-300 hover:bg-pink-400 text-pink-800"
                }`}
              >
                PHẢN HỒI
              </Button>

              <Button
                onClick={handleRetake}
                className={`w-full font-bold py-2.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-sm ${
                  isPassed ? "bg-blue-300 hover:bg-blue-400 text-blue-700" : "bg-pink-300 hover:bg-pink-400 text-pink-800"
                }`}
              >
                LÀM LẠI
              </Button>

              {isPassed ? (
                <Button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                >
                  TIẾP TỤC
                </Button>
              ) : (
                <Button
                  onClick={handleContinue}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                >
                  ĐÓNG
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
