"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { BackgroundLayout } from "../../components/background-layout"
import { WhaleCharacter } from "../../components/whale-character"
import { BackgroundCard } from "../../components/background-card"
import Cookies from "js-cookie"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import authService from "../services/auth.service"

export default function SignupOTPPageComponent() {
  const email = Cookies.get("email-signup") || ""
  const otp_store = Cookies.get("otp-signup") || ""
  const router = useRouter()
  const inputRefs = useRef<HTMLInputElement[]>([])
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [isVerifying, setIsVerifying] = useState(false)

  if (!email) {
    return (
      <BackgroundLayout>
        <BackgroundCard>
          <div className="text-center text-gray-600 p-4">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Không tìm thấy email!</h1>
            <p className="mb-4 text-sm sm:text-base">Vui lòng bắt đầu lại quá trình đăng ký.</p>
            <Link href="/register" className="text-blue-500 hover:underline text-sm sm:text-base">
              Quay lại trang đăng ký
            </Link>
          </div>
        </BackgroundCard>
      </BackgroundLayout>
    )
  }

  const handleOtpChange = async (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) inputRefs.current[index + 1]?.focus()

    const otp_string = newOtp.join("")
    if (otp_string.length === 6) {
      setIsVerifying(true)
      try {
        const verifyResponse = await authService.verifySignupOtp(email, otp_string)
        if (verifyResponse.status === 200) {
          setMessage("Xác minh email thành công! Đang tạo tài khoản...")
          setMessageType("success")

          const registrationData = JSON.parse(localStorage.getItem("registrationData") || "{}")
          const signupResponse = await authService.signup(registrationData)
          if (signupResponse.status === 200) {
            Cookies.remove("email-signup")
            Cookies.remove("otp-signup")
            localStorage.removeItem("registrationData")

            setTimeout(() => router.push("/login"), 2000)
          }
        }
      } catch (error: any) {
        setMessage(error.message || "Xác minh thất bại. Vui lòng thử lại.")
        setMessageType("error")
        setIsVerifying(false)

        setTimeout(() => {
          setOtp(["", "", "", "", "", ""])
          setMessage("")
          setMessageType("")
          inputRefs.current[0]?.focus()
        }, 2000)
      }
    } else {
      setMessage("")
      setMessageType("")
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp]
      for (let i = 0; i < pastedData.length; i++) newOtp[i] = pastedData[i]
      setOtp(newOtp)
      if (pastedData.length === 6) handleOtpChange(5, pastedData[5])
    }
  }

  return (
    <BackgroundLayout>
      <BackgroundCard>
        <div className="grid lg:grid-cols-2 min-h-[400px] sm:min-h-[500px]">
          {/* Cột bên trái - Form OTP */}
          <div className="p-4 sm:p-6 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
            <div className="max-w-sm mx-auto w-full space-y-4 sm:space-y-6">
              {/* Tiêu đề */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Xác minh Email</h1>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Chúng tôi đã gửi mã gồm 6 chữ số đến{" "}
                  <span className="font-medium break-all" style={{ color: "#93D6F6" }}>
                    {email}
                  </span>
                </p>
              </div>

              {/* Mẫu nhập OTP */}
              <form className="space-y-4">
                <div className="flex justify-center space-x-2 sm:space-x-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        if (el) inputRefs.current[index] = el
                      }}
                      value={otp[index] || ""}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      disabled={isVerifying}
                      className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold border-2 rounded-lg focus:ring-2 focus:border-transparent ${
                        isVerifying ? "opacity-50 cursor-not-allowed" : "border-gray-200"
                      }`}
                      style={{ "--tw-ring-color": "#93D6F6" } as React.CSSProperties}
                    />
                  ))}
                </div>

                {/* Thông báo */}
                {message && (
                  <div
                    className={`p-3 rounded-lg text-center font-medium text-sm sm:text-base ${
                      messageType === "success"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </form>

              {/* Gửi lại mã */}
              <div className="text-center space-y-2">
                <p className="text-xs sm:text-sm text-gray-600">Không nhận được mã?</p>
                <Button
                  variant="ghost"
                  disabled={isVerifying}
                  className={`text-sm sm:text-base ${isVerifying ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}`}
                  style={{ color: "#93D6F6" }}
                  onClick={async () => {
                    try {
                      const response = await authService.requestSignupOtp(email)
                      if (response.status === 200) {
                        Cookies.set("otp-signup", response.data, { expires: 5 / 1440 })
                        setMessage("Mã mới đã được gửi! Vui lòng kiểm tra email.")
                        setMessageType("success")
                      }
                    } catch (error: any) {
                      setMessage(error.message || "Gửi lại mã thất bại")
                      setMessageType("error")
                    }
                  }}
                >
                  Gửi lại mã
                </Button>
              </div>

              {/* Quay lại */}
              <div className="text-center">
                <Link href="/register" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700">
                  ← Quay lại đăng ký
                </Link>
              </div>
            </div>
          </div>

          {/* Cột bên phải - Whale Character */}
          <div className="flex items-center justify-center relative overflow-hidden p-4 sm:p-6 order-1 lg:order-2 min-h-[200px] sm:min-h-[250px] lg:min-h-auto">
            <div className="scale-75 sm:scale-90 lg:scale-100">
              <WhaleCharacter
                expression={messageType === "success" ? "happy" : "winking"}
                message={messageType === "success" ? "Thành công!" : "Kiểm tra email của bạn!"}
              />
            </div>
          </div>
        </div>
      </BackgroundCard>
    </BackgroundLayout>
  )
}
