"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image" // Import Image component

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

  const isPassed = testResults.accuracy >= 90 // Điều kiện để xác định đậu/rớt

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden flex flex-col">
      <Header />
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />

      {/* Modal Content */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xs sm:max-w-md mx-4">
        <div className="relative">
          <div
            className={`rounded-3xl p-6 sm:p-8 w-full text-center shadow-2xl border-4 ${
              isPassed ? "bg-blue-50 border-blue-200" : "bg-pink-50 border-pink-200"
            }`}
          >
            {/* Mascot Image */}
            <div className="flex justify-center mb-4">
              <Image
                src={isPassed ? "/images/test-success-whale.png" : "/images/test-failure-whale.png"}
                alt={isPassed ? "Happy whale" : "Sad whale"}
                width={120}
                height={120}
                className="object-contain animate-bounce"
              />
            </div>

            {/* Main Title */}
            <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${isPassed ? "text-blue-800" : "text-red-700"}`}>
              {isPassed ? "CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH !" : "ÔI, KHÔNG !"}
            </h1>
            {/* Subtitle */}
            <p className={`text-base sm:text-lg font-semibold mb-4 ${isPassed ? "text-blue-600" : "text-gray-600"}`}>
              {isPassed ? "BẠN ĐÃ VƯỢT QUA BÀI KIỂM TRA" : "BẠN ĐÃ KHÔNG VƯỢT QUA BÀI KIỂM TRA"}
              <br />
              {testResults.topicName ? `"${testResults.topicName.toUpperCase()}"` : ""}
            </p>

            {/* Score Display */}
            <div
              className={`rounded-3xl p-6 sm:p-8 shadow-xl border-2 mb-6 ${
                isPassed ? "bg-blue-100/80 border-blue-200" : "bg-red-100/80 border-red-200"
              }`}
            >
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className={`text-2xl sm:text-3xl font-bold mb-1 ${isPassed ? "text-blue-700" : "text-red-700"}`}>
                    {testResults.totalQuestions}
                  </div>
                  <div className={`text-base sm:text-lg font-medium ${isPassed ? "text-blue-600" : "text-red-600"}`}>
                    TỪ VỰNG
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-5xl sm:text-6xl font-extrabold mb-1 ${isPassed ? "text-blue-700" : "text-red-700"}`}
                  >
                    {testResults.accuracy}%
                  </div>
                  <div className={`text-base sm:text-lg font-medium ${isPassed ? "text-blue-600" : "text-red-600"}`}>
                    ĐỘ CHÍNH XÁC
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl sm:text-3xl font-bold mb-1 ${isPassed ? "text-blue-700" : "text-red-700"}`}>
                    1
                  </div>
                  <div className={`text-base sm:text-lg font-medium ${isPassed ? "text-blue-600" : "text-red-600"}`}>
                    CẤP
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => router.push("/test-review")}
                className={`w-full font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 ${
                  isPassed
                    ? "bg-blue-300 hover:bg-blue-400 text-blue-700"
                    : "bg-pink-300 hover:bg-pink-400 text-pink-800"
                }`}
              >
                XEM LẠI BÀI
              </Button>

              {isPassed && (
                <Button
                  onClick={() => router.push(`/feedback?topicId=${testResults.topicId}&fromTestResult=1`)}
                  className="w-full bg-blue-300 hover:bg-blue-400 text-blue-700 font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  PHẢN HỒI
                </Button>
              )}

              <Button
                onClick={() => {
                  if (testResults.topicId) {
                    router.push(`/test-topic?topicId=${testResults.topicId}`)
                  } else {
                    router.push("/test-topic")
                  }
                }}
                className={`w-full font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 ${
                  isPassed
                    ? "bg-blue-300 hover:bg-blue-400 text-blue-700"
                    : "bg-pink-300 hover:bg-pink-400 text-pink-800"
                }`}
              >
                LÀM LẠI
              </Button>

              {isPassed ? (
                <Button
                  onClick={() => {
                    // Logic để chuyển sang topic tiếp theo
                    // Hiện tại chỉ về homepage, bạn có thể thay đổi logic này
                    sessionStorage.removeItem("testResults")
                    router.push("/homepage")
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  TIẾP TỤC
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    sessionStorage.removeItem("testResults")
                    router.push("/homepage")
                  }}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
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
