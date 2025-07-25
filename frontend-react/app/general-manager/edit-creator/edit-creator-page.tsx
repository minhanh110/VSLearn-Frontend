"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Mail, Phone, User, MapPin, Calendar, Palette } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCreatorPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    userName: "",
    name: "",
    email: "",
    phone: "",
    specialization: "",
    bio: "",
    address: "",
    dateOfBirth: "",
    experience: "",
    education: "",
    portfolio: "",
    contentTypes: "",
    status: "active",
    userRole: "CONTENT_CREATOR",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const debounceRef = useRef<any>({})

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const token = localStorage.getItem('token')
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const user = res.data?.data || res.data
        setFormData({
          userName: user.userName || "",
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.userEmail || user.email || "",
          phone: user.phoneNumber || user.phone || "",
          specialization: user.specialization || "",
          bio: user.bio || "",
          address: user.address || "",
          dateOfBirth: user.dateOfBirth || user.birthDate || "",
          experience: user.experience || "",
          education: user.education || "",
          portfolio: user.portfolio || "",
          contentTypes: user.contentTypes || "",
          status: user.isActive ? "active" : (user.status || "active"),
          userRole: user.userRole || user.role || "CONTENT_CREATOR",
        })
      } catch (err) {
        toast.error("Không tìm thấy user hoặc lỗi server!")
        router.push("/general-manager/creators")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [userId])

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

  const checkDuplicate = async (field: string, value: string) => {
    if (!value) return false;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/admin/users/all?search=${encodeURIComponent(value)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const users = res.data?.content || res.data?.data || [];
      // Loại bỏ chính user đang edit khỏi check trùng
      const filtered = users.filter((u: any) => String(u.id) !== String(userId));
      if (field === 'userName') {
        return filtered.some((u: any) => u.userName === value);
      }
      if (field === 'userEmail' || field === 'email') {
        return filtered.some((u: any) => u.userEmail === value);
      }
      if (field === 'phone' || field === 'phoneNumber') {
        return filtered.some((u: any) => u.phoneNumber === value);
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (["userName", "email", "phone"].includes(field)) {
      if (debounceRef.current[field]) clearTimeout(debounceRef.current[field]);
      debounceRef.current[field] = setTimeout(async () => {
        const isDup = await checkDuplicate(field, value);
        if (isDup) {
          setErrors((prev) => ({ ...prev, [field]: `${field === 'userName' ? 'Tên đăng nhập' : field === 'email' ? 'Email' : 'Số điện thoại'} đã tồn tại` }));
        }
      }, 500);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
        const token = localStorage.getItem('token')
        await axios.put(`${API_BASE_URL}/api/v1/admin/users/${userId}`, {
          userName: formData.userName,
          firstName: formData.name.split(' ').slice(0, -1).join(' ') || formData.name,
          lastName: formData.name.split(' ').slice(-1).join(' '),
          userEmail: formData.email,
          phoneNumber: formData.phone,
          specialization: formData.specialization,
          bio: formData.bio,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth,
          experience: formData.experience,
          education: formData.education,
          portfolio: formData.portfolio,
          contentTypes: formData.contentTypes,
          isActive: formData.status === "active",
          userRole: formData.userRole || "CONTENT_CREATOR",
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setShowSuccess(true)
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message || "Có lỗi xảy ra")
      }
    }
  }

  if (loading) return <div>Đang tải dữ liệu...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200/30 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-lg"></div>

      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      <main className="pt-20 pb-20 lg:pb-4 px-2 sm:px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/general-manager/creators")}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </Button>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Image
                  src="/images/whale-character.png"
                  alt="Whale"
                  width={32}
                  height={32}
                  className="animate-bounce sm:w-10 sm:h-10"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Chỉnh sửa người tạo nội dung
                  </h1>
                  <p className="text-sm sm:text-base text-blue-600">Cập nhật thông tin người tạo nội dung</p>
                </div>
              </div>
            </div>
            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base sm:text-lg font-semibold text-blue-900">Thông tin cá nhân</h2>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="userName" className="text-gray-700 font-medium">
                        Tên đăng nhập *
                      </Label>
                      <Input
                        id="userName"
                        value={formData.userName}
                        onChange={(e) => handleInputChange("userName", e.target.value)}
                        placeholder="Nhập tên đăng nhập"
                        className={`border-blue-200 focus:border-blue-400 ${errors.userName ? "border-red-300" : ""}`}
                        disabled
                      />
                      {errors.userName && <p className="text-red-500 text-sm">{errors.userName}</p>}
                    </div>
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
                          disabled
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
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
                        className="pl-10 border-blue-200 focus:border-blue-400 min-h-[60px] sm:min-h-[80px]"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Professional Information */}
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base sm:text-lg font-semibold text-blue-900">Thông tin chuyên môn</h2>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
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
                          <SelectItem value="english">Tiếng Anh giao tiếp</SelectItem>
                          <SelectItem value="business-english">Tiếng Anh thương mại</SelectItem>
                          <SelectItem value="academic-english">Tiếng Anh học thuật</SelectItem>
                          <SelectItem value="sign-language">Ngôn ngữ ký hiệu</SelectItem>
                          <SelectItem value="vocabulary">Từ vựng chuyên ngành</SelectItem>
                          <SelectItem value="grammar">Ngữ pháp</SelectItem>
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
                    <Label htmlFor="contentTypes" className="text-gray-700 font-medium">
                      Loại nội dung tạo
                    </Label>
                    <Textarea
                      id="contentTypes"
                      value={formData.contentTypes}
                      onChange={(e) => handleInputChange("contentTypes", e.target.value)}
                      placeholder="Ví dụ: Video giảng dạy, flashcard, bài tập tương tác, quiz..."
                      className="border-blue-200 focus:border-blue-400 min-h-[60px] sm:min-h-[80px]"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio" className="text-gray-700 font-medium">
                      Portfolio/Tác phẩm mẫu
                    </Label>
                    <Input
                      id="portfolio"
                      value={formData.portfolio}
                      onChange={(e) => handleInputChange("portfolio", e.target.value)}
                      placeholder="Link đến portfolio hoặc tác phẩm mẫu"
                      className="border-blue-200 focus:border-blue-400"
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
                      placeholder="Mô tả ngắn gọn về bản thân, kinh nghiệm và phong cách tạo nội dung"
                      className="border-blue-200 focus:border-blue-400 min-h-[80px] sm:min-h-[100px]"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
              {/* Status */}
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <h2 className="text-base sm:text-lg font-semibold text-blue-900">Trạng thái</h2>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
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
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/general-manager/creators")}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 w-full sm:w-auto order-2 sm:order-1"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg w-full sm:w-auto order-1 sm:order-2"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      {/* Dialog thông báo thành công */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <div className="text-green-600 text-2xl mb-2">✔</div>
            <div className="font-semibold mb-2">Cập nhật người tạo nội dung thành công!</div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => router.push("/general-manager/creators")}>OK</button>
          </div>
        </div>
      )}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <ToastContainer />
    </div>
  )
}

export default EditCreatorPage 