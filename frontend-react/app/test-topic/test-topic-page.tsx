"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter, useSearchParams } from "next/navigation"
import { testService, TestQuestion, TestAnswer, TestSubmissionRequest } from "@/app/services/testService"
import authService from "@/app/services/auth.service"
import { LoginModal } from "@/components/login-modal"
import { jwtDecode } from 'jwt-decode'

export function TestTopicPage() {
  console.log("=== TestTopicPage rendered ===");
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = searchParams.get("testId")
  const topicId = searchParams.get("topicId")
  
  // Get actual user ID from authentication service
  const [userId, setUserId] = useState<string>("1")

  console.log("URL params:", { testId, topicId });

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

  // Get user ID from authentication service
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

  // Load test questions when component mounts
  useEffect(() => {
    console.log("useEffect triggered");
    console.log("useEffect dependencies:", { topicId, userId });
    const loadTestQuestions = async () => {
      console.log("loadTestQuestions started");
      
      // Check authentication first
      if (!authService.isAuthenticated()) {
        console.log("User not authenticated, showing login modal");
        setShowLoginModal(true)
        setLoading(false)
        return
      }
      
      if (!topicId) {
        console.log("No topicId provided");
        setError("Topic ID is required")
        setLoading(false)
        return
      }

      try {
        console.log("Calling testService.generateTest with:", { userId: parseInt(userId), topicId: parseInt(topicId) });
        setLoading(true)
        const questions = await testService.generateTest(parseInt(userId), parseInt(topicId))
        console.log("Received questions:", questions);
        console.log("Questions length:", questions.length);
        setTestQuestions(questions)
        setLoading(false)
        console.log("Test questions loaded successfully");
      } catch (err: any) {
        console.error("Error loading test questions:", err)
        
        // Handle authentication errors
        if (err.message?.includes('Authentication required') || err.message?.includes('Network Error')) {
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

  // Debug: Log state changes
  useEffect(() => {
    console.log("State changed - loading:", loading, "error:", error, "questions count:", testQuestions.length);
  }, [loading, error, testQuestions.length])

  // Debug: Test useEffect with empty dependencies
  useEffect(() => {
    console.log("Component mounted - testing useEffect");
  }, [])

  // Function để mark test completed
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
        type: question.type
      });
    }
    return question
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

  const handleConfirmSubmit = async () => {
    try {
      // Prepare answers for submission
      const testAnswers: TestAnswer[] = testQuestions.map((question) => ({
        questionId: question.id,
        answer: answers[question.id] || "",
        questionType: question.type,
      }))

      // Calculate score
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

      // Submit to backend
      const submissionRequest: TestSubmissionRequest = {
        userId: parseInt(userId),
        topicId: parseInt(topicId!),
        answers: testAnswers,
        score: score,
      }

      const result = await testService.submitTest(submissionRequest)
      setNextTopicInfo(result.nextTopic)

      // Set detailed test results for review
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

      // Get topic name for test results
      let topicName = "Chủ đề hiện tại";
      try {
        topicName = await testService.getTopicName(parseInt(topicId!));
      } catch (error) {
        console.error("Error getting topic name:", error);
      }

      setTestResults({
        totalQuestions: testQuestions.length,
        correctAnswers: correctAnswers,
        accuracy: score,
        questions: questionResults,
        topicName: topicName,
        topicId: parseInt(topicId!)
      })

      setTestScore(score)
      setShowSubmitConfirm(false)
      // Lưu kết quả vào sessionStorage và chuyển sang trang kết quả
      sessionStorage.setItem("testResults", JSON.stringify({
        totalQuestions: testQuestions.length,
        correctAnswers: correctAnswers,
        accuracy: score,
        questions: questionResults,
        topicName: topicName,
        topicId: parseInt(topicId!)
      }))
      router.push("/test-result")

      // Mark as completed if passed
      if (score >= 90 && testId) {
        markCompleted(testId)
      }

      // Sau khi nhận được testResults (kết quả bài test)
      // Lưu lịch sử vào localStorage
      try {
        const historyKey = "testHistory";
        let history: any[] = [];
        const raw = localStorage.getItem(historyKey);
        if (raw) history = JSON.parse(raw);
        history.push({
          ...testResults,
          timestamp: Date.now()
        });
        localStorage.setItem(historyKey, JSON.stringify(history));
      } catch (e) {
        console.warn("Không thể lưu lịch sử bài test:", e);
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
    setShowResultPage(false)
    setTestScore(0)
    setTestResults(null)
    setNextTopicInfo(null)
  }

  const handleContinueFromResult = () => {
    if (testId) {
      markCompleted(testId)
    }
    router.push("/homepage")
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

  const handleGoToFeedback = () => {
    router.push(`/feedback?topicId=${topicId}&fromTestResult=1`)
  }

  const handleShowReview = () => {
    // Save test results to sessionStorage for review page
    if (testResults) {
      sessionStorage.setItem("testResults", JSON.stringify(testResults))
      router.push("/test-review")
    }
  }

  const getCurrentAnswer = () => {
    const answer = answers[currentQuestion?.id];
    // For true/false questions, return boolean or undefined
    if (currentQuestion?.type === "true-false") {
      return answer === true || answer === false ? answer : undefined;
    }
    return answer || "";
  }

  // Debug: Log current answer for true/false questions
  useEffect(() => {
    if (currentQuestion?.type === "true-false") {
      console.log("Current answer:", getCurrentAnswer(), "Type:", typeof getCurrentAnswer());
    }
  }, [currentQuestion, answers]);

  const getExplanationForQuestion = (questionId: number) => {
    // Add explanations for questions
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
    // Redirect back to homepage if user closes the modal
    router.push("/homepage")
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Đang tải bài kiểm tra...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <Button onClick={() => router.push("/homepage")} className="bg-blue-500 hover:bg-blue-600 text-white">
            Về trang chủ
          </Button>
        </div>
      </div>
    )
  }

  // Main test interface
  return (
    <div className="min-h-screen bg-blue-100 relative overflow-hidden">
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Submit Button - Top Right Corner */}
      {currentQuestionIndex < testQuestions.length - 1 && (
        <div className="fixed top-20 right-4 z-20">
          <Button
            onClick={handleSubmitTest}
            className="bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 hover:shadow-lg shadow-md"
          >
            NỘP BÀI
          </Button>
        </div>
      )}

      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-blue-200 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Câu {currentQuestionIndex + 1} / {testQuestions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Có thể nộp bài bất cứ lúc nào</span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round(((currentQuestionIndex + 1) / testQuestions.length) * 100)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / testQuestions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          {currentQuestion && (
            <div className="bg-white rounded-2xl shadow-2xl border-4 border-blue-100 p-6 mb-6">
              {/* Question Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {currentQuestion.question}
                </h2>
                <div className="text-sm text-gray-600">
                  {currentQuestion.type === "multiple-choice" && "Chọn đáp án đúng"}
                  {currentQuestion.type === "true-false" && "Đúng hay Sai"}
                  {currentQuestion.type === "essay" && "Điền đáp án"}
                </div>
              </div>

              {/* Media Content */}
              <div className="flex justify-center mb-6">
                <div className="relative w-64 h-64 bg-gray-100 rounded-xl overflow-hidden">
                  {currentQuestion.videoUrl && (currentQuestion.videoUrl.includes('.mp4') || currentQuestion.videoUrl.includes('storage.googleapis.com')) ? (
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
                      src={currentQuestion.imageUrl}
                      alt="Question image"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-4">
                {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerChange(currentQuestion.id, option)}
                        className={`p-4 rounded-xl border-2 text-left font-medium transition-all hover:scale-[1.02] ${
                          getCurrentAnswer() === option
                            ? "bg-blue-100 border-blue-400 text-blue-800"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
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
                      className={`p-4 rounded-xl border-2 text-center font-bold transition-all hover:scale-[1.02] ${
                        getCurrentAnswer() === true
                          ? "bg-blue-100 border-blue-400 text-blue-800"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      ĐÚNG
                    </button>
                    <button
                      onClick={() => handleAnswerChange(currentQuestion.id, false)}
                      className={`p-4 rounded-xl border-2 text-center font-bold transition-all hover:scale-[1.02] ${
                        getCurrentAnswer() === false
                          ? "bg-blue-100 border-blue-400 text-blue-800"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      SAI
                    </button>
                  </div>
                )}

                {currentQuestion.type === "essay" && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 font-medium">
                      {currentQuestion.essayPrompt}
                    </div>
                    <Textarea
                      value={getCurrentAnswer()}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      placeholder="Nhập đáp án của bạn..."
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-full transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              TRƯỚC
            </Button>

            {currentQuestionIndex === testQuestions.length - 1 ? (
              <Button
                onClick={handleSubmitTest}
                className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:shadow-lg"
              >
                NỘP BÀI
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:shadow-lg"
              >
                TIẾP THEO
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Xác nhận nộp bài</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn nộp bài kiểm tra? Không thể thay đổi sau khi nộp.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700"
              >
                HỦY
              </Button>
              <Button
                onClick={handleConfirmSubmit}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                NỘP BÀI
              </Button>
            </div>
          </div>
        </div>
      )}

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

export default TestTopicPage