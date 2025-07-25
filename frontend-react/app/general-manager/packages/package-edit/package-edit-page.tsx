"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"

interface Package {
  id: string
  title: string
  description: string
  price: string
  duration: string
  features: string[]
  isPopular: boolean
  status: "active" | "inactive" | "draft"
}

const PackageEditPageComponent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [features, setFeatures] = useState<string[]>([""])

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
  })

  // Fetch package data
  useEffect(() => {
    if (!packageId) return

    // Mock data - replace with actual API call
    const mockPackage: Package = {
      id: packageId,
      title: "GÓI 1 THÁNG",
      description: "Gói học cơ bản cho người mới bắt đầu khám phá ngôn ngữ ký hiệu",
      price: "100.000",
      duration: "30",
      features: ["Truy cập tất cả bài học cơ bản", "Từ điển ngôn ngữ ký hiệu", "Thực hành với camera", "Hỗ trợ 24/7"],
      isPopular: false,
      status: "active",
    }

    setTimeout(() => {
      setFormData({
        title: mockPackage.title,
        description: mockPackage.description,
        price: mockPackage.price,
        duration: mockPackage.duration,
      })
      setFeatures(mockPackage.features)
      setLoading(false)
    }, 1000)
  }, [packageId])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  const addFeature = () => {
    setFeatures([...features, ""])
  }

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index))
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.price.trim() || !formData.duration.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!")
      return
    }

    const validFeatures = features.filter((f) => f.trim() !== "")
    if (validFeatures.length === 0) {
      alert("Vui lòng thêm ít nhất một tính năng!")
      return
    }

    setIsSubmitting(true)
    try {
      // API call to update package
      const packageData = {
        ...formData,
        features: validFeatures,
      }
      console.log("Updating package:", packageData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("Cập nhật gói học thành công!")
      router.push("/general-manager/packages/list-packages")
    } catch (error: any) {
      alert("Có lỗi xảy ra. Vui lòng thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 relative overflow-hidden">
      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <h1 className="text-2xl font-bold text-gray-800 text-center">CHỈNH SỬA GÓI HỌC</h1>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
            <div className="space-y-6">
              {/* Package Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">TÊN GÓI HỌC:</label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Nhập tên gói học..."
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">GIÁ (VND):</label>
                <Input
                  type="text"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Nhập giá gói học..."
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">KHOẢNG THỜI GIAN (NGÀY):</label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  placeholder="Nhập số ngày..."
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">MÔ TẢ:</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Nhập mô tả gói học..."
                  className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">TÍNH NĂNG:</label>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Tính năng ${index + 1}...`}
                        className="flex-1 h-12 px-4 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                      {features.length > 1 && (
                        <Button
                          onClick={() => removeFeature(index)}
                          className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all duration-200"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={addFeature}
                  className="mt-3 flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-600 font-medium py-2 px-4 rounded-lg transition-all duration-200"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                  Thêm tính năng
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                HỦY BỎ
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? "ĐANG CẬP NHẬT..." : "CHỈNH SỬA"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default PackageEditPageComponent
