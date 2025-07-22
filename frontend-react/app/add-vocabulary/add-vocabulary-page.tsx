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
  const [regions, setRegions] = useState<{ value: string, label: string }[]>([])

  // Fetch regions on mount
  useEffect(() => {
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
    // Không còn validate bắt buộc topicId và subTopicId
    setIsSubmitting(true)
    try {
      const payload: any = {
        vocab: formData.vocab,
        region: formData.region,
        description: formData.description,
        videoLink: formData.videoLink,
        meaning: formData.meaning,
      };
      await VocabService.createVocab(payload);
      alert("Thêm từ vựng thành công! Từ vựng đã được gửi để duyệt và sẽ hiển thị sau khi được phê duyệt.")
      setFormData({
        vocab: "",
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
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="w-full max-w-3xl mx-auto mt-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tên từ vựng */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">TÊN TỪ VỰNG <span className="text-red-500">*</span></label>
                    <Input
                      type="text"
                      value={formData.vocab}
                      onChange={e => handleInputChange("vocab", e.target.value)}
                      placeholder="Nhập tên từ vựng..."
                      className="w-full border-blue-200 rounded-xl"
                    />
                  </div>
                  {/* Nghĩa của từ */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">NGHĨA CỦA TỪ</label>
                    <Textarea
                      value={formData.meaning}
                      onChange={e => handleInputChange("meaning", e.target.value)}
                      placeholder="Nhập nghĩa của từ..."
                      className="w-full border-blue-200 rounded-xl min-h-[48px]"
                    />
                  </div>
                  {/* Khu vực */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">KHU VỰC <span className="text-red-500">*</span></label>
                    <Select value={formData.region} onValueChange={val => handleInputChange("region", val)}>
                      <SelectTrigger className="w-full h-14 border-2 border-blue-200/60 rounded-2xl bg-white/90 text-gray-700 font-medium">
                        <SelectValue placeholder="Chọn khu vực..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-blue-200 shadow-xl">
                        {regions.map(region => (
                          <SelectItem key={region.value} value={region.value} className="rounded-lg">
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Link video */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">LINK VIDEO</label>
                    <Input
                      type="text"
                      value={formData.videoLink}
                      onChange={e => handleInputChange("videoLink", e.target.value)}
                      placeholder="https://example.com/video.mp4"
                      className="w-full border-blue-200 rounded-xl"
                    />
                  </div>
                </div>
                {/* Mô tả (full width) */}
                <div className="mt-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">MÔ TẢ</label>
                  <Textarea
                    value={formData.description}
                    onChange={e => handleInputChange("description", e.target.value)}
                    placeholder="Mô tả điền vào đây..."
                    className="w-full border-blue-200 rounded-xl min-h-[48px]"
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{formData.description.length}/500 ký tự</div>
                </div>
                {/* Nút hành động */}
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="secondary" onClick={() => router.back()}>
                    QUAY LẠI
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl">
                    + THÊM
                  </Button>
                </div>
              </form>

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
