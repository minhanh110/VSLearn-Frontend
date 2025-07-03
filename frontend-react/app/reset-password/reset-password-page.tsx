"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { BackgroundLayout } from "../../components/background-layout"
import { WhaleCharacter } from "../../components/whale-character"
import { Shield, Eye, EyeOff, CheckCircle, Check, X } from "lucide-react"
import { useState } from "react"
import { BackgroundCard } from "../../components/background-card"
import authService from "../services/auth.service"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'

export default function ResetPasswordPage() {
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  })
  const [isSuccess, setIsSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");
  const otp = Cookies.get("otp") || "";
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Basic frontend validation - chỉ check password matching
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    // Password strength check
    const passwordValid = passwordRequirements.every(req => req.valid)
    if (!passwordValid) {
      setError("Mật khẩu chưa đáp ứng đầy đủ yêu cầu")
      return
    }

    setLoading(true)

    try {
      const data = await authService.resetPassword(otp, newPassword, confirmPassword)
      if (data.status === 200) {
        Cookies.remove("email-reset")
        Cookies.remove("otp")
        setIsSuccess(true)
      } else {
        // Display backend validation message
        setError(data.message || "Đặt lại mật khẩu thất bại")
      }
    } catch (error: any) {
      console.error('Reset password error:', error)
      // Display backend error message
      setError(error.message || "Có lỗi xảy ra khi đặt lại mật khẩu")
    } finally {
      setLoading(false)
    }
  }

  const passwordRequirements = [
    { text: "Ít nhất 8 ký tự", valid: newPassword.length >= 8 },
    { text: "Ít nhất 1 chữ cái viết hoa", valid: /[A-Z]/.test(newPassword) },
    { text: "Ít nhất 1 chữ cái viết thường", valid: /[a-z]/.test(newPassword) },
    { text: "Ít nhất 1 số", valid: /\d/.test(newPassword) },
    { text: "Ít nhất 1 ký tự đặc biệt", valid: /[!@#$%^&*(),.?\":{}|<>]/.test(newPassword) },
  ]

  if (isSuccess) {
    return (
      <BackgroundLayout>
        <BackgroundCard>
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#93D6F6", opacity: 0.2 }}>
              <CheckCircle className="w-8 h-8" style={{ color: "#93D6F6" }} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu thành công!</h1>
              <p className="text-gray-600">Mật khẩu của bạn đã được cập nhật</p>
            </div>

            <div className="py-4">
              <WhaleCharacter expression="excited" message="Tất cả đã sẵn sàng!" size="sm" />
            </div>

            <Button
              asChild
              className="w-full max-w-xs mx-auto text-white py-3 rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: "#93D6F6" }}
            >
              <Link href="/login">Đăng nhập ngay</Link>
            </Button>

            <p className="text-xs text-gray-500">Bạn đã có thể đăng nhập bằng mật khẩu mới</p>
          </div>
        </BackgroundCard>
      </BackgroundLayout>
    )
  }

  return (
    <BackgroundLayout>
      <BackgroundCard>
        <div className="grid lg:grid-cols-2 min-h-[700px]">
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#93D6F6", opacity: 0.2 }}>
                  <Shield className="w-8 h-8" style={{ color: "#93D6F6" }} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Đặt lại mật khẩu</h1>
                <p className="text-gray-600">Vui lòng nhập mật khẩu mới bên dưới</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {newPassword && (
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
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white py-3 rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#93D6F6" }}
                >
                  {loading ? "Đang xử lý..." : "Xác nhận đặt lại mật khẩu"}
                </Button>
              </form>

              <div className="text-center">
                <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
                  ← Quay lại trang đăng nhập
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center relative overflow-hidden">
            <WhaleCharacter expression="happy" message="Sắp xong rồi!" />
          </div>
        </div>
      </BackgroundCard>
    </BackgroundLayout>
  )
}
