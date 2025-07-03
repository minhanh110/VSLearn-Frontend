"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { BackgroundLayout } from "../../components/background-layout"
import { WhaleCharacter } from "../../components/whale-character"
import { BackgroundCard } from "../../components/background-card"
import { Logo } from "../../components/logo"
import { useState } from "react"
import { useRouter } from "next/navigation"
import authService from "../services/auth.service"
import { Shield, Eye, EyeOff, CheckCircle, Check, X } from "lucide-react"
import Cookies from "js-cookie"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirm: false,
  })

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const passwordRequirements = [
    { text: "Ít nhất 8 ký tự", valid: formData.password.length >= 8 },
    { text: "Ít nhất 1 chữ cái viết hoa", valid: /[A-Z]/.test(formData.password) },
    { text: "Ít nhất 1 chữ cái viết thường", valid: /[a-z]/.test(formData.password) },
    { text: "Ít nhất 1 số", valid: /\d/.test(formData.password) },
    { text: "Ít nhất 1 ký tự đặc biệt", valid: /[!@#$%^&*(),.?\":{}|<>]/.test(formData.password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    // Frontend validation
    if (!formData.firstName?.trim()) {
      setError("Vui lòng nhập Họ")
      setLoading(false)
      return
    }
    if (!formData.lastName?.trim()) {
      setError("Vui lòng nhập Tên")
      setLoading(false)
      return
    }
    if (!formData.username?.trim()) {
      setError("Vui lòng nhập tên đăng nhập")
      setLoading(false)
      return
    }
    if (!formData.phoneNumber?.trim()) {
      setError("Vui lòng nhập số điện thoại")
      setLoading(false)
      return
    }
    // Check phone format (Việt Nam: 10 số, bắt đầu bằng 0)
    if (!/^0\d{9}$/.test(formData.phoneNumber.trim())) {
      setError("Số điện thoại không đúng định dạng (10 số, bắt đầu bằng 0)")
      setLoading(false)
      return
    }
    // Only frontend validation - password matching check
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      setLoading(false)
      return
    }
    try {
      const otpResponse = await authService.requestSignupOtp(formData.email.trim())
      if (otpResponse.status === 200) {
        Cookies.set("email-signup", formData.email.trim(), { expires: 5 / 1440 })
        Cookies.set("otp-signup", otpResponse.data, { expires: 5 / 1440 })
        localStorage.setItem("registrationData", JSON.stringify({
          ...formData,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber?.trim() || ""
        }))
        router.push("/signup-otp")
      } else {
        setError(otpResponse.message || "Không thể gửi mã OTP")
      }
    } catch (err: any) {
      // Hiển thị lỗi rõ ràng cho các trường hợp username/phone/email đã tồn tại
      if (err.message?.toLowerCase().includes('username')) {
        setError("Tên đăng nhập đã tồn tại")
      } else if (err.message?.toLowerCase().includes('phone')) {
        setError("Số điện thoại đã tồn tại")
      } else if (err.message?.toLowerCase().includes('email')) {
        setError("Email đã tồn tại")
      } else {
        setError(err.message || "Đăng ký thất bại, vui lòng thử lại")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <BackgroundLayout>
      <BackgroundCard>
        <div className="flex items-center justify-between">
          {/* Form đăng ký */}
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center space-y-4">
              <Logo size="lg" />
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Tạo tài khoản</h1>
                <p className="text-gray-600">Tham gia cộng đồng của chúng tôi ngay hôm nay!</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Họ</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Nguyễn"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="An"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="nguyenan"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="an@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="0123456789"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPasswords.password ? "text" : "password"}
                    placeholder="Nhập mật khẩu mạnh"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("password")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.password ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {formData.password && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Yêu cầu mật khẩu:</p>
                  <div className="space-y-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {req.valid ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm ${req.valid ? "text-green-600 font-medium" : "text-gray-600"}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  Tôi đồng ý với{" "}
                  <Link href="/terms" className="hover:opacity-80" style={{ color: "#93D6F6" }}>
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link href="/privacy" className="hover:opacity-80" style={{ color: "#93D6F6" }}>
                    Chính sách bảo mật
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: "#93D6F6" }}
              >
                {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link href="/login" className="font-medium hover:opacity-80" style={{ color: "#93D6F6" }}>
                Đăng nhập tại đây
              </Link>
            </p>
          </div>

          {/* Hình ảnh bên phải */}
          <div className="hidden lg:block flex-1 flex justify-center items-center">
            <div className="relative">
              <WhaleCharacter expression="excited" message="Chào mừng bạn đến với chúng tôi!" size="lg" />
            </div>
          </div>
        </div>
      </BackgroundCard>
    </BackgroundLayout>
  )
}
