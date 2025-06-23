"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { BackgroundLayout } from "../../components/background-layout"
import { WhaleCharacter } from "../../components/whale-character"
import { Mail, ArrowLeft, CheckCircle, XCircle, X } from "lucide-react"
import { useState } from "react"
import { BackgroundCard } from "../../components/background-card"
import authService from "../services/auth.service"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';

type NotificationType = 'success' | 'error' | null

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [showPasswordTips, setShowPasswordTips] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{
    type: NotificationType
    message: string
  }>({ type: null, message: "" })
  const router = useRouter()

  

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message })
    setTimeout(() => {
      setNotification({ type: null, message: "" })
    }, 5000)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = await authService.forgotPassword(email)
      if(data.status === 200) {
        Cookies.set("email-reset", email, { expires: 5 / 1440 })
        Cookies.set("otp",data.data, { expires: 5 / 1440 })
        showNotification('success', 'Đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư.')
        setTimeout(() => {
          router.push("/otp")
        }, 1500)
        return;
      }
    } catch (error) {
      showNotification('error', 'Gửi hướng dẫn thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BackgroundLayout>
      <BackgroundCard>
        {notification.type && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-start gap-3">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification({ type: null, message: "" })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="w-full max-w-sm space-y-6">
            <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại đăng nhập
            </Link>

            <div className="text-center space-y-2">
              <div
                className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "#93D6F6", opacity: 0.2 }}
              >
                <Mail className="w-8 h-8" style={{ color: "#93D6F6" }} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Quên mật khẩu?</h1>
              <p className="text-gray-600">Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu đến email của bạn</p>
            </div>

            <form className="space-y-4" onSubmit={handleForgotPassword}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Địa chỉ email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setShowPasswordTips(true)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "#93D6F6" } as React.CSSProperties}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-white py-3 rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#93D6F6" }}
              >
                {isLoading ? "Đang gửi..." : "Gửi hướng dẫn đặt lại mật khẩu"}
              </Button>
            </form>

            <div className="p-4 rounded-lg border border-blue-200 bg-blue-50/50">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#93D6F6" }} />
                <div className="text-sm" style={{ color: "#000000" }}>
                  <p className="font-medium mb-1">Kiểm tra email của bạn</p>
                  <p>Nếu có tài khoản tồn tại, chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến địa chỉ email đó.</p>
                </div>
              </div>
            </div>

          

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Nhớ mật khẩu rồi? {" "}
                <Link href="/login" className="font-medium hover:opacity-80" style={{ color: "#93D6F6" }}>
                  Đăng nhập
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Chưa có tài khoản? {" "}
                <Link href="/register" className="font-medium hover:opacity-80" style={{ color: "#93D6F6" }}>
                  Tạo tài khoản
                </Link>
              </p>
            </div>
          </div>

          <div className="hidden lg:block flex-1 flex justify-center items-center">
            <div className="relative">
              <WhaleCharacter expression="sleepy" message="Đừng lo lắng!" size="md" />
            </div>
          </div>
        </div>
      </BackgroundCard>
    </BackgroundLayout>
  )
}
