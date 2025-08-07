"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Mail, Phone, User, MapPin, Calendar } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useRef } from "react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCreatorPage = () => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    dateOfBirth: "",
    status: "active",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate name (required)
    if (!formData.name.trim()) {
      newErrors.name = "Họ tên là bắt buộc"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Họ tên phải có ít nhất 2 ký tự"
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Họ tên không được vượt quá 100 ký tự"
    }

    // Validate email (required)
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    } else if (formData.email.length > 255) {
      newErrors.email = "Email không được vượt quá 255 ký tự"
    }

    // Validate phone (optional but if provided, must be valid)
    if (formData.phone.trim()) {
      const phoneNumber = formData.phone.replace(/\s/g, "")
      if (!/^[0-9]{10,11}$/.test(phoneNumber)) {
        newErrors.phone = "Số điện thoại phải có 10-11 chữ số"
      } else if (formData.phone.length > 12) {
        newErrors.phone = "Số điện thoại không được vượt quá 12 ký tự"
      }
    }

    // Validate address (optional)
    if (formData.address.trim() && formData.address.length > 255) {
      newErrors.address = "Địa chỉ không được vượt quá 255 ký tự"
    }

    // Validate bio (optional)
    if (formData.bio.trim() && formData.bio.length > 500) {
      newErrors.bio = "Giới thiệu không được vượt quá 500 ký tự"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateUsername = (email: string) => {
    // Lấy phần trước @ của email làm username
    return email.split('@')[0];
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        const token = localStorage.getItem("token")
        const userName = generateUsername(formData.email)
        
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        const requestUrl = `${API_BASE_URL}/api/v1/admin/users/create`
        // Ensure firstName and lastName are not empty
        const nameParts = formData.name.trim().split(' ')
        const firstName = nameParts.slice(0, -1).join(' ') || formData.name
        const lastName = nameParts.slice(-1).join(' ') || formData.name
        
        const requestData = {
          userName: userName,
          firstName: firstName,
          lastName: lastName,
          userEmail: formData.email,
          phoneNumber: formData.phone || null,
          userRole: 'CONTENT_CREATOR',
        }
        
        console.log("Creating creator with URL:", requestUrl)
        console.log("Request data:", requestData)
        
        const res = await axios.post(requestUrl, requestData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data && res.data.status === 200) {
          setShowSuccess(true);
        } else {
          alert(res.data.message || "Tạo người biên soạn thất bại");
        }
      } catch (err: any) {
        console.error("Error creating creator:", err);
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        alert(err.response?.data?.message || err.message || "Có lỗi xảy ra")
      }
    }
  }

  const checkDuplicate = async (field: string, value: string) => {
    if (!value) return false;
    
    const token = localStorage.getItem('token');
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const res = await axios.get(`${API_BASE_URL}/api/v1/admin/users/all?search=${encodeURIComponent(value)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const users = res.data?.content || res.data?.data || [];
      
      if (field === 'userEmail' || field === 'email') {
        return users.some((u: any) => u.userEmail === value);
      }
      if (field === 'phone' || field === 'phoneNumber') {
        return users.some((u: any) => u.phoneNumber === value);
      }
      if (field === 'userName') {
        return users.some((u: any) => u.userName === value);
      }
      return false;
    } catch {
      return false;
    }
  };

  const debounceRef = useRef<any>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    // Kiểm tra trùng email, phone, userName
    if (["email", "phone"].includes(field)) {
      if (debounceRef.current[field]) clearTimeout(debounceRef.current[field]);
      debounceRef.current[field] = setTimeout(async () => {
        // Chỉ check trùng phone khi có giá trị
        if (field === "phone" && !value.trim()) {
          return;
        }
        
        // Nếu là email, check cả email và userName
        if (field === "email") {
          const userName = generateUsername(value);
          const isEmailDup = await checkDuplicate("email", value);
          const isUserNameDup = await checkDuplicate("userName", userName);
          
          if (isEmailDup && isUserNameDup) {
            setErrors((prev) => ({ ...prev, email: "Email và tên đăng nhập đã tồn tại" }));
          } else if (isEmailDup) {
            setErrors((prev) => ({ ...prev, email: "Email đã tồn tại" }));
          } else if (isUserNameDup) {
            setErrors((prev) => ({ ...prev, email: "Tên đăng nhập đã tồn tại (tạo từ email)" }));
          }
        } else {
          // Check trùng field hiện tại (phone)
          const isDup = await checkDuplicate(field, value);
          if (isDup) {
            setErrors((prev) => ({ ...prev, [field]: "Số điện thoại đã tồn tại" }));
          }
        }
      }, 500);
    }
  }

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
                    Tạo người biên soạn mới
                  </h1>
                  <p className="text-sm sm:text-base text-blue-600">Thêm người biên soạn mới vào hệ thống</p>
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
                      {formData.email && (
                        <p className="text-blue-600 text-sm">
                          Tên đăng nhập sẽ là: <strong>{generateUsername(formData.email)}</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        Số điện thoại
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
                        className={`pl-10 border-blue-200 focus:border-blue-400 min-h-[60px] sm:min-h-[80px] ${errors.address ? "border-red-300" : ""}`}
                        rows={2}
                      />
                      {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                    </div>
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
                      className={`border-blue-200 focus:border-blue-400 min-h-[80px] sm:min-h-[100px] ${errors.bio ? "border-red-300" : ""}`}
                      rows={3}
                    />
                    {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
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
                  Tạo người tạo nội dung
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
            <div className="text-green-600 text-2xl mb-2">✓</div>
            <div className="font-semibold mb-2">Tạo người biên soạn thành công!</div>
            <div className="mb-4 text-gray-700">Mật khẩu mặc định: <b>123456</b></div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => router.push("/general-manager/creators")}>OK</button>
          </div>
        </div>
      )}

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <ToastContainer />
    </div>
  )
}

export default CreateCreatorPage

