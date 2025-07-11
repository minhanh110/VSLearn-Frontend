"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export function TestResultPageComponent() {
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

  return (
    <div className="min-h-screen bg-blue-100 relative overflow-hidden">
      <Header />
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Result Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-700 mb-4">
              KẾT QUẢ BÀI KIỂM TRA
            </h1>
            {/* Score Display */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200 mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">{testResults.accuracy}%</div>
              <div className="text-lg text-gray-600 mb-4">
                {testResults.accuracy >= 90 ? "🎉 CHÚC MỪNG! Bạn đã hoàn thành xuất sắc!" : "Cần cố gắng thêm!"}
              </div>
              {testResults.accuracy >= 90 && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        <strong>Chủ đề tiếp theo đã được mở khóa!</strong> Bạn có thể tiếp tục học chủ đề mới.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{testResults.correctAnswers}</div>
                  <div className="text-gray-600">Câu đúng</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">
                    {testResults.totalQuestions - testResults.correctAnswers}
                  </div>
                  <div className="text-gray-600">Câu sai</div>
                </div>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/test-review")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl"
            >
              XEM LẠI BÀI KIỂM TRA
            </Button>
            <Button
              onClick={() => router.push(`/feedback?topicId=${testResults.topicId}&fromTestResult=1`)}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-xl"
            >
              GỬI PHẢN HỒI
            </Button>
            <Button
              onClick={() => {
                if (testResults.topicId) {
                  router.push(`/test-topic?topicId=${testResults.topicId}`)
                } else {
                  router.push("/test-topic")
                }
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl"
            >
              LÀM LẠI BÀI KIỂM TRA
            </Button>
            <Button
              onClick={() => {
                // Clear test results from sessionStorage when going back to homepage
                sessionStorage.removeItem("testResults");
                router.push("/homepage");
              }}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-4 rounded-xl"
            >
              VỀ TRANG CHỦ
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 