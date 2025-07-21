"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Plus, ArrowLeft, BookOpen, FileText } from "lucide-react"
import { TopicService } from "@/app/services/topic.service";
import { ApprovalNotice } from "@/components/approval-notice";

export function CreateTopicPageComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<"subtopics" | "tests">("subtopics")

  // Form state
  const [formData, setFormData] = useState({
    topicName: "",
    isFree: true,
    sortOrder: 0,
    subtopics: [] as string[],
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddSubtopic = () => {
    // Handle adding subtopic
    console.log("Add subtopic")
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.topicName.trim()) {
      alert("Vui lòng nhập tên chủ đề!")
      return
    }

    setIsSubmitting(true)

    try {
      await TopicService.createTopic({
        topicName: formData.topicName,
        isFree: formData.isFree,
        sortOrder: formData.sortOrder,
        subtopics: formData.subtopics,
      });
      alert("Thêm chủ đề thành công! Chủ đề đã được gửi để duyệt và sẽ hiển thị sau khi được phê duyệt.")
      setFormData({
        topicName: "",
        isFree: true,
        sortOrder: 0,
        subtopics: [],
      })
      router.push("/list-topics")
    } catch (error: any) {
      alert(error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating circles */}
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
          {/* Form Container with enhanced design */}
          <div className="relative">
            {/* Glow effect behind form */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>

            <div className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-10 max-w-4xl mx-auto">
              {/* Form Header with icon */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-3 leading-relaxed">
                  THÊM CHỦ ĐỀ
                </h2>
                <p className="text-gray-600 text-sm font-medium mb-2">CHI TIẾT CHỦ ĐỀ</p>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-3"></div>
              </div>

              {/* Approval Notice */}
              <ApprovalNotice type="create" contentType="topic" />

              {/* Topic Name Input */}
              <div className="mb-8">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <FileText className="w-4 h-4 text-blue-500" />
                    TÊN CHỦ ĐỀ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={formData.topicName}
                      onChange={(e) => handleInputChange("topicName", e.target.value)}
                      placeholder="Nhập tên chủ đề..."
                      className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-blue-300"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                    <div className="min-h-64 p-8 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                      <p className="text-gray-500 font-medium">Chức năng bài kiểm tra sẽ được phát triển sau</p>
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
                      <span className="relative z-10">CHỈNH SỬA</span>
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
