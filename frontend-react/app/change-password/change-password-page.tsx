"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { BackgroundLayout } from "../../components/background-layout";
import { WhaleCharacter } from "../../components/whale-character";
import { BackgroundCard } from "../../components/background-card";

import { Shield, Eye, EyeOff, Check, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import authService from "../services/auth.service";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  // Password validation
  const passwordRequirements = [
    { text: "Ít nhất 8 ký tự", valid: formData.newPassword.length >= 8 },
    { text: "Ít nhất một chữ cái viết hoa", valid: /[A-Z]/.test(formData.newPassword) },
    { text: "Ít nhất một chữ cái thường", valid: /[a-z]/.test(formData.newPassword) },
    { text: "Ít nhất một chữ số", valid: /\d/.test(formData.newPassword) },
    { text: "Ít nhất một ký tự đặc biệt", valid: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Frontend validation
    if (!formData.currentPassword?.trim()) {
      setError("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    if (!formData.newPassword?.trim()) {
      setError("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (!formData.confirmPassword?.trim()) {
      setError("Vui lòng xác nhận mật khẩu mới");
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu mới không trùng khớp");
      return;
    }

    const allRequirementsMet = passwordRequirements.every(req => req.valid);
    if (!allRequirementsMet) {
      setError("Vui lòng đảm bảo mật khẩu đáp ứng tất cả yêu cầu");
      return;
    }

    try {
      setIsLoading(true);
      const result = await authService.changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      
      if (result.status === 200) {
        toast.success("Đổi mật khẩu thành công");
        router.push("/edit-profile");
      } else {
        setError(result.message || "Đổi mật khẩu thất bại");
      }
    } catch (error: any) {
      console.error("Change password error:", error);
      if (error.message?.toLowerCase().includes('current') || error.message?.toLowerCase().includes('hiện tại') || error.message?.toLowerCase().includes('incorrect')) {
        setError("Mật khẩu hiện tại không chính xác")
      } else {
        setError(error.message || "Đổi mật khẩu thất bại")
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <BackgroundCard>
        <div className="flex items-center justify-between">
          {/* Left side - Change Password Form */}
          <div className="w-full max-w-sm space-y-6">
            {/* Title */}
            <div className="text-center space-y-2">
              <div
                className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "#93D6F6", opacity: 0.2 }}
              >
                <Shield className="w-8 h-8" style={{ color: "#93D6F6" }} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Đổi Mật Khẩu</h1>
              <p className="text-gray-600">Giữ tài khoản của bạn an toàn</p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Change Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                  Mật khẩu hiện tại
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Nhập mật khẩu hiện tại"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ "--tw-ring-color": "#93D6F6" } as React.CSSProperties}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ "--tw-ring-color": "#93D6F6" } as React.CSSProperties}
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

              {/* Password Requirements - Real-time validation */}
              {formData.newPassword && (
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
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu mới
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ "--tw-ring-color": "#93D6F6" } as React.CSSProperties}
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
                disabled={isLoading}
                className="w-full text-white py-3 rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#93D6F6" }}
              >
                {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </Button>
            </form>

            {/* Back Link */}
            <div className="text-center">
              <Link href="/edit-profile" className="text-sm text-gray-500 hover:text-gray-700">
                ← Quay lại chỉnh sửa hồ sơ
              </Link>
            </div>
          </div>

          {/* Right side - Whale Character */}
          <div className="hidden lg:block flex-1 flex justify-center items-center">
            <div className="relative">
              <WhaleCharacter expression="happy" message="Giữ an toàn nhé!" size="md" />
            </div>
          </div>
        </div>
      </BackgroundCard>
    </BackgroundLayout>
  )
}
