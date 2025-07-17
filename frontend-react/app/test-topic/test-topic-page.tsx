"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter, useSearchParams } from "next/navigation"
import { testService, type TestQuestion, type TestAnswer, type TestSubmissionRequest } from "@/app/services/testService"
import authService from "@/app/services/auth.service"
import { LoginModal } from "@/components/login-modal"
import { jwtDecode } from "jwt-decode"

interface TestTopicPageProps {
  testId?: string
  topicId?: string
}

export function TestTopicPage({ testId: propTestId, topicId: propTopicId }: TestTopicPageProps) {
  console.log("=== TestTopicPage rendered ===")

  const router = useRouter()
  const searchParams = useSearchParams()

  const testId = propTestId || searchParams.get("testId")
  const topicId = propTopicId || searchParams.get("topicId")

  const [userId, setUserId] = useState<string>("1")

  console.log("URL params:", { testId, topicId })

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: any }>({})
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [showResultPage, setShowResultPage] = useState(false)
  const [testScore, setTestScore] = useState(0)
  const [testResults, setTestResults] = useState<any>(null)
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nextTopicInfo, setNextTopicInfo] = useState<any>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const token = authService.getCurrentToken()
        if (token) {
          const decoded = jwtDecode(token) as any
          if (decoded && decoded.id) {
            setUserId(decoded.id.toString())
            console.log("Current user ID from token:", decoded.id)
          } else {
            console.log("No user ID in token, using default ID: 1")
          }
        } else {
          console.log("No token found, using default ID: 1")
        }
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }

    getCurrentUserId()
  }, [])

  useEffect(() => {
    console.log("useEffect triggered")
    console.log("useEffect dependencies:", { topicId, userId })
    const loadTestQuestions = async () => {
      console.log("loadTestQuestions started")

      if (!authService.isAuthenticated()) {
        console.log("User not authenticated, showing login modal")
        setShowLoginModal(true)
        setLoading(false)
        return
      }

      if (!topicId) {
        console.log("No topicId provided")
        setError("Topic ID is required")
        setLoading(false)
        return
      }

      try {
        console.log("Calling testService.generateTest with:", {
          userId: Number.parseInt(userId),
          topicId: Number.parseInt(topicId),
        })
        setLoading(true)
        const questions = await testService.generateTest(Number.parseInt(userId), Number.parseInt(topicId))
        console.log("Received questions:", questions)
        console.log("Questions length:", questions.length)
        setTestQuestions(questions)
        setLoading(false)
        console.log("Test questions loaded successfully")
      } catch (err: any) {
        console.error("Error loading test questions:", err)

        if (err.message?.includes("Authentication required") || err.message?.includes("Network Error")) {
          setError("Vui lòng đăng nhập để tiếp tục")
          setShowLoginModal(true)
        } else {
          setError("Failed to load test questions")
        }
        setLoading(false)
      }
    }

    loadTestQuestions()
  }, [topicId, userId])

  useEffect(() => {
    console.log("State changed - loading:", loading, "error:", error, "questions count:", testQuestions.length)
  }, [loading, error, testQuestions.length])

  useEffect(() => {
    console.log("Component mounted - testing useEffect")
  }, [])

  const markCompleted = (id: string) => {
    const completedEvent = new CustomEvent("lessonCompleted", {
      detail: { lessonId: Number.parseInt(id) },
    })
    window.dispatchEvent(completedEvent)
  }

  const currentQuestion = useMemo(() => {
    const question = testQuestions[currentQuestionIndex]
    if (question) {
      console.log("Current question:", {
        id: question.id,
        videoUrl: question.videoUrl,
        imageUrl: question.imageUrl,
        type: question.type,
      })
    }
    return question
  }, [testQuestions, currentQuestionIndex])

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

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

  const handleSubmitTest = () => {
    setShowSubmitConfirm(true)
  }

  const handleConfirmSubmit = async () => {
    try {
      const testAnswers: TestAnswer[] = testQuestions.map((question) => ({
        questionId: question.id,
        answer: answers[question.id] || "",
        questionType: question.type,
      }))

      let correctAnswers = 0
      testQuestions.forEach((question) => {
        const userAnswer = answers[question.id]
        if (question.type === "multiple-choice" && userAnswer === question.correctAnswer) {
          correctAnswers++
        } else if (question.type === "true-false" && userAnswer === question.trueFalseAnswer) {
          correctAnswers++
        } else if (question.type === "essay" && userAnswer && userAnswer.trim().length > 0) {
          correctAnswers++
        }
      })

      const score = Math.round((correctAnswers / testQuestions.length) * 100)

      const submissionRequest: TestSubmissionRequest = {
        userId: Number.parseInt(userId),
        topicId: Number.parseInt(topicId!),
        answers: testAnswers,
        score: score,
      }

      const result = await testService.submitTest(submissionRequest)
      setNextTopicInfo(result.nextTopic)

      const questionResults = testQuestions.map((question) => {
        const userAnswer = answers[question.id]
        let isCorrect = false

        if (question.type === "multiple-choice" && userAnswer === question.correctAnswer) {
          isCorrect = true
        } else if (question.type === "true-false" && userAnswer === question.trueFalseAnswer) {
          isCorrect = true
        } else if (question.type === "essay" && userAnswer && userAnswer.trim().length > 0) {
          isCorrect = true
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

      let topicName = "Chủ đề hiện tại"
      try {
        topicName = await testService.getTopicName(Number.parseInt(topicId!))
      } catch (error) {
        console.error("Error getting topic name:", error)
      }

      setTestResults({
        totalQuestions: testQuestions.length,
        correctAnswers: correctAnswers,
        accuracy: score,
        questions: questionResults,
        topicName: topicName,
        topicId: Number.parseInt(topicId!),
      })

      setTestScore(score)
      setShowSubmitConfirm(false)

      setShowResultPage(true)

      if (score >= 90 && testId) {
        markCompleted(testId)
      }
    } catch (error) {
      console.error("Error submitting test:", error)
      setError("Failed to submit test")
      setShowSubmitConfirm(false)
    }
  }

  const handleRetakeTest = () => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setShowResultPage(false) // Hide the result popup
    setTestScore(0)
    setTestResults(null)
    setNextTopicInfo(null)
  }

  const handleContinueFromResult = () => {
    // This function is now for the "TIẾP TỤC" button in the success popup
    // It should navigate to the next topic or homepage
    if (nextTopicInfo && nextTopicInfo.isAvailable) {
      router.push(`/lesson/${nextTopicInfo.topicId}/subtopic/${nextTopicInfo.id}`)
    } else {
      router.push("/homepage")
    }
    sessionStorage.removeItem("testResults") // Clear results after continuing
  }

    const handleGoToNextTopic = async () => {
    if (nextTopicInfo && nextTopicInfo.isAvailable) {
      try {
        // Get the first subtopic of the next topic
        const nextSubtopic = await testService.getNextSubtopic(nextTopicInfo.id);
        if (nextSubtopic && nextSubtopic.isAvailable) {
          // Navigate to the first subtopic of the next topic
          router.push(`/lesson/${nextSubtopic.topicId}/subtopic/${nextSubtopic.id}`)
        } else {
          router.push("/homepage")
        }
      } catch (error) {
        console.error("Error getting next subtopic:", error)
        router.push("/homepage")
      }
    } else {
      router.push("/homepage")
    }
  }
  const handleCloseResultPopup = () => {
    // This function is for the "ĐÓNG" button in the failure popup
    sessionStorage.removeItem("testResults") // Clear results after closing
    router.push("/homepage")
  }

  const handleGoToFeedback = () => {
    sessionStorage.setItem("testResults", JSON.stringify(testResults)) // Save results for feedback page
    router.push(`/feedback?topicId=${topicId}`)
  }

  const handleShowReview = () => {
    if (testResults) {
      sessionStorage.setItem("testResults", JSON.stringify(testResults))
      router.push("/test-review")
    }
  }

  const getCurrentAnswer = () => {
    const answer = answers[currentQuestion?.id]
    if (currentQuestion?.type === "true-false") {
      return answer === true || answer === false ? answer : undefined
    }
    return answer || ""
  }

  useEffect(() => {
    if (currentQuestion?.type === "true-false") {
      console.log("Current answer:", getCurrentAnswer(), "Type:", typeof getCurrentAnswer())
    }
  }, [currentQuestion, answers])

  const getExplanationForQuestion = (questionId: number) => {
    const explanations: { [key: number]: string } = {
      1: "Đây là từ vựng cơ bản về chủ đề này",
      2: "Từ này thường được sử dụng trong giao tiếp hàng ngày",
      3: "Hãy chú ý đến ngữ cảnh sử dụng",
      4: "Đây là một từ quan trọng trong chủ đề này",
      5: "Từ này có ý nghĩa đặc biệt trong văn hóa",
      6: "Hãy ghi nhớ hành động này chính xác",
    }
    return explanations[questionId] || "Hãy ôn tập lại từ vựng này"
  }

  const handleCloseLoginModal = () => {
    setShowLoginModal(false)
    router.push("/homepage")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Đang tải bài kiểm tra...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <Button onClick={() => router.push("/homepage")} className="bg-blue-500 hover:bg-blue-600 text-white">
            Về trang chủ
          </Button>
        </div>
      </div>
    )
  }

  const isPassed = testScore >= 90 // Determine pass/fail for the popup

  // Result page
  if (showResultPage) {
    return (
      <div className="min-h-screen bg-blue-100 relative overflow-hidden">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

        <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
          <div className="max-w-2xl mx-auto">
            {/* Result Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-blue-700 mb-4">
                KẾT QUẢ BÀI KIỂM TRA
              </h1>

              {/* Score Display */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200 mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">{testScore}%</div>
                <div className="text-lg text-gray-600 mb-4">
                  {testScore >= 90 ? "🎉 CHÚC MỪNG! Bạn đã hoàn thành xuất sắc!" : "Cần cố gắng thêm!"}
                </div>
                
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
                onClick={handleShowReview}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl"
              >
                XEM LẠI BÀI KIỂM TRA
              </Button>

              <Button
                onClick={handleGoToFeedback}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-xl"
              >
                GỬI PHẢN HỒI
              </Button>

              {testScore >= 90 && nextTopicInfo && nextTopicInfo.isAvailable ? (
                <>
                  <Button
                    onClick={handleGoToNextTopic}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl"
                  >
                    HỌC TIẾP TOPIC: {nextTopicInfo.topicName}
                  </Button>
                  <Button
                    onClick={handleContinueFromResult}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-4 rounded-xl"
                  >
                    VỀ TRANG CHỦ
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleRetakeTest}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl"
                  >
                    LÀM LẠI BÀI KIỂM TRA
                  </Button>
                  <Button
                    onClick={handleContinueFromResult}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-4 rounded-xl"
                  >
                    VỀ TRANG CHỦ
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

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

  // Main test interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden">
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {currentQuestionIndex < testQuestions.length - 1 && (
        <div className="fixed top-24 right-4 lg:top-32 lg:right-8 z-20">
          <Button
            onClick={handleSubmitTest}
            className="bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-2.5 px-5 lg:py-3 lg:px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            NỘP BÀI
          </Button>
        </div>
      )}

      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar - Removed solid white background */}
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-blue-200 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm sm:text-base font-semibold text-blue-700">
                Câu {currentQuestionIndex + 1} / {testQuestions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-500">Có thể nộp bài bất cứ lúc nào</span>
                <span className="text-sm sm:text-base font-semibold text-blue-700">
                  {Math.round(((currentQuestionIndex + 1) / testQuestions.length) * 100)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / testQuestions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {currentQuestion && (
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-3xl shadow-3xl border-4 border-blue-200 p-6 sm:p-8 mb-6">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-2">{currentQuestion.question}</h2>
                <div className="text-sm sm:text-base text-blue-600">
                  {currentQuestion.type === "multiple-choice" && "Chọn đáp án đúng"}
                  {currentQuestion.type === "true-false" && "Đúng hay Sai"}
                  {currentQuestion.type === "essay" && "Điền đáp án"}
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <div className="relative w-full max-w-[250px] h-[250px] sm:max-w-[300px] sm:h-[300px] md:max-w-[350px] md:h-[350px] bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-2xl overflow-hidden border-4 border-blue-300 shadow-lg">
                  <div className="absolute top-4 left-4 w-6 h-6 text-yellow-400">⭐</div>
                  <div className="absolute top-4 right-4 w-5 h-5 text-blue-400">⭐</div>
                  <div className="absolute bottom-4 left-4 w-5 h-5 text-green-400">⭐</div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 text-purple-400">⭐</div>

                  {currentQuestion.videoUrl &&
                  (currentQuestion.videoUrl.includes(".mp4") ||
                    currentQuestion.videoUrl.includes("storage.googleapis.com")) ? (
                    <video
                      src={currentQuestion.videoUrl}
                      controls
                      className="w-full h-full object-cover rounded-xl"
                      autoPlay
                      muted
                      loop
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={currentQuestion.imageUrl || "/placeholder.svg"}
                      alt="Question image"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerChange(currentQuestion.id, option)}
                        className={`p-3 sm:p-4 rounded-2xl border-2 text-center font-semibold transition-all hover:scale-[1.02] shadow-md hover:shadow-lg text-sm sm:text-base ${
                          getCurrentAnswer() === option
                            ? "bg-blue-200 border-blue-500 text-blue-800"
                            : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "true-false" && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleAnswerChange(currentQuestion.id, true)}
                      className={`p-3 sm:p-4 rounded-2xl border-2 text-center font-bold transition-all hover:scale-[1.02] shadow-md hover:shadow-lg text-sm sm:text-base ${
                        getCurrentAnswer() === true
                          ? "bg-blue-200 border-blue-500 text-blue-800"
                          : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      ĐÚNG
                    </button>
                    <button
                      onClick={() => handleAnswerChange(currentQuestion.id, false)}
                      className={`p-3 sm:p-4 rounded-2xl border-2 text-center font-bold transition-all hover:scale-[1.02] shadow-md hover:shadow-lg text-sm sm:text-base ${
                        getCurrentAnswer() === false
                          ? "bg-blue-200 border-blue-500 text-blue-800"
                          : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      SAI
                    </button>
                  </div>
                )}

                {currentQuestion.type === "essay" && (
                  <div className="space-y-4">
                    <div className="text-sm sm:text-base text-blue-600 font-medium">{currentQuestion.essayPrompt}</div>
                    <Textarea
                      value={getCurrentAnswer()}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      placeholder="Nhập đáp án của bạn..."
                      className="min-h-[100px] sm:min-h-[150px] resize-none border-2 border-blue-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 sm:p-4 text-base"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-blue-200 hover:bg-blue-300 text-blue-700 font-bold py-3.5 px-7 rounded-full transition-all duration-200 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              TRƯỚC
            </Button>

            {currentQuestionIndex === testQuestions.length - 1 ? (
              <Button
                onClick={handleSubmitTest}
                className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3.5 px-7 rounded-full transition-all duration-200 shadow-md hover:shadow-xl"
              >
                NỘP BÀI
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 px-7 rounded-full transition-all duration-200 shadow-md hover:shadow-xl"
              >
                TIẾP THEO
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xs sm:max-w-md mx-4 text-center shadow-xl border-4 border-blue-200">
            {/* Mascot */}
            <div className="flex justify-center mb-4">
              <Image
                src="/images/test-nopbai.png"
                alt="Whale with question mark"
                width={120}
                height={120}
                className="object-contain animate-bounce"
              />
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-blue-800 mb-6">BẠN MUỐN NỘP BÀI ?</h3>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 bg-gradient-to-r from-blue-300 to-cyan-300 hover:from-blue-400 hover:to-cyan-400 text-white font-bold py-3 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                QUAY VỀ
              </Button>
              <Button
                onClick={handleConfirmSubmit}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                NỘP BÀI
              </Button>
            </div>
          </div>
        </div>
      )}

      {showResultPage && testResults && (
        <>
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
                    width={96} // Base size for Image component
                    height={96} // Base size for Image component
                    className="object-contain animate-bounce w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24" // Responsive rendered size
                  />
                </div>

                {/* Main Title */}
                <h1 className={`text-lg sm:text-xl font-bold mb-1 ${isPassed ? "text-blue-800" : "text-red-700"}`}>
                  {isPassed ? "CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH !" : "ÔI, KHÔNG !"}
                </h1>
                {/* Subtitle */}
                <p className={`text-xs sm:text-sm font-semibold mb-2 ${isPassed ? "text-blue-600" : "text-gray-600"}`}>
                  {isPassed ? "BẠN ĐÃ VƯỢT QUA BÀI KIỂM TRA" : "BẠN ĐÃ KHÔNG VƯỢT QUA BÀI KIỂM TRA"}
                  <br />
                  {testResults.topicName ? `"${testResults.topicName.toUpperCase()}"` : ""}
                </p>

                {/* Score Display */}
                <div
                  className={`rounded-3xl p-3 sm:p-5 shadow-xl border-2 mb-3 ${
                    isPassed ? "bg-blue-100/80 border-blue-200" : "bg-red-100/80 border-red-200"
                  }`}
                >
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center">
                      <div
                        className={`text-2xl sm:text-3xl font-bold mb-0.5 ${isPassed ? "text-blue-700" : "text-red-700"}`}
                      >
                        {testResults.totalQuestions}
                      </div>
                      <div
                        className={`text-sm sm:text-base font-medium ${isPassed ? "text-blue-600" : "text-red-600"}`}
                      >
                        TỪ VỰNG
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl sm:text-3xl font-extrabold mb-0.5 ${isPassed ? "text-blue-700" : "text-red-700"}`}
                      >
                        {testResults.accuracy}%
                      </div>
                      <div
                        className={`text-sm sm:text-base font-medium ${isPassed ? "text-blue-600" : "text-red-600"}`}
                      >
                        ĐỘ CHÍNH XÁC
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleShowReview}
                    className={`w-full font-bold py-2.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-sm ${
                      isPassed
                        ? "bg-blue-300 hover:bg-blue-400 text-blue-700"
                        : "bg-pink-300 hover:bg-pink-400 text-pink-800"
                    }`}
                  >
                    XEM LẠI BÀI
                  </Button>

                  <Button
                    onClick={handleGoToFeedback}
                    className={`w-full font-bold py-2.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-sm ${
                      isPassed
                        ? "bg-blue-300 hover:bg-blue-400 text-blue-700"
                        : "bg-pink-300 hover:bg-pink-400 text-pink-800"
                    }`}
                  >
                    PHẢN HỒI
                  </Button>

                  <Button
                    onClick={handleRetakeTest}
                    className={`w-full font-bold py-2.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-sm ${
                      isPassed
                        ? "bg-blue-300 hover:bg-blue-400 text-blue-700"
                        : "bg-pink-300 hover:bg-pink-400 text-pink-800"
                    }`}
                  >
                    LÀM LẠI
                  </Button>

                  {isPassed ? (
                    <Button
                      onClick={handleContinueFromResult}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                    >
                      TIẾP TỤC
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCloseResultPopup}
                      className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                    >
                      ĐÓNG
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <LoginModal isOpen={showLoginModal} onClose={handleCloseLoginModal} returnUrl={window.location.href} />
    </div>
  )
}

export default TestTopicPage
