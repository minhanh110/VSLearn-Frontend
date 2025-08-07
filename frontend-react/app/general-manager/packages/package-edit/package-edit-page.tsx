"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Save, DollarSign, Calendar, Percent } from "lucide-react"
import Image from "next/image"
import { packagesApi } from "@/lib/api/packages"

const PackageEditPageComponent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    discount: "",
    status: "active",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch package data
  useEffect(() => {
    if (!packageId) return

    const fetchPackage = async () => {
      try {
        setLoading(true)
        const response = await packagesApi.getPackageById(packageId)
        console.log("Package edit API response:", response)
        if (response.success) {
          const packageData = response.data
          setFormData({
            title: packageData.pricingType,
            description: packageData.description || "",
            price: packageData.price.toString(),
            duration: packageData.durationDays.toString(),
            discount: (packageData.discountPercent || 0).toString(),
            status: packageData.isActive ? "active" : "inactive",
          })
        } else {
          console.error("Failed to fetch package:", response.message)
        }
      } catch (error) {
        console.error("Error fetching package:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackage()
  }, [packageId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Tên gói học là bắt buộc"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Giá là bắt buộc"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Giá phải là số dương"
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Thời hạn là bắt buộc"
    } else if (isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
      newErrors.duration = "Thời hạn phải là số dương"
    }

    if (
      formData.discount &&
      (isNaN(Number(formData.discount)) || Number(formData.discount) < 0 || Number(formData.discount) > 100)
    ) {
      newErrors.discount = "Giảm giá phải là số từ 0 đến 100"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleCancel = () => {
    router.push("/general-manager/packages/list-packages")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const packageData = {
        ...formData,
        discount: formData.discount ? Number(formData.discount) : 0,
      }
      console.log("Updating package:", packageData)

      const response = await packagesApi.updatePackage(packageId!, packageData)
      if (response.success) {
        alert("Cập nhật gói học thành công!")
        router.push("/general-manager/packages/list-packages")
      } else {
        alert("Có lỗi xảy ra: " + response.message)
      }
    } catch (error: any) {
      console.error("Error updating package:", error)
      alert("Có lỗi xảy ra. Vui lòng thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <main className="pt-20 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-blue-600">Đang tải thông tin gói học...</p>
          </div>
        </main>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200/30 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-lg"></div>

      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      <main className="pt-20 pb-20 lg:pb-4 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </Button>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/whale-character.png"
                  alt="Whale"
                  width={40}
                  height={40}
                  className="animate-bounce"
                />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Chỉnh sửa gói học
                  </h1>
                  <p className="text-blue-600">Cập nhật thông tin gói học</p>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-blue-900">Thông tin gói học</h2>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-700 font-medium">
                      Tên gói học *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Nhập tên gói học"
                      className={`border-blue-200 focus:border-blue-400 ${errors.title ? "border-red-300" : ""}`}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-gray-700 font-medium">
                        Giá (VND) *
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                          placeholder="Nhập giá gói học"
                          className={`pl-10 border-blue-200 focus:border-blue-400 ${errors.price ? "border-red-300" : ""}`}
                        />
                      </div>
                      {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount" className="text-gray-700 font-medium">
                        Giảm giá (%)
                      </Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="discount"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discount}
                          onChange={(e) => handleInputChange("discount", e.target.value)}
                          placeholder="Nhập % giảm giá"
                          className={`pl-10 border-blue-200 focus:border-blue-400 ${errors.discount ? "border-red-300" : ""}`}
                        />
                      </div>
                      {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-gray-700 font-medium">
                      Thời hạn (ngày) *
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => handleInputChange("duration", e.target.value)}
                        placeholder="Nhập số ngày"
                        className={`pl-10 border-blue-200 focus:border-blue-400 ${errors.duration ? "border-red-300" : ""}`}
                      />
                    </div>
                    {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700 font-medium">
                      Mô tả
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Nhập mô tả gói học"
                      className="border-blue-200 focus:border-blue-400 min-h-[100px]"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Status */}
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-blue-900">Trạng thái</h2>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-700 font-medium">
                      Trạng thái hoạt động
                    </Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            Đang hoạt động
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            Không hoạt động
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Đang cập nhật..." : "Cập nhật gói học"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default PackageEditPageComponent
