"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Plus, ArrowLeft, BookOpen, FileText, Trash2, ChevronRight, Eye } from "lucide-react"

interface Question {
  id: string
  text: string
  type: "multiple_choice" | "true_false"
  difficulty: "easy" | "medium" | "hard"
  answers: number
}

interface TopicFormData {
  name: string
  status: string
  description: string
  subtopics: string[]
  questions: Question[]
}

export function CreateTopicPageComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<"subtopics" | "tests">("subtopics")

  // Form state
  const [formData, setFormData] = useState<TopicFormData>({
    name: "",
    status: "pending",
    description: "",
    subtopics: [],
    questions: [],
  })

  // Sample questions data for demo
  const sampleQuestions: Question[] = [
    { id: "q1", text: "Đây là quả gì ?", type: "multiple_choice", difficulty: "easy", answers: 4 },
    { id: "q2", text: "Đây là cái gì ?", type: "multiple_choice", difficulty: "medium", answers: 3 },
    { id: "q3", text: "Hành động này nói lên điều gì ?", type: "multiple_choice", difficulty: "hard", answers: 4 },
  ]

  // Toggle to show sample questions or not
  const [showSampleQuestions, setShowSampleQuestions] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddSubtopic = () => {
    console.log("Add subtopic")
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên chủ đề!")
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      alert("Thêm chủ đề thành công!")
      setFormData({
        name: "",
        status: "pending",
        description: "",
        subtopics: [],
        questions: [],
      })
      router.push("/list-topics")
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  // Question management functions
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300"
      case "medium":
        return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border-orange-300"
      case "hard":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-300"
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "DỄ"
      case "medium":
        return "TRUNG BÌNH"
      case "hard":
        return "KHÓ"
      default:
        return "KHÔNG XÁC ĐỊNH"
    }
  }

  const handleQuestionClick = (questionId: string) => {
    router.push(`/test-question-details?id=${questionId}&topicId=#73003`)
  }

  const handleAddQuestion = () => {
    router.push(`/add-question?topicId=#73003`)
  }

  const handleDeleteQuestion = (questionId: string) => {
    console.log("Delete question:", questionId)
  }

  // For demo purposes - toggle sample questions
  const toggleSampleQuestions = () => {
    setShowSampleQuestions(!showSampleQuestions)
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
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 leading-relaxed">
              THÊM CHỦ ĐỀ
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
          </div>

          {/* Form Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>

            <div className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-10 max-w-4xl mx-auto">
              {/* Form Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-3 leading-relaxed">
                  CHI TIẾT CHỦ ĐỀ
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-3"></div>
              </div>

              {/* Topic Information Fields */}
              <div className="space-y-6 mb-8">
                {/* Topic Name */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <FileText className="w-4 h-4 text-blue-500" />
                    TÊN CHỦ ĐỀ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Nhập tên chủ đề..."
                      className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-blue-300"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Status and Description in a row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      TRẠNG THÁI <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                        <SelectTrigger className="h-14 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm focus:border-blue-500 group-hover:border-blue-300 transition-all duration-300">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-blue-200 shadow-xl">
                          <SelectItem value="active">HOẠT ĐỘNG</SelectItem>
                          <SelectItem value="pending">ĐANG KIỂM DUYỆT</SelectItem>
                          <SelectItem value="rejected">BỊ TỪ CHỐI</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">MÔ TẢ</label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Nhập mô tả chủ đề (tùy chọn)..."
                        className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-blue-300"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-8">
                <div className="flex gap-2">
                  <Button
                    onClick={() => setActiveTab("subtopics")}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                      activeTab === "subtopics"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "bg-white/60 text-gray-600 hover:bg-white/80"
                    }`}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    CHỦ ĐỀ PHỤ
                  </Button>
                  <Button
                    onClick={() => setActiveTab("tests")}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                      activeTab === "tests"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "bg-white/60 text-gray-600 hover:bg-white/80"
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    BÀI KIỂM TRA
                  </Button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="mb-8">
                {activeTab === "subtopics" && (
                  <div className="relative">
                    <div className="min-h-64 p-8 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                      <Button
                        onClick={handleAddSubtopic}
                        className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Plus className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">THÊM CHỦ ĐỀ PHỤ</span>
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === "tests" && (
                  <div className="relative">
                    <div className="min-h-64 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm">
                      {!showSampleQuestions ? (
                        // Empty state - centered button
                        <div className="p-8 flex flex-col items-center justify-center h-64">
                          <Button
                            onClick={handleAddQuestion}
                            className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Plus className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">THÊM CÂU HỎI</span>
                          </Button>

                          {/* For demo purposes only - toggle sample questions */}
                          <Button onClick={toggleSampleQuestions} variant="link" className="mt-4 text-blue-500 text-sm">
                            (Demo: Hiển thị câu hỏi mẫu)
                          </Button>
                        </div>
                      ) : (
                        // Questions list
                        <div className="p-6">
                          {/* Header with Add Button */}
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-700">
                              CÂU HỎI KIỂM TRA ({sampleQuestions.length})
                            </h3>
                            <Button
                              onClick={handleAddQuestion}
                              className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <Plus className="w-5 h-5 relative z-10" />
                              <span className="relative z-10">THÊM CÂU HỎI</span>
                            </Button>
                          </div>

                          {/* Questions List */}
                          <div className="space-y-3">
                            {sampleQuestions.map((question, index) => (
                              <div
                                key={question.id}
                                className="group relative bg-gradient-to-r from-white to-blue-50/30 rounded-2xl border border-blue-200/50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                                onClick={() => handleQuestionClick(question.id)}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                                      </div>

                                      <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                          <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors duration-300">
                                            {question.text}
                                          </span>
                                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                                        </div>

                                        <div className="flex items-center gap-3">
                                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                                            {question.type === "multiple_choice" ? "Trắc nghiệm" : "Đúng/Sai"}
                                          </span>
                                          <span
                                            className={`px-2 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(question.difficulty)}`}
                                          >
                                            {getDifficultyText(question.difficulty)}
                                          </span>
                                          <span className="text-xs text-gray-500">{question.answers} đáp án</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleQuestionClick(question.id)
                                        }}
                                        size="sm"
                                        className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl border border-blue-200"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDeleteQuestion(question.id)
                                        }}
                                        size="sm"
                                        className="bg-red-100 hover:bg-red-200 text-red-600 rounded-xl border border-red-200"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* For demo purposes only - toggle sample questions */}
                          <div className="mt-6 text-center">
                            <Button onClick={toggleSampleQuestions} variant="link" className="text-blue-500 text-sm">
                              (Demo: Ẩn câu hỏi mẫu)
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-6 justify-center">
                <Button
                  onClick={handleGoBack}
                  disabled={isSubmitting}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ArrowLeft className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">QUAY LẠI</span>
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                      <span className="relative z-10">ĐANG THÊM...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">THÊM CHỦ ĐỀ</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Required fields note */}
              <div className="text-center mt-6">
                <p className="text-xs text-gray-500 font-medium">
                  <span className="text-red-500">*</span> Các trường bắt buộc
                </p>
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

export default CreateTopicPageComponent
