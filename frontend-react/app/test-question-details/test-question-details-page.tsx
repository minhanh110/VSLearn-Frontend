"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save, ArrowLeft, HelpCircle, Video, CheckCircle, XCircle, Trash2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface Answer {
  id: string
  text: string
  isCorrect: boolean
}

export function TestQuestionDetailsPageComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const questionId = searchParams.get("id") || "q1"
  const topicId = searchParams.get("topicId") || "#73003"

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [questionText, setQuestionText] = useState("Đây là quả gì ?")
  const [questionType, setQuestionType] = useState("multiple_choice")
  const [videoLink, setVideoLink] = useState("")

  const [answers, setAnswers] = useState<Answer[]>([
    { id: "a1", text: "QUẢ TÁO", isCorrect: true },
    { id: "a2", text: "QUẢ KHẾ", isCorrect: false },
    { id: "a3", text: "QUẢ DƯA", isCorrect: false },
  ])

  const handleAddAnswer = () => {
    const newAnswer: Answer = {
      id: `a${answers.length + 1}`,
      text: "",
      isCorrect: false,
    }
    setAnswers([...answers, newAnswer])
  }

  const handleRemoveAnswer = (id: string) => {
    if (answers.length > 2) {
      setAnswers(answers.filter((answer) => answer.id !== id))
    }
  }

  const handleAnswerChange = (id: string, text: string) => {
    setAnswers(answers.map((answer) => (answer.id === id ? { ...answer, text } : answer)))
  }

  const handleCorrectAnswerChange = (id: string) => {
    setAnswers(
      answers.map((answer) => (answer.id === id ? { ...answer, isCorrect: true } : { ...answer, isCorrect: false })),
    )
  }

  const handleSave = () => {
    console.log("Save question:", { questionText, questionType, videoLink, answers })
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-200/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-40 left-16 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-300/25 rounded-full blur-xl animate-bounce"></div>

        {/* Sparkle stars */}
        <div className="absolute top-32 left-1/4 w-6 h-6 text-blue-400 animate-pulse">✨</div>
        <div className="absolute top-48 right-1/4 w-5 h-5 text-cyan-400 animate-bounce">⭐</div>
        <div className="absolute bottom-48 left-1/3 w-4 h-4 text-indigo-400 animate-pulse">💫</div>
        <div className="absolute bottom-36 right-1/3 w-6 h-6 text-blue-400 animate-bounce">✨</div>
      </div>

      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 leading-relaxed">
              THÔNG TIN CÂU HỎI KIỂM TRA
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
          </div>

          {/* Question Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8">
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4 shadow-lg">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-2">
                  CHI TIẾT CÂU HỏI
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
              </div>

              <div className="space-y-6">
                {/* Question Text */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    CÂU HỎI <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      className="w-full min-h-[100px] border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 resize-none group-hover:border-blue-300"
                      placeholder="Nhập nội dung câu hỏi..."
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Question Type and Video Link Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Question Type */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3">DẠNG:</label>
                    <div className="relative">
                      <Select value={questionType} onValueChange={setQuestionType}>
                        <SelectTrigger className="h-12 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm focus:border-blue-500 group-hover:border-blue-300 transition-all duration-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-blue-200 shadow-xl">
                          <SelectItem value="multiple_choice">TRẮC NGHIỆM</SelectItem>
                          <SelectItem value="true_false">ĐÚNG/SAI</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Video Link */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <Video className="w-4 h-4 text-blue-500" />
                      LINK VIDEO:
                    </label>
                    <div className="relative">
                      <Input
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        className="h-12 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 group-hover:border-blue-300"
                        placeholder="Nhập link video (tùy chọn)..."
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>

                {/* Answers */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-bold text-gray-700">ĐÁP ÁN</label>
                    <Button
                      onClick={handleAddAnswer}
                      className="group relative flex items-center gap-2 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Plus className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">THÊM CÂU TRẢ LỜI</span>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {answers.map((answer, index) => (
                      <div
                        key={answer.id}
                        className="group relative bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-blue-200/60 hover:border-blue-300 transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative p-4">
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={answer.isCorrect}
                              onChange={() => handleCorrectAnswerChange(answer.id)}
                              className="w-5 h-5 text-blue-600 border-2 border-blue-300 focus:ring-blue-500 focus:ring-2"
                            />
                            <Input
                              value={answer.text}
                              onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                              className="flex-1 h-10 border border-blue-200 rounded-xl bg-white/90 focus:border-blue-500 transition-all duration-300"
                              placeholder={`Đáp án ${index + 1}...`}
                            />
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                  answer.isCorrect
                                    ? "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300"
                                    : "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-300"
                                }`}
                              >
                                {answer.isCorrect ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 inline mr-1" /> ĐÚNG
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 inline mr-1" /> SAI
                                  </>
                                )}
                              </span>
                              {answers.length > 2 && (
                                <Button
                                  onClick={() => handleRemoveAnswer(answer.id)}
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-all duration-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-6 justify-center pt-6">
                  <Button
                    onClick={handleCancel}
                    className="group relative flex items-center gap-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <ArrowLeft className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">HỦY BỎ</span>
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Save className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">CHỈNH SỬA</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default TestQuestionDetailsPageComponent
