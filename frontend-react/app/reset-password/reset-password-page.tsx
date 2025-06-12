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

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate success
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!otp) {
      alert("OTP is missing. Please request a new password reset.");
      return;
    }
    authService.resetPassword(otp, newPassword, confirmPassword)
      .then((data) => {
        if (data.status === 200) {
          Cookies.remove("email-reset")
          Cookies.remove("otp")
          router.push("/login")
        } else {
          alert("Failed to reset password. Please try again.")
        }
      })
      .catch((error) => {
        alert(error.message || "An error occurred while resetting the password.")
      })
    setIsSuccess(true)
  }

  // Password validation
  const passwordRequirements = [
    { text: "At least 8 characters", valid: newPassword.length >= 8 },
    { text: "One uppercase letter", valid: /[A-Z]/.test(newPassword) },
    { text: "One lowercase letter", valid: /[a-z]/.test(newPassword) },
    { text: "One number", valid: /\d/.test(newPassword) },
    { text: "One special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ]

  if (isSuccess) {
    return (
      <BackgroundLayout>
        <BackgroundCard>
          <div className="p-8 text-center space-y-6">
            {/* Success Icon */}
            <div
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#93D6F6", opacity: 0.2 }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: "#93D6F6" }} />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Password Reset!</h1>
              <p className="text-gray-600">Your password has been successfully reset</p>
            </div>

            {/* Whale Character */}
            <div className="py-4">
              <WhaleCharacter expression="excited" message="All set!" size="sm" />
            </div>

            {/* Button */}
            <Button
              asChild
              className="w-full max-w-xs mx-auto text-white py-3 rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: "#93D6F6" }}
            >
              <Link href="/login">Continue to Login</Link>
            </Button>

            {/* Footer */}
            <p className="text-xs text-gray-500">You can now sign in with your new password</p>
          </div>
        </BackgroundCard>
      </BackgroundLayout>
    )
  }

  return (
    <BackgroundLayout>
      <BackgroundCard>
        <div className="grid lg:grid-cols-2 min-h-[700px]">
          {/* Left side - Reset Password Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full space-y-6">
              {/* Title */}
              <div className="text-center space-y-2">
                <div
                  className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#93D6F6", opacity: 0.2 }}
                >
                  <Shield className="w-8 h-8" style={{ color: "#93D6F6" }} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
                <p className="text-gray-600">Enter your new password below</p>
              </div>

              {/* Reset Password Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                {newPassword && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</p>
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
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
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
                  className="w-full text-white py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#93D6F6" }}
                >
                  Reset Password
                </Button>
              </form>

              {/* Back Link */}
              <div className="text-center">
                <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
                  ← Back to Login
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="flex items-center justify-center relative overflow-hidden">
            <WhaleCharacter expression="happy" message="Almost there!" />
          </div>
        </div>
      </BackgroundCard>
    </BackgroundLayout>
  )
}
