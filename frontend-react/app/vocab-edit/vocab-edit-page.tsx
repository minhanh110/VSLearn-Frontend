"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, BookOpen, Globe, FileText, Video, Save } from "lucide-react"
import { VocabService } from "@/app/services/vocab.service";
import { ApprovalNotice } from "@/components/approval-notice";
import { StatusDisplay } from "@/components/status-display";

interface VocabularyDetail {
  id: number
  vocab: string
  topicName: string
  subTopicName: string
  description?: string
  videoLink?: string
  region?: string
  meaning?: string
  status: string
  createdAt: string
  createdBy: number
  updatedAt?: string
  updatedBy?: number
  deletedAt?: string
}

export function VocabEditPageComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vocabId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    vocab: "",
    region: "",
    description: "",
    videoLink: "",
    meaning: "",
    status: "",
  })

  // Dynamic data
  const [topics, setTopics] = useState<{ value: string, label: string, id: string | number }[]>([])
  const [regions, setRegions] = useState<{ value: string, label: string }[]>([])
  const [subTopics, setSubTopics] = useState<{ value: string, label: string, id: string | number }[]>([])

  // Fetch vocabulary detail on mount
  useEffect(() => {
    if (!vocabId) {
      alert("Không tìm thấy ID từ vựng!")
      router.push("/list-vocab")
      return
    }

    const fetchVocabDetail = async () => {
      try {
        setLoading(true)
        const response = await VocabService.getVocabDetail(vocabId)
        const vocab = response.data
        
        // Set form data with existing vocabulary data
        setFormData({
          vocab: vocab.vocab || "",
          region: vocab.region || "",
          description: vocab.description || "",
          videoLink: vocab.videoLink || "",
          meaning: vocab.meaning || "",
          status: vocab.status || "", // Hiển thị trạng thái hiện tại
        })
      } catch (error: any) {
        console.error("Error fetching vocab detail:", error)
        alert("Không thể tải thông tin từ vựng. Vui lòng thử lại!")
        router.push("/list-vocab")
      } finally {
        setLoading(false)
      }
    }

    fetchVocabDetail()
  }, [vocabId, router])

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
    // Xóa các useEffect fetch topics, subtopics
    // Sửa handleSubmit: chỉ gửi các trường còn lại
  }, []);

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
    if (!formData.region) {
      alert("Vui lòng chọn khu vực!")
      return
    }
    setIsSubmitting(true)
    try {
      await VocabService.updateVocab(vocabId!, {
        vocab: formData.vocab,
        region: formData.region,
        description: formData.description,
        videoLink: formData.videoLink,
        meaning: formData.meaning,
      });
      alert("Cập nhật từ vựng thành công! Từ vựng đã được gửi để duyệt lại và sẽ hiển thị sau khi được phê duyệt.")
      router.push(`/vocab-detail?id=${vocabId}`)
    } catch (error: any) {
      alert(error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  if (loading) {
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
                  <Save className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-2">
                  CHỈNH SỬA TỪ VỰNG
                </h2>
                <p className="text-gray-600 text-sm font-medium">CẬP NHẬT THÔNG TIN TỪ VỰNG</p>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-3"></div>
              </div>

              {/* Approval Notice */}
              <ApprovalNotice type="edit" contentType="vocab" />

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

                  {/* Khu vực */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <Globe className="w-4 h-4 text-blue-500" />
                      KHU VỰC
                    </label>
                    <div className="relative">
                      <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                        <SelectTrigger className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-blue-300">
                          <SelectValue placeholder="Chọn khu vực..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-lg border border-blue-200/60 rounded-2xl shadow-lg">
                          {regions.map((region) => (
                            <SelectItem key={region.value} value={region.value} className="hover:bg-blue-50">
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
                  {/* Ý nghĩa */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Ý NGHĨA
                    </label>
                    <div className="relative">
                      <Textarea
                        value={formData.meaning}
                        onChange={(e) => handleInputChange("meaning", e.target.value)}
                        placeholder="Nhập ý nghĩa từ vựng..."
                        className="w-full min-h-[120px] px-4 py-3 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-blue-300 resize-none"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

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
                        placeholder="Nhập mô tả từ vựng..."
                        className="w-full min-h-[120px] px-4 py-3 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-blue-300 resize-none"
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
                        placeholder="Nhập link video..."
                        className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-blue-300"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Trạng thái hiện tại (Read-only) */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      TRẠNG THÁI HIỆN TẠI
                    </label>
                    <div className="relative">
                      <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-2xl bg-gray-50 flex items-center justify-center">
                        {formData.status ? (
                          <StatusDisplay status={formData.status} />
                        ) : (
                          <span className="text-gray-500">Chưa có trạng thái</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        * Trạng thái sẽ tự động chuyển về "Đang kiểm duyệt" sau khi cập nhật
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
                <Button
                  onClick={handleGoBack}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <ArrowLeft className="w-5 h-5" />
                  QUAY LẠI
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {isSubmitting ? "ĐANG CẬP NHẬT..." : "CẬP NHẬT"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
} 