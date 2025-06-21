"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { BackgroundLayout } from "../../components/background-layout"
import { WhaleCharacter } from "../../components/whale-character"
import { User, Check, Loader2 } from "lucide-react"
import { BackgroundCard } from "../../components/background-card"

// Import UserService instead of ProfileService
import userService, { ProfileData } from "../services/user.service"

// Predefined avatar options (similar to Quizizz style)
const AVATAR_OPTIONS = [
  { id: 'avatar1', url: '/avatars/avatar-1.png', name: 'Blue Cat' },
  { id: 'avatar2', url: '/avatars/avatar-2.png', name: 'Pink Fox' },
  { id: 'avatar3', url: '/avatars/avatar-3.png', name: 'Green Owl' },
  { id: 'avatar4', url: '/avatars/avatar-4.png', name: 'Orange Tiger' },
  { id: 'avatar5', url: '/avatars/avatar-5.png', name: 'Purple Panda' },
  { id: 'avatar6', url: '/avatars/avatar-6.png', name: 'Red Dragon' },
  { id: 'avatar7', url: '/avatars/avatar-7.png', name: 'Yellow Lion' },
  { id: 'avatar8', url: '/avatars/avatar-8.png', name: 'Cyan Dolphin' },
  { id: 'avatar9', url: '/avatars/avatar-9.png', name: 'Pink Unicorn' },
  { id: 'avatar10', url: '/avatars/avatar-10.png', name: 'Brown Bear' },
  { id: 'avatar11', url: '/avatars/avatar-11.png', name: 'Gray Wolf' },
  { id: 'avatar12', url: '/avatars/avatar-12.png', name: 'Green Frog' }
]

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    userAvatar: ""
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setInitialLoading(true)
      const data = await userService.getUserProfile()
      
      // Ensure we have valid data and fill the form
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phoneNumber: data.phoneNumber || "",
        userAvatar: data.userAvatar || ""
      })
      
      console.log("Profile data loaded:", data) // Debug log
    } catch (error) {
      console.error("Load profile error:", error)
      toast.error("Failed to load profile data")
      // Optionally redirect to login if auth failed
      // router.push("/login")
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleAvatarSelect = (avatarUrl: string) => {
    setFormData(prev => ({
      ...prev,
      userAvatar: avatarUrl
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
        userAvatar: formData.userAvatar
      }
      
      await userService.updateUserProfile(updateData)
      setSubmitMessage({
        type: 'success',
        text: 'Profile updated successfully! ✅'
      })
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubmitMessage(null)
      }, 5000)
      
    } catch (error) {
      console.error("Update profile error:", error)
      setSubmitMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again. ❌'
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
    return AVATAR_OPTIONS.find(avatar => avatar.url === formData.userAvatar)
  }

  // Show loading spinner while fetching initial data
  if (initialLoading) {
    return (
      <BackgroundLayout>
        <BackgroundCard>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "#93D6F6" }} />
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </BackgroundCard>
      </BackgroundLayout>
    )
  }

  return (
    <BackgroundLayout>
      <BackgroundCard>
        {/* Top section - Whale Character */}
        <div className="flex justify-center mb-8">
          <WhaleCharacter expression="happy" message="Looking good!" size="md" />
        </div>

        {/* Bottom section - Edit Profile Form */}
        <div className="p-8 lg:p-12">
          <div className="max-w-2xl mx-auto w-full space-y-6">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h1>
              <p className="text-gray-600">Chỉnh sửa thông tin cá nhân</p>
            </div>

            {/* Avatar Selection */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage 
                    src={formData.userAvatar || "/placeholder.svg?height=96&width=96"} 
                    alt="Profile" 
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  {getSelectedAvatar()?.name || "Choose an avatar"}
                </p>
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
                  <div className="grid grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg border">
                    {AVATAR_OPTIONS.map((avatar) => (
                      <div
                        key={avatar.id}
                        className={`relative cursor-pointer transition-all duration-200 hover:scale-105 ${
                          formData.userAvatar === avatar.url 
                            ? 'ring-2 ring-offset-2' 
                            : 'hover:ring-1 hover:ring-offset-1 hover:ring-gray-300'
                        }`}
                        style={{ 
                          '--tw-ring-color': formData.userAvatar === avatar.url ? '#93D6F6' : undefined 
                        } as React.CSSProperties}
                        onClick={() => handleAvatarSelect(avatar.url)}
                      >
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={avatar.url} alt={avatar.name} />
                          <AvatarFallback>{avatar.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {formData.userAvatar === avatar.url && (
                          <div 
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: '#93D6F6' }}
                          >
                            <Check className="w-3 h-3" />
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "#93D6F6" } as React.CSSProperties}
                  disabled={loading}
                />
              </div>

              {/* Submit Message */}
              {submitMessage && (
                <div className={`p-4 rounded-lg text-center font-medium ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {submitMessage.text}
                </div>
              )}

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading || !formData.firstName?.trim() || !formData.lastName?.trim()}
                  className="flex-1 text-white py-3 rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#93D6F6" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Đang lưu...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 py-3 rounded-lg font-medium"
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
              <Link href="/lesson-path" className="text-sm text-gray-500 hover:text-gray-700 block">
                ← Quay về trang chính
              </Link>
            </div>
          </div>
        </div>
      </BackgroundCard>
    </BackgroundLayout>
  )
}