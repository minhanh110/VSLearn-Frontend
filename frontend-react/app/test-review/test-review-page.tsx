"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface ReviewQuestion {
  id: number
  type: "multiple-choice" | "true-false" | "essay"
  question: string
  imageUrl: string
  userAnswer: any
  correctAnswer: any
  isCorrect: boolean
  explanation: string
  options?: string[]
}

interface TestResults {
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  questions: ReviewQuestion[]
}

export function TestReviewPageComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentView, setCurrentView] = useState<"summary" | "detail">("summary")
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)
  const [testResults, setTestResults] = useState<TestResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Read test results from sessionStorage
    const savedResults = sessionStorage.getItem("testResults")
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults)
        setTestResults(parsedResults)
      } catch (error) {
        console.error("Error parsing test results:", error)
        router.push("/homepage")
      }
    } else {
      // No test results found, redirect to homepage
      router.push("/homepage")
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Đang tải kết quả...</p>
        </div>
      </div>
    )
  }

  if (!testResults) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">Không tìm thấy kết quả bài kiểm tra</p>
          <Button onClick={() => router.push("/homepage")} className="bg-blue-500 hover:bg-blue-600 text-white">
            Về trang chủ
          </Button>
        </div>
      </div>
    )
  }

  const selectedQuestion = testResults.questions[selectedQuestionIndex]

  const handleQuestionClick = (index: number) => {
    setSelectedQuestionIndex(index)
    setCurrentView("detail")
  }

  const handleBackToSummary = () => {
    setCurrentView("summary")
  }

  const handleNextQuestion = () => {
    if (selectedQuestionIndex < testResults.questions.length - 1) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (selectedQuestionIndex > 0) {
      setSelectedQuestionIndex(selectedQuestionIndex - 1)
    }
  }

  // Summary View - Trang tổng kết
  if (currentView === "summary") {
    return (
      <div className="min-h-screen bg-blue-100 relative overflow-hidden">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

        <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-blue-700 mb-4">
                KẾT QUẢ BÀI KIỂM TRA CHỦ ĐỀ :<br />
                "GIA ĐÌNH"
              </h1>

              {/* Stats */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-blue-200 mb-6">
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{testResults.totalQuestions}</div>
                    <div className="text-sm text-gray-600">TỪ VỰNG</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{testResults.accuracy}%</div>
                    <div className="text-sm text-gray-600">ĐỘ CHÍNH XÁC</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{testResults.correctAnswers}</div>
                    <div className="text-sm text-gray-600">SỐ CÂU ĐÚNG</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {testResults.totalQuestions - testResults.correctAnswers}
                    </div>
                    <div className="text-sm text-gray-600">SỐ CÂU SAI</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3 mb-6">
              {testResults.questions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => handleQuestionClick(index)}
                  className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all hover:scale-[1.02] ${
                    question.isCorrect
                      ? "bg-green-100 border-green-300 text-green-800"
                      : "bg-red-100 border-red-300 text-red-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        question.isCorrect ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {question.isCorrect ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <X className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span>
                      CÂU {index + 1}: {question.question}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: Math.ceil(testResults.questions.length / 5) }).map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full ${index === 0 ? "bg-blue-500" : "bg-gray-300"}`} />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => router.push("/homepage")}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-4 rounded-xl"
              >
                ĐÓNG
              </Button>
              <Button
                onClick={() => router.push("/test-topic")}
                className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl"
              >
                LÀM LẠI
              </Button>
            </div>
          </div>
        </div>

        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  // Detail View - Trang chi tiết câu hỏi
  return (
    <div className="min-h-screen bg-blue-100 relative overflow-hidden">
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-lg font-bold text-blue-700 mb-2">CHI TIẾT CÂU HỎI</h1>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 mb-6">
            {/* Question Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedQuestion.isCorrect ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {selectedQuestion.isCorrect ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <X className="w-5 h-5 text-white" />
                )}
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                CÂU {selectedQuestionIndex + 1}: {selectedQuestion.question}
              </h2>
            </div>

            {/* Image/Video */}
            <div className="flex justify-center mb-6">
              <div className="relative w-64 h-48 rounded-xl overflow-hidden border-2 border-blue-300">
                <Image
                  src={selectedQuestion.imageUrl || "/placeholder.svg"}
                  alt="Sign language demonstration"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* User Answer */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-700 mb-2">ĐÁP ÁN CỦA BẠN</h3>
              <p className={`font-medium ${selectedQuestion.isCorrect ? "text-green-600" : "text-red-600"}`}>
                {selectedQuestion.type === "true-false"
                  ? selectedQuestion.userAnswer
                    ? "ĐÚNG"
                    : "SAI"
                  : selectedQuestion.userAnswer || "Không có đáp án"}
              </p>
            </div>

            {/* Correct Answer */}
            <div className="mb-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-green-700 mb-2">ĐÁP ÁN ĐÚNG</h3>
              <p className="font-medium text-green-600">
                {selectedQuestion.type === "true-false"
                  ? selectedQuestion.correctAnswer
                    ? "ĐÚNG"
                    : "SAI"
                  : selectedQuestion.correctAnswer}
              </p>
            </div>

            {/* Explanation */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-bold text-yellow-700 mb-2">GIẢI THÍCH</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{selectedQuestion.explanation}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handleBackToSummary}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-xl"
            >
              QUAY LẠI
            </Button>

            <div className="flex gap-2">
              {selectedQuestionIndex > 0 && (
                <Button
                  onClick={handlePrevQuestion}
                  className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}

              {selectedQuestionIndex < testResults.questions.length - 1 && (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default TestReviewPageComponent
