"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { User, Check, Loader2 } from "lucide-react"
import Image from "next/image"

// Import UserService instead of ProfileService
import userService, { type ProfileData } from "../services/user.service"
import authService from "../services/auth.service"

// Cute Whale Component
const CuteWhale = ({
  className = "",
  animationDelay = "0s",
}: {
  className?: string
  animationDelay?: string
}) => {
  return (
    <div className={`${className} animate-bounce`} style={{ animationDelay }}>
      <div className="relative">
        <Image
          src="/images/whale-happy.png"
          alt="Cute Whale"
          width={64}
          height={64}
          className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain"
        />
        {/* Floating bubbles around the whale */}
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-1 h-1 sm:w-2 sm:h-2 bg-blue-300 rounded-full animate-ping opacity-70"></div>
        <div
          className="absolute -top-2 right-2 sm:-top-3 sm:right-3 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-cyan-200 rounded-full animate-ping opacity-50"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-1 -left-1 sm:top-2 sm:-left-2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-200 rounded-full animate-ping opacity-60"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  )
}

// Predefined avatar options (similar to Quizizz style)
const AVATAR_OPTIONS = [
  { id: "avatar1", url: "/avatars/avatar-1.png", name: "Blue Cat" },
  { id: "avatar2", url: "/avatars/avatar-2.png", name: "Pink Fox" },
  { id: "avatar3", url: "/avatars/avatar-3.png", name: "Green Owl" },
  { id: "avatar4", url: "/avatars/avatar-4.png", name: "Orange Tiger" },
  { id: "avatar5", url: "/avatars/avatar-5.png", name: "Purple Panda" },
  { id: "avatar6", url: "/avatars/avatar-6.png", name: "Red Dragon" },
  { id: "avatar7", url: "/avatars/avatar-7.png", name: "Yellow Lion" },
  { id: "avatar8", url: "/avatars/avatar-8.png", name: "Cyan Dolphin" },
  { id: "avatar9", url: "/avatars/avatar-9.png", name: "Pink Unicorn" },
  { id: "avatar10", url: "/avatars/avatar-10.png", name: "Brown Bear" },
  { id: "avatar11", url: "/avatars/avatar-11.png", name: "Gray Wolf" },
  { id: "avatar12", url: "/avatars/avatar-12.png", name: "Green Frog" },
]

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    userAvatar: "",
  })

  useEffect(() => {
    // Check authentication first
    if (!authService.isAuthenticated()) {
      router.push("/login?returnUrl=" + encodeURIComponent("/edit-profile"))
      return
    }

    loadProfile()
  }, [router])

  const loadProfile = async () => {
    try {
      setInitialLoading(true)
      const data = await userService.getUserProfile()

      // Ensure we have valid data and fill the form
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phoneNumber: data.phoneNumber || "",
        userAvatar: data.userAvatar || "",
      })

      console.log("Profile data loaded:", data) // Debug log
    } catch (error) {
      console.error("Load profile error:", error)
      toast.error("Failed to load profile data")
      // Redirect to login if auth failed
      if (error instanceof Error && (error.message.includes("Authentication") || error.message.includes("401"))) {
        router.push("/login?returnUrl=" + encodeURIComponent("/edit-profile"))
      }
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleAvatarSelect = (avatarUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      userAvatar: avatarUrl,
    }))
    setShowAvatarSelector(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSubmitMessage(null) // Clear previous messages

    try {
      // Prepare data according to ProfileData interface
      const updateData: ProfileData = {
        firstName: formData.firstName?.trim(),
        lastName: formData.lastName?.trim(),
        phoneNumber: formData.phoneNumber?.trim(),
        userAvatar: formData.userAvatar,
      }

      await userService.updateUserProfile(updateData)
      setSubmitMessage({
        type: "success",
        text: "Profile updated successfully! ✅",
      })

      // Clear message after 5 seconds
      setTimeout(() => {
        setSubmitMessage(null)
      }, 5000)
    } catch (error) {
      console.error("Update profile error:", error)
      setSubmitMessage({
        type: "error",
        text: "Failed to update profile. Please try again. ❌",
      })

      // Clear error message after 7 seconds
      setTimeout(() => {
        setSubmitMessage(null)
      }, 7000)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const getSelectedAvatar = () => {
    return AVATAR_OPTIONS.find((avatar) => avatar.url === formData.userAvatar)
  }

  // Show loading spinner while fetching initial data
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-blue-100 relative overflow-hidden">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

        <div className="pt-20 pb-28 lg:pb-20 px-4 min-h-screen relative z-10">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "#93D6F6" }} />
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>

        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-200/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-40 left-16 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-300/25 rounded-full blur-xl animate-bounce"></div>

        {/* Sparkle stars */}
        <div className="absolute top-32 left-1/4 w-6 h-6 text-blue-400 animate-pulse">✨</div>
        <div className="absolute top-48 right-1/4 w-5 h-5 text-cyan-400 animate-bounce">⭐</div>
        <div className="absolute bottom-48 left-1/3 w-4 h-4 text-indigo-400 animate-pulse">💫</div>
        <div className="absolute bottom-36 right-1/3 w-6 h-6 text-blue-400 animate-bounce">✨</div>
      </div>

      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content Container */}
      <div className="relative z-10 pt-20 pb-28 lg:pb-20 px-4 min-h-screen">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
            {/* Left side - Cute Whales (Hidden on mobile, visible on desktop) */}
            <div className="hidden lg:flex flex-col items-center space-y-6 flex-shrink-0">
              <CuteWhale />
              <CuteWhale className="transform scale-x-[-1]" animationDelay="0.3s" />
              <CuteWhale animationDelay="0.6s" />
              <CuteWhale className="transform scale-x-[-1]" animationDelay="0.9s" />
            </div>

            {/* Center - Main Form Content */}
            <div className="flex-1 max-w-2xl mx-auto w-full space-y-6 p-4 sm:p-8 lg:p-12">
              {/* Mobile Whales - Top of form */}
              <div className="lg:hidden flex justify-center space-x-8 mb-6">
                <CuteWhale className="scale-75" />
                <CuteWhale className="scale-75 transform scale-x-[-1]" animationDelay="0.3s" />
              </div>

              {/* Title */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h1>
                <p className="text-gray-700">Chỉnh sửa thông tin cá nhân</p>
              </div>

              {/* Avatar Selection */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                    <AvatarImage src={formData.userAvatar || "/placeholder.svg?height=96&width=96"} alt="Profile" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl sm:text-2xl">
                      <User className="w-10 h-10 sm:w-12 sm:h-12" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-700 font-medium">{getSelectedAvatar()?.name || "Choose an avatar"}</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                    className="text-sm"
                    style={{ borderColor: "#93D6F6", color: "#93D6F6" }}
                    disabled={loading}
                  >
                    {showAvatarSelector ? "Hide Avatars" : "Choose Avatar"}
                  </Button>
                </div>

                {/* Avatar Selector Grid */}
                {showAvatarSelector && (
                  <div className="w-full max-w-md">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-white/10 rounded-lg">
                      {AVATAR_OPTIONS.map((avatar) => (
                        <div
                          key={avatar.id}
                          className={`relative cursor-pointer transition-all duration-200 hover:scale-105 ${
                            formData.userAvatar === avatar.url
                              ? "ring-2 ring-offset-2"
                              : "hover:ring-1 hover:ring-offset-1 hover:ring-gray-300"
                          }`}
                          style={
                            {
                              "--tw-ring-color": formData.userAvatar === avatar.url ? "#93D6F6" : undefined,
                            } as React.CSSProperties
                          }
                          onClick={() => handleAvatarSelect(avatar.url)}
                        >
                          <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                            <AvatarImage src={avatar.url || "/placeholder.svg"} alt={avatar.name} />
                            <AvatarFallback>{avatar.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {formData.userAvatar === avatar.url && (
                            <div
                              className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-white"
                              style={{ backgroundColor: "#93D6F6" }}
                            >
                              <Check className="w-2 h-2 sm:w-3 sm:h-3" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Profile Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      Tên *
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base"
                      style={{ "--tw-ring-color": "#93D6F6" } as React.CSSProperties}
                      disabled={loading}
                      required
                      placeholder="Nhập tên của bạn"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Họ *
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base"
                      style={{ "--tw-ring-color": "#93D6F6" } as React.CSSProperties}
                      disabled={loading}
                      required
                      placeholder="Nhập họ của bạn"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    Số điện thoại
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base"
                    style={{ "--tw-ring-color": "#93D6F6" } as React.CSSProperties}
                    disabled={loading}
                  />
                </div>

                {/* Submit Message */}
                {submitMessage && (
                  <div
                    className={`p-3 sm:p-4 rounded-lg text-center font-medium text-sm sm:text-base ${
                      submitMessage.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {submitMessage.text}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading || !formData.firstName?.trim() || !formData.lastName?.trim()}
                    className="flex-1 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50 text-sm sm:text-base"
                    style={{ backgroundColor: "#93D6F6" }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Đang lưu...
                      </>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base bg-transparent"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Hủy
                  </Button>
                </div>
              </form>

              {/* Additional Options */}
              <div className="text-center space-y-2">
                <Link href="/change-password" className="text-sm block hover:opacity-80" style={{ color: "#93D6F6" }}>
                  Đổi mật khẩu
                </Link>
                <Link href="/homepage" className="text-sm text-gray-500 hover:text-gray-700 block">
                  ← Quay về trang chính
                </Link>
              </div>
            </div>

            {/* Right side - Cute Whales (Hidden on mobile, visible on desktop) */}
            <div className="hidden lg:flex flex-col items-center space-y-6 flex-shrink-0">
              <CuteWhale className="transform scale-x-[-1]" animationDelay="0.2s" />
              <CuteWhale animationDelay="0.5s" />
              <CuteWhale className="transform scale-x-[-1]" animationDelay="0.8s" />
              <CuteWhale animationDelay="1.1s" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}
