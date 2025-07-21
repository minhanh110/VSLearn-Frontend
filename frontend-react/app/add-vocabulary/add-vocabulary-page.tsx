"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Plus, ArrowLeft, BookOpen, Globe, FileText, Video } from "lucide-react"
import { VocabService } from "@/app/services/vocab.service";
import { ApprovalNotice } from "@/components/approval-notice";

export function AddVocabularyPageComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    vocab: "",
    region: "",
    description: "",
    videoLink: "",
    meaning: "",
  })

  // Dynamic data
  const [topics, setTopics] = useState<{ value: string, label: string, id: string | number }[]>([])
  const [regions, setRegions] = useState<{ value: string, label: string }[]>([])
  const [subTopics, setSubTopics] = useState<{ value: string, label: string, id: string | number }[]>([])

  // Fetch topics and regions on mount
  useEffect(() => {
    // Fetch topics
    fetch("http://localhost:8080/api/v1/vocab/topics")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTopics(data.map((t: any) => ({ value: t.id?.toString() || t.value, label: t.name || t.label, id: t.id })));
        }
      })
      .catch(() => setTopics([]));
    // Fetch regions
    fetch("http://localhost:8080/api/v1/vocab/regions")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRegions(data.map((r: any) => ({ value: r.value || r.id, label: r.label || r.name })));
        }
      })
      .catch(() => setRegions([]));
  }, []);

  // Fetch subtopics when topic changes
  useEffect(() => {
    if (!formData.topicId) {
      setSubTopics([]);
      setFormData(f => ({ ...f, subTopicId: "" }));
      return;
    }
    fetch(`http://localhost:8080/api/v1/flashcards/topic/${formData.topicId}/subtopics`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSubTopics(data.map((st: any) => ({ value: st.id?.toString() || st.value, label: st.name || st.label, id: st.id })));
        }
      })
      .catch(() => setSubTopics([]));
  }, [formData.topicId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.vocab.trim()) {
      alert("Vui lòng nhập tên từ vựng!")
      return
    }
    if (!formData.topicId) {
      alert("Vui lòng chọn chủ đề!")
      return
    }
    if (!formData.subTopicId) {
      alert("Vui lòng chọn chủ đề phụ!")
      return
    }
    setIsSubmitting(true)
    try {
      await VocabService.createVocab({
        vocab: formData.vocab,
        topicId: parseInt(formData.topicId),
        subTopicId: parseInt(formData.subTopicId),
        region: formData.region,
        description: formData.description,
        videoLink: formData.videoLink,
        meaning: formData.meaning,
      });
      alert("Thêm từ vựng thành công! Từ vựng đã được gửi để duyệt và sẽ hiển thị sau khi được phê duyệt.")
      setFormData({
        vocab: "",
        topicId: "",
        subTopicId: "",
        region: "",
        description: "",
        videoLink: "",
        meaning: "",
      })
      router.push("/content-creator/vocabulary")
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
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-2">
                  THÊM TỪ VỰNG
                </h2>
                <p className="text-gray-600 text-sm font-medium">CHI TIẾT TỪ VỰNG</p>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-3"></div>
              </div>

              {/* Approval Notice */}
              <ApprovalNotice type="create" contentType="vocab" />

              {/* Form Fields in grid layout */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Tên từ vựng */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <FileText className="w-4 h-4 text-blue-500" />
                      TÊN TỪ VỰNG <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={formData.vocab}
                        onChange={(e) => handleInputChange("vocab", e.target.value)}
                        placeholder="Nhập tên từ vựng..."
                        className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-blue-300"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Chủ đề */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      CHỦ ĐỀ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Select value={formData.topicId} onValueChange={(value) => handleInputChange("topicId", value)}>
                        <SelectTrigger className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 shadow-sm hover:shadow-md group-hover:border-blue-300 transition-all duration-300">
                          <SelectValue placeholder="Chọn chủ đề..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-blue-200 shadow-xl">
                          {topics.map((topic) => (
                            <SelectItem key={topic.value} value={topic.value} className="rounded-lg">
                              {topic.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Chủ đề phụ */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      CHỦ ĐỀ PHỤ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Select value={formData.subTopicId} onValueChange={(value) => handleInputChange("subTopicId", value)}>
                        <SelectTrigger className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 shadow-sm hover:shadow-md group-hover:border-blue-300 transition-all duration-300">
                          <SelectValue placeholder="Chọn chủ đề phụ..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-blue-200 shadow-xl">
                          {subTopics.map((st) => (
                            <SelectItem key={st.value} value={st.value} className="rounded-lg">
                              {st.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Khu vực */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <Globe className="w-4 h-4 text-blue-500" />
                      KHU VỰC <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                        <SelectTrigger className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 shadow-sm hover:shadow-md group-hover:border-blue-300 transition-all duration-300">
                          <SelectValue placeholder="Chọn khu vực..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-blue-200 shadow-xl">
                          {regions.map((region) => (
                            <SelectItem key={region.value} value={region.value} className="rounded-lg">
                              {region.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Mô tả */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <FileText className="w-4 h-4 text-blue-500" />
                      MÔ TẢ
                    </label>
                    <div className="relative">
                      <Textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Mô tả điền vào đây..."
                        className="w-full h-32 p-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-blue-300"
                        maxLength={500}
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-right font-medium">
                      {formData.description.length}/500 ký tự
                    </p>
                  </div>
                  {/* Nghĩa của từ */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <FileText className="w-4 h-4 text-blue-500" />
                      NGHĨA CỦA TỪ
                    </label>
                    <div className="relative">
                      <Textarea
                        value={formData.meaning}
                        onChange={(e) => handleInputChange("meaning", e.target.value)}
                        placeholder="Nhập nghĩa của từ..."
                        className="w-full h-24 p-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-blue-300"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Link video */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <Video className="w-4 h-4 text-blue-500" />
                      LINK VIDEO
                    </label>
                    <div className="relative">
                      <Input
                        type="url"
                        value={formData.videoLink}
                        onChange={(e) => handleInputChange("videoLink", e.target.value)}
                        placeholder="https://example.com/video.mp4"
                        className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-blue-300"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-6 mt-12 justify-center">
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
                      <span className="relative z-10">THÊM</span>
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
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} roleId="content-creator" />
    </div>
  )
}

export default AddVocabularyPageComponent
