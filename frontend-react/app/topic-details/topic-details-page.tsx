"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Ban, BookOpen, FileText, Trash2, ChevronRight, Eye, Plus } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface Question {
  id: string
  text: string
  type: "multiple_choice" | "true_false"
  difficulty: "easy" | "medium" | "hard"
  answers: number
}

interface Subtopic {
  id: string
  name: string
  description: string
  createdDate: string
}

interface TopicDetail {
  id: string
  name: string
  status: "active" | "pending" | "rejected"
  description: string
  createdDate: string
  questions: Question[]
  subtopics: Subtopic[]
}

export function TopicDetailsPageComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const topicId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [topic, setTopic] = useState<TopicDetail | null>(null)
  const [activeTab, setActiveTab] = useState<"subtopics" | "tests">("subtopics")

  // Sample topic data with full details
  useEffect(() => {
    // Simulate API call
    const sampleTopic: TopicDetail = {
      id: topicId || "#20462",
      name: "THỰC VẬT",
      status: "active",
      description: "Chủ đề về các loại thực vật và cây cối trong tự nhiên",
      createdDate: "15/06/2022",
      questions: [
        { id: "q1", text: "Đây là quả gì ?", type: "multiple_choice", difficulty: "easy", answers: 4 },
        { id: "q2", text: "Đây là cái gì ?", type: "multiple_choice", difficulty: "medium", answers: 3 },
        { id: "q3", text: "Hành động này nói lên điều gì ?", type: "multiple_choice", difficulty: "hard", answers: 4 },
        { id: "q4", text: "Cây này có tên gọi là gì ?", type: "multiple_choice", difficulty: "easy", answers: 4 },
        { id: "q5", text: "Loại hoa này thuộc họ nào ?", type: "true_false", difficulty: "medium", answers: 2 },
      ],
      subtopics: [
        { id: "st1", name: "Cây ăn quả", description: "Các loại cây cho ra quả ăn được", createdDate: "16/06/2022" },
        { id: "st2", name: "Cây lá", description: "Các loại cây có lá xanh", createdDate: "17/06/2022" },
        { id: "st3", name: "Hoa", description: "Các loại hoa đẹp", createdDate: "18/06/2022" },
        { id: "st4", name: "Cây thuốc", description: "Các loại cây có tác dụng chữa bệnh", createdDate: "19/06/2022" },
      ],
    }
    setTopic(sampleTopic)
  }, [topicId])

  const handleGoBack = () => {
    router.back()
  }

  const handleEdit = () => {
    router.push(`/create-topic?id=${topicId}`)
  }

  const handleDisable = () => {
    console.log("Disable topic:", topicId)
  }

  const statusOptions = [
    { value: "active", label: "Hoạt động" },
    { value: "pending", label: "Đang kiểm duyệt" },
    { value: "rejected", label: "Bị từ chối" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300"
      case "pending":
        return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border-orange-300"
      case "rejected":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-300"
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "HOẠT ĐỘNG"
      case "pending":
        return "ĐANG KIỂM DUYỆT"
      case "rejected":
        return "BỊ TỪ CHỐI"
      default:
        return "KHÔNG XÁC ĐỊNH"
    }
  }

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
    router.push(`/test-question-details?id=${questionId}&topicId=${topicId}`)
  }

  const handleAddQuestion = () => {
    router.push(`/add-question?topicId=${topicId}`)
  }

  const handleDeleteQuestion = (questionId: string) => {
    console.log("Delete question:", questionId)
  }

  const handleAddSubtopic = () => {
    console.log("Add subtopic")
  }

  const handleDeleteSubtopic = (subtopicId: string) => {
    console.log("Delete subtopic:", subtopicId)
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Đang tải...</p>
        </div>
      </div>
    )
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
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 leading-relaxed">
              CHI TIẾT CHỦ ĐỀ: {topic.name}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
          </div>

          {/* Topic Information Summary Card */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
              <h2 className="text-xl font-bold text-gray-700 mb-6 text-center">THÔNG TIN TỔNG QUAN</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-sm font-bold text-blue-600 mb-2">ID CHỦ ĐỀ:</label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm text-gray-800 font-medium flex items-center group-hover:border-blue-300 transition-all duration-300">
                        {topic.id}
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-blue-600 mb-2">TÊN CHỦ ĐỀ:</label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm text-gray-800 font-medium flex items-center group-hover:border-blue-300 transition-all duration-300">
                        {topic.name}
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-blue-600 mb-2">NGÀY TẠO:</label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm text-gray-800 font-medium flex items-center group-hover:border-blue-300 transition-all duration-300">
                        {topic.createdDate}
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-sm font-bold text-blue-600 mb-2">TRẠNG THÁI:</label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm flex items-center group-hover:border-blue-300 transition-all duration-300">
                        <Badge className={`px-4 py-2 text-sm font-bold border-2 ${getStatusColor(topic.status)}`}>
                          {getStatusText(topic.status)}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-blue-600 mb-2">SỐ CHỦ ĐỀ PHỤ:</label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm text-gray-800 font-medium flex items-center group-hover:border-blue-300 transition-all duration-300">
                        {topic.subtopics.length} chủ đề phụ
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-blue-600 mb-2">SỐ CÂU HỎI:</label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm text-gray-800 font-medium flex items-center group-hover:border-blue-300 transition-all duration-300">
                        {topic.questions.length} câu hỏi
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description - Full Width */}
              <div className="mt-6 group">
                <label className="block text-sm font-bold text-blue-600 mb-2">MÔ TẢ:</label>
                <div className="relative">
                  <div className="w-full min-h-[60px] px-4 py-3 border-2 border-blue-200/60 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm text-gray-800 font-medium flex items-center group-hover:border-blue-300 transition-all duration-300">
                    {topic.description}
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>

            <div className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-10">
              {/* Form Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-3 leading-relaxed">
                  QUẢN LÝ NỘI DUNG CHỦ ĐỀ
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-3"></div>
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
                    CHỦ ĐỀ PHỤ ({topic.subtopics.length})
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
                    BÀI KIỂM TRA ({topic.questions.length})
                  </Button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="mb-8">
                {activeTab === "subtopics" && (
                  <div className="relative">
                    <div className="border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm p-6">
                      {/* Header with Add Button */}
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-700">CHỦ ĐỀ PHỤ ({topic.subtopics.length})</h3>
                        <Button
                          onClick={handleAddSubtopic}
                          className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <Plus className="w-5 h-5 relative z-10" />
                          <span className="relative z-10">THÊM CHỦ ĐỀ PHỤ</span>
                        </Button>
                      </div>

                      {/* Subtopics List */}
                      <div className="space-y-3">
                        {topic.subtopics.map((subtopic, index) => (
                          <div
                            key={subtopic.id}
                            className="group relative bg-gradient-to-r from-white to-blue-50/30 rounded-2xl border border-blue-200/50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
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
                                        {subtopic.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs text-gray-500">{subtopic.description}</span>
                                      <span className="text-xs text-gray-400">• {subtopic.createdDate}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <Button
                                    onClick={() => handleDeleteSubtopic(subtopic.id)}
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

                      {/* Pagination for subtopics */}
                      <div className="flex justify-center items-center gap-3 mt-6">
                        <Button className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200">
                          ←
                        </Button>
                        <Button className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
                          1
                        </Button>
                        <Button className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200">
                          →
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "tests" && (
                  <div className="relative">
                    <div className="border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm p-6">
                      {/* Header with Add Button */}
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-700">CÂU HỎI KIỂM TRA ({topic.questions.length})</h3>
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
                        {topic.questions.map((question, index) => (
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

                      {/* Pagination for questions */}
                      <div className="flex justify-center items-center gap-3 mt-6">
                        <Button className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200">
                          ←
                        </Button>
                        <Button className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
                          1
                        </Button>
                        <Button className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200">
                          →
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-6 justify-center">
                <Button
                  onClick={handleGoBack}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ArrowLeft className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">QUAY LẠI</span>
                </Button>

                <Button
                  onClick={handleEdit}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Edit className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">CHỈNH SỬA</span>
                </Button>

                <Button
                  onClick={handleDisable}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Ban className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">VÔ HIỆU HÓA</span>
                </Button>
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

export default TopicDetailsPageComponent
