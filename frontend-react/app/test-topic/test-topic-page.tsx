"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter, useSearchParams } from "next/navigation"

// Định nghĩa kiểu dữ liệu cho câu hỏi
interface Question {
  id: number
  type: "multiple-choice" | "true-false" | "essay"
  videoUrl: string
  imageUrl: string
  question: string
  options?: string[] // Cho multiple choice
  correctAnswer: string
  trueFalseAnswer?: boolean // Cho true/false
  essayPrompt?: string // Cho essay
}

export function TestTopicPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = searchParams.get("testId")

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: any }>({})
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [showResultPage, setShowResultPage] = useState(false)
  const [testScore, setTestScore] = useState(0)
  const [testResults, setTestResults] = useState<any>(null)

  // Function để mark test completed
  const markCompleted = (id: string) => {
    const completedEvent = new CustomEvent("lessonCompleted", {
      detail: { lessonId: Number.parseInt(id) },
    })
    window.dispatchEvent(completedEvent)
  }

  // Câu hỏi test với các dạng khác nhau
  const testQuestions: Question[] = useMemo(
    () => [
      // Multiple Choice Questions
      {
        id: 1,
        type: "multiple-choice",
        videoUrl: "/videos/sign-language-demo.mp4",
        imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dqpema8bKAu3lWH3YFhOtPTQw7dgit.png",
        question: "HÀNH ĐỘNG NÀY CÓ NGHĨA LÀ GÌ ?",
        options: ["QUẢ TÁO", "QUẢ BƯỞI", "QUẢ KHẾ"],
        correctAnswer: "QUẢ TÁO",
      },
      {
        id: 2,
        type: "multiple-choice",
        videoUrl: "/videos/sign-language-demo.mp4",
        imageUrl: "/placeholder.svg?height=300&width=300",
        question: "HÀNH ĐỘNG NÀY CÓ NGHĨA LÀ GÌ ?",
        options: ["XIN CHÀO", "TẠM BIỆT", "CẢM ƠN", "XIN LỖI"],
        correctAnswer: "XIN CHÀO",
      },
      // True/False Questions
      {
        id: 3,
        type: "true-false",
        videoUrl: "/videos/sign-language-demo.mp4",
        imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-H6N1nBwxDB2DOxGJqdXB1fhcFmxFTc.png",
        question: "HÀNH ĐỘNG NÀY CÓ NGHĨA LÀ: QUẢ TÁO ?",
        correctAnswer: "true",
        trueFalseAnswer: true,
      },
      {
        id: 4,
        type: "true-false",
        videoUrl: "/videos/sign-language-demo.mp4",
        imageUrl: "/placeholder.svg?height=300&width=300",
        question: "HÀNH ĐỘNG NÀY CÓ NGHĨA LÀ: XIN LỖI ?",
        correctAnswer: "false",
        trueFalseAnswer: false,
      },
      // Essay Questions
      {
        id: 5,
        type: "essay",
        videoUrl: "/videos/sign-language-demo.mp4",
        imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Aa12pvFhoGGlA29VaRLudhds9auJQD.png",
        question: "HÀNH ĐỘNG NÀY CÓ NGHĨA LÀ GÌ ?",
        correctAnswer: "Quả táo", // Sample correct answer for essay
        essayPrompt: "HÃY ĐIỀN ĐÁP ÁN CỦA BẠN VÀO ĐÂY",
      },
      {
        id: 6,
        type: "essay",
        videoUrl: "/videos/sign-language-demo.mp4",
        imageUrl: "/placeholder.svg?height=300&width=300",
        question: "MÔ TẢ HÀNH ĐỘNG TRONG VIDEO",
        correctAnswer: "Chào hỏi", // Sample correct answer
        essayPrompt: "HÃY MÔ TẢ HÀNH ĐỘNG BẠN THẤY TRONG VIDEO",
      },
    ],
    [],
  )

  const currentQuestion = useMemo(() => {
    return testQuestions[currentQuestionIndex]
  }, [testQuestions, currentQuestionIndex])

  // Handle answer selection for any question type
  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  // Navigation functions
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  // Submit confirmation
  const handleSubmitTest = () => {
    setShowSubmitConfirm(true)
  }

  const handleConfirmSubmit = () => {
    // Calculate score and create detailed results
    let correctAnswers = 0
    const questionResults = testQuestions.map((question) => {
      const userAnswer = answers[question.id]
      let isCorrect = false

      if (question.type === "multiple-choice" && userAnswer === question.correctAnswer) {
        isCorrect = true
        correctAnswers++
      } else if (question.type === "true-false" && userAnswer === question.trueFalseAnswer) {
        isCorrect = true
        correctAnswers++
      } else if (question.type === "essay" && userAnswer && userAnswer.trim().length > 0) {
        isCorrect = true
        correctAnswers++
      }

      return {
        id: question.id,
        type: question.type,
        question: question.question,
        imageUrl: question.imageUrl,
        userAnswer: userAnswer,
        correctAnswer: question.type === "true-false" ? question.trueFalseAnswer : question.correctAnswer,
        isCorrect: isCorrect,
        explanation: getExplanationForQuestion(question.id),
        options: question.options,
      }
    })

    const score = Math.round((correctAnswers / testQuestions.length) * 100)
    setTestScore(score)

    // Set detailed test results
    setTestResults({
      totalQuestions: testQuestions.length,
      correctAnswers: correctAnswers,
      accuracy: score,
      questions: questionResults,
    })

    setShowSubmitConfirm(false)
    setShowResultPage(true)
  }

  const handleRetakeTest = () => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setShowResultPage(false)
    setTestScore(0)
    setTestResults(null)
  }

  const handleContinueFromResult = () => {
    if (testId) {
      markCompleted(testId)
    }
    router.push("/homepage")
  }

  const handleCloseResult = () => {
    router.push("/homepage")
  }

  const handleGoToFeedback = () => {
    router.push("/feedback")
  }

  const handleShowReview = () => {
    // Store test results in sessionStorage to pass to review page
    if (testResults) {
      sessionStorage.setItem('testResults', JSON.stringify(testResults))
      router.push('/test-review')
    }
  }

  // Get current answer for the question
  const getCurrentAnswer = () => {
    return answers[currentQuestion?.id]
  }

  const getExplanationForQuestion = (questionId: number) => {
    const explanations: { [key: number]: string } = {
      1: "Tay phải nắm, ngón cái và ngón tay trỏ mở ra, giống chữ cái ngón tay 'C', lòng bàn tay hướng vào trong, đặt vào hai bên miệng, dựa nhe tay xuống dưới đồng thời tay chạm vào miệng.",
      2: "Tay phải giống chữ cái ngón tay 'B', lòng bàn tay hướng vào trong, đặt lên các đầu ngón tay vào cằm. Lòng bàn tay hướng sang trái, đầu ngón tay hướng lên trên, đặt vào hai bên miệng.",
      3: "Tay phải nắm, ngón cái và ngón tay trỏ mở ra, giống chữ cái ngón tay 'C', lòng bàn tay hướng vào trong, đặt vào hai bên miệng, dựa nhe tay xuống dưới đồng thời tay chạm vào miệng.",
      4: "Đây không phải là cử chỉ cho 'xin lỗi'. Cử chỉ này có nghĩa khác.",
      5: "Tay phải nắm, ngón cái và ngón tay trỏ mở ra, giống chữ cái ngón tay 'C', lòng bàn tay hướng vào trong, đặt vào hai bên miệng.",
      6: "Đây là cử chỉ chào hỏi cơ bản trong ngôn ngữ ký hiệu."
    }
    return explanations[questionId] || "Không có giải thích cho câu hỏi này."
  }

  if (showResultPage) {
    const isPassed = testScore >= 90

    return (
      <div className="min-h-screen bg-blue-100 relative overflow-hidden">
        {/* Header */}
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

        {/* Background decorative image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={isPassed ? "/images/success-popup-bg.png" : "/images/failure-popup-bg.png"}
            alt="Background decoration"
            fill
            className="object-cover"
          />
        </div>

        {/* Result Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-20 pb-28 lg:pb-20">
          <div className="max-w-sm w-full mx-auto">
            <div
              className={`rounded-2xl shadow-2xl border-4 p-6 text-center ${
                isPassed ? "bg-white border-blue-200" : "bg-pink-50 border-pink-200"
              }`}
            >
              {/* Mascot */}
              <div className="flex justify-center mb-4">
                <Image
                  src={isPassed ? "/images/test-success-whale.png" : "/images/test-failure-whale.png"}
                  alt={isPassed ? "Success whale" : "Failure whale"}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h1 className={`text-xl font-bold mb-2 ${isPassed ? "text-gray-800" : "text-gray-800"}`}>
                {isPassed ? "CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH !" : "ÔI, KHÔNG !"}
              </h1>

              {/* Subtitle */}
              <p className={`text-sm font-medium mb-4 ${isPassed ? "text-gray-600" : "text-gray-600"}`}>
                {isPassed ? "BẠN ĐÃ VƯỢT QUA BÀI KIỂM TRA" : "BẠN ĐÃ KHÔNG VƯỢT QUA BÀI KIỂM TRA"}
              </p>
              {!isPassed && <p className="text-sm font-medium mb-4 text-gray-600">TIẾP TỤC!</p>}

              {/* Stats */}
              <div className={`rounded-lg p-3 mb-4 ${isPassed ? "bg-blue-50" : "bg-red-400"}`}>
                <div className="flex justify-center gap-8 text-center">
                  <div>
                    <div className={`text-lg font-bold ${isPassed ? "text-blue-600" : "text-white"}`}>
                      {testQuestions.length}
                    </div>
                    <div className={`text-xs ${isPassed ? "text-blue-500" : "text-white"}`}>TỪ VỰNG</div>
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${isPassed ? "text-blue-600" : "text-white"}`}>{testScore}%</div>
                    <div className={`text-xs ${isPassed ? "text-blue-500" : "text-white"}`}>ĐỘ CHÍNH XÁC</div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              {isPassed ? (
                // Success - 4 buttons in 2x2 grid
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleShowReview}
                      className="bg-blue-300 hover:bg-blue-400 text-blue-800 font-bold py-2 px-3 rounded-lg text-sm"
                    >
                      XEM LẠI BÀI
                    </Button>
                    <Button
                      onClick={handleGoToFeedback}
                      className="bg-blue-300 hover:bg-blue-400 text-blue-800 font-bold py-2 px-3 rounded-lg text-sm"
                    >
                      PHẢN HỒI
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleRetakeTest}
                      className="bg-blue-300 hover:bg-blue-400 text-blue-800 font-bold py-2 px-3 rounded-lg text-sm"
                    >
                      LÀM LẠI
                    </Button>
                    <Button
                      onClick={handleCloseResult}
                      className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-lg text-sm"
                    >
                      ĐÓNG
                    </Button>
                  </div>
                </div>
              ) : (
                // Failure - 4 buttons in 2x2 grid (added feedback button)
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleShowReview}
                      className="bg-pink-300 hover:bg-pink-400 text-pink-800 font-bold py-2 px-3 rounded-lg text-sm"
                    >
                      XEM LẠI BÀI
                    </Button>
                    <Button
                      onClick={handleGoToFeedback}
                      className="bg-pink-300 hover:bg-pink-400 text-pink-800 font-bold py-2 px-3 rounded-lg text-sm"
                    >
                      PHẢN HỒI
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleRetakeTest}
                      className="bg-pink-300 hover:bg-pink-400 text-pink-800 font-bold py-2 px-3 rounded-lg text-sm"
                    >
                      LÀM LẠI
                    </Button>
                    <Button
                      onClick={handleCloseResult}
                      className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-3 rounded-lg text-sm"
                    >
                      ĐÓNG
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden flex flex-col">
      {/* Decorative Stars Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-6 h-6 text-yellow-300 animate-pulse">⭐</div>
        <div className="absolute top-32 right-24 w-5 h-5 text-blue-300 animate-bounce">⭐</div>
        <div className="absolute top-40 left-1/4 w-4 h-4 text-green-300 animate-pulse">⭐</div>
        <div className="absolute bottom-40 left-16 w-5 h-5 text-pink-300 animate-pulse">⭐</div>
        <div className="absolute bottom-32 right-20 w-6 h-6 text-yellow-300 animate-bounce">⭐</div>
      </div>

      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content */}
      <div className="flex-1 px-4 pb-28 lg:pb-4 pt-16 relative z-10 min-h-0">
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
          <div className="flex-1 flex flex-col justify-center items-center">
            {/* Question Number and Progress - Nhỏ hơn */}
            <div className="mb-3 text-center">
              <h3 className="text-base font-bold text-blue-600">CÂU HỎI SỐ {currentQuestionIndex + 1}</h3>
              <div className="text-xs text-gray-600">
                {currentQuestionIndex + 1} / {testQuestions.length}
              </div>
            </div>

            {/* Video/Image Container - To hơn */}
            <div className="flex justify-center mb-3">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-88 md:h-88 rounded-2xl overflow-hidden border-4 border-blue-300 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
                {/* Decorative elements */}
                <div className="absolute top-2 left-2 w-4 h-4 text-yellow-400 z-10">⭐</div>
                <div className="absolute top-2 right-2 w-3 h-3 text-blue-400 z-10">⭐</div>
                <div className="absolute bottom-2 left-2 w-3 h-3 text-green-400 z-10">⭐</div>
                <div className="absolute bottom-2 right-2 w-4 h-4 text-purple-400 z-10">⭐</div>

                {/* Video/Image */}
                <div className="absolute inset-4 rounded-xl overflow-hidden bg-blue-900 flex items-center justify-center">
                  <Image
                    src={currentQuestion?.imageUrl || "/placeholder.svg"}
                    alt="Sign language demonstration"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Question - Nhỏ hơn */}
            <h2 className="text-lg sm:text-xl font-bold text-blue-700 text-center mb-4">{currentQuestion?.question}</h2>

            {/* Multiple Choice Questions */}
            {currentQuestion?.type === "multiple-choice" && (
              <div className="mb-4">
                {currentQuestion.options!.length === 3 ? (
                  // 3 đáp án - 1 hàng ngang
                  <div className="flex justify-center gap-2 sm:gap-3 max-w-xs sm:max-w-2xl mx-auto">
                    {currentQuestion.options!.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerChange(currentQuestion.id, option)}
                        className={`relative py-2 sm:py-3 px-4 sm:px-5 rounded-full border-2 transition-all duration-200 font-bold text-center text-sm sm:text-base whitespace-nowrap flex-1 ${
                          getCurrentAnswer() === option
                            ? "bg-blue-200 border-blue-600 text-blue-700"
                            : "border-blue-600 bg-blue-50 hover:bg-blue-100 text-blue-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  // 4 đáp án - 2x2 grid
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-md mx-auto">
                    {currentQuestion.options!.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerChange(currentQuestion.id, option)}
                        className={`relative py-2 sm:py-3 px-3 sm:px-4 rounded-full border-2 transition-all duration-200 font-bold text-center text-sm sm:text-base whitespace-nowrap ${
                          getCurrentAnswer() === option
                            ? "bg-blue-200 border-blue-600 text-blue-700"
                            : "border-blue-600 bg-blue-50 hover:bg-blue-100 text-blue-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* True/False Questions */}
            {currentQuestion?.type === "true-false" && (
              <div className="mb-4">
                <div className="flex justify-center gap-4 max-w-md mx-auto">
                  <button
                    onClick={() => handleAnswerChange(currentQuestion.id, true)}
                    className={`relative py-3 px-8 rounded-full border-2 font-bold text-lg transition-all duration-200 ${
                      getCurrentAnswer() === true
                        ? "bg-blue-200 border-blue-600 text-blue-700"
                        : "border-blue-600 bg-blue-50 hover:bg-blue-100 text-blue-700"
                    }`}
                  >
                    ĐÚNG
                  </button>
                  <button
                    onClick={() => handleAnswerChange(currentQuestion.id, false)}
                    className={`relative py-3 px-8 rounded-full border-2 font-bold text-lg transition-all duration-200 ${
                      getCurrentAnswer() === false
                        ? "bg-blue-200 border-blue-600 text-blue-700"
                        : "border-blue-600 bg-blue-50 hover:bg-blue-100 text-blue-700"
                    }`}
                  >
                    SAI
                  </button>
                </div>
              </div>
            )}

            {/* Essay Questions */}
            {currentQuestion?.type === "essay" && (
              <div className="mb-4 w-full max-w-2xl">
                <Textarea
                  value={getCurrentAnswer() || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder={currentQuestion.essayPrompt}
                  className="w-full h-24 p-4 border-2 border-blue-300 rounded-xl bg-white text-blue-700 font-medium resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            )}
          </div>

          {/* Submit Button - Floating ở góc trên phải */}
          <div className="fixed top-24 right-4 z-30">
            <Button
              onClick={handleSubmitTest}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
            >
              NỘP BÀI
            </Button>
          </div>

          {/* Navigation Controls - Chỉ còn Previous và Next */}
          <div className="fixed bottom-24 left-0 right-0 lg:relative lg:bottom-auto lg:mt-4 px-4 z-20">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              {/* Previous Button */}
              {currentQuestionIndex > 0 ? (
                <Button
                  onClick={handlePreviousQuestion}
                  className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 lg:py-3 lg:px-5 rounded-full shadow-lg text-sm lg:text-base"
                >
                  <ChevronLeft className="w-4 h-4" />
                  QUAY LẠI
                </Button>
              ) : (
                <div></div>
              )}

              {/* Next Button */}
              {currentQuestionIndex < testQuestions.length - 1 ? (
                <Button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 lg:py-3 lg:px-5 rounded-full shadow-lg text-sm lg:text-base"
                >
                  TIẾP THEO
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <div></div>
              )}
            </div>
          </div>

          {/* Mascot - Responsive và chỉ hiển thị trên desktop */}
          <div className="absolute bottom-2 left-2 hidden md:block">
            <div className="animate-bounce">
              <Image
                src="/images/study-mascot-new.png"
                alt="Study mascot"
                width={120}
                height={120}
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Popup */}
      {showSubmitConfirm && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xs mx-4">
            <div className="relative">
              <div className="bg-white rounded-2xl px-6 py-6 text-center shadow-2xl border-4 border-blue-200">
                {/* Warning icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">⚠️</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-800 mb-2">XÁC NHẬN NỘP BÀI</h2>

                {/* Message */}
                <p className="text-gray-600 text-base mb-6">
                  Bạn có chắc chắn muốn nộp bài? Bạn sẽ không thể thay đổi câu trả lời sau khi nộp.
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowSubmitConfirm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-4 rounded-xl"
                  >
                    HỦY
                  </Button>
                  <Button
                    onClick={handleConfirmSubmit}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl"
                  >
                    NỘP BÀI
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default TestTopicPage