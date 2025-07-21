"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Mail, Phone, User, MapPin, Calendar, Award } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"

const CreateApproverPage = () => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    bio: "",
    address: "",
    dateOfBirth: "",
    experience: "",
    education: "",
    certifications: "",
    status: "active",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Họ tên là bắt buộc"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc"
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = "Chuyên môn là bắt buộc"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Handle form submission
      console.log("Creating new approver:", formData)
      // Redirect to approvers list
      router.push("/general-manager/approvers")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
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
                onClick={() => router.push("/general-manager/approvers")}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
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
                    Tạo người duyệt mới
                  </h1>
                  <p className="text-blue-600">Thêm người duyệt mới vào hệ thống</p>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-blue-900">Thông tin cá nhân</h2>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Họ và tên *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Nhập họ và tên"
                        className={`border-blue-200 focus:border-blue-400 ${errors.name ? "border-red-300" : ""}`}
                      />
                      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Nhập địa chỉ email"
                          className={`pl-10 border-blue-200 focus:border-blue-400 ${errors.email ? "border-red-300" : ""}`}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        Số điện thoại *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="Nhập số điện thoại"
                          className={`pl-10 border-blue-200 focus:border-blue-400 ${errors.phone ? "border-red-300" : ""}`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">
                        Ngày sinh
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          className="pl-10 border-blue-200 focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-700 font-medium">
                      Địa chỉ
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Nhập địa chỉ"
                        className="pl-10 border-blue-200 focus:border-blue-400 min-h-[80px]"
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-blue-900">Thông tin chuyên môn</h2>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialization" className="text-gray-700 font-medium">
                        Chuyên môn *
                      </Label>
                      <Select
                        value={formData.specialization}
                        onValueChange={(value) => handleInputChange("specialization", value)}
                      >
                        <SelectTrigger
                          className={`border-blue-200 focus:border-blue-400 ${errors.specialization ? "border-red-300" : ""}`}
                        >
                          <SelectValue placeholder="Chọn chuyên môn" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">Tiếng Anh</SelectItem>
                          <SelectItem value="math">Toán học</SelectItem>
                          <SelectItem value="science">Khoa học</SelectItem>
                          <SelectItem value="literature">Văn học</SelectItem>
                          <SelectItem value="history">Lịch sử</SelectItem>
                          <SelectItem value="geography">Địa lý</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.specialization && <p className="text-red-500 text-sm">{errors.specialization}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-gray-700 font-medium">
                        Kinh nghiệm (năm)
                      </Label>
                      <Input
                        id="experience"
                        type="number"
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        placeholder="Nhập số năm kinh nghiệm"
                        className="border-blue-200 focus:border-blue-400"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education" className="text-gray-700 font-medium">
                      Trình độ học vấn
                    </Label>
                    <Input
                      id="education"
                      value={formData.education}
                      onChange={(e) => handleInputChange("education", e.target.value)}
                      placeholder="Ví dụ: Thạc sĩ Ngôn ngữ Anh, Đại học ABC"
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certifications" className="text-gray-700 font-medium">
                      Chứng chỉ
                    </Label>
                    <Textarea
                      id="certifications"
                      value={formData.certifications}
                      onChange={(e) => handleInputChange("certifications", e.target.value)}
                      placeholder="Liệt kê các chứng chỉ liên quan (mỗi chứng chỉ một dòng)"
                      className="border-blue-200 focus:border-blue-400 min-h-[80px]"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-700 font-medium">
                      Giới thiệu bản thân
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Mô tả ngắn gọn về bản thân, kinh nghiệm và sở trường"
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
                  onClick={() => router.push("/general-manager/approvers")}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Tạo người duyệt
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

export default CreateApproverPage
