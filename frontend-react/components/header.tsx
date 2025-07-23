"use client"

import { useState } from "react"
import { Bell, Menu, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@/hooks/useUser"
import { useUserRole } from "@/hooks/use-user-role"

interface HeaderProps {
  onMenuToggle?: () => void
  showMenuButton?: boolean
}

export function Header({ onMenuToggle, showMenuButton = true }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const { userInfo, loading, isAuthenticated } = useUser()
  const { role } = useUserRole()

  // Map role sang tên tiếng Việt
  const roleLabel = (() => {
    switch (role) {
      case 'general-manager': return 'Quản lý tổng';
      case 'content-creator': return 'Người tạo nội dung';
      case 'content-approver': return 'Duyệt nội dung';
      case 'learner': return 'Học viên';
      default: return 'Khách';
    }
  })();

  const truncateUsername = (name: string, maxLength = 15) => {
    if (!name || name.length <= maxLength) return name
    return name.substring(0, maxLength) + "..."
  }

  // Get display name or fallback
  const displayName = userInfo?.displayName || "User"
  const firstName = userInfo?.firstName || ""
  const userAvatar = userInfo?.userAvatar

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-200 to-cyan-200 py-2 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
        {/* Left side - Menu button only for desktop - BIGGER */}
        <div className="flex items-center gap-3 w-1/4 pl-0">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
<<<<<<< HEAD
              onClick={onMenuToggle}
=======
              onClick={() => {
                console.log("Menu button clicked in Header component");
                if (onMenuToggle) {
                  onMenuToggle();
                }
              }}
>>>>>>> origin/QuocPMHE172252
              // Tăng lề âm để dịch chuyển sát hơn nữa về bên trái
              className="p-3 hidden lg:flex hover:bg-white/30 rounded-xl transition-all duration-300 ml-[-3rem]"
            >
              <Menu className="w-12 h-12 text-gray-700" /> {/* Tăng kích thước icon */}
            </Button>
          )}
        </div>

        {/* Center - Logo */}
        <div className="flex items-center justify-center flex-1">
          <Image
            src="/images/vslearn-logo-new.png"
            alt="VSLearn Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Right side - Avatar with greeting and Notifications */}
        <div className="flex items-center gap-3 justify-end w-1/4">
          {/* User Avatar with greeting and dropdown - HOVER TRIGGER */}
          <div className="group relative">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-white/30 rounded-xl p-2 transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
              {/* Greeting text - only on desktop with truncation */}
              <span className="hidden lg:block text-gray-700 font-semibold group-hover:text-gray-800 max-w-[120px] truncate text-sm">
                {loading ? "Loading..." : `Xin chào ${truncateUsername(displayName)}`}
              </span>

              {/* Avatar with gradient border */}
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 group-hover:scale-110 shadow-lg">
                  {userAvatar ? (
                    <Image
                      src={userAvatar || "/placeholder.svg"}
                      alt="User avatar"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {firstName ? firstName.charAt(0).toUpperCase() : isAuthenticated ? "U" : "G"}
                    </span>
                  )}
                </div>
                {/* Online indicator - only for authenticated users */}
                {isAuthenticated && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                )}
              </div>
            </div>

            {/* Beautiful Dropdown Menu - chỉ hiện cho authenticated users */}
            {isAuthenticated && (
              <div className="absolute right-0 top-full mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                {/* Header with user info */}
                <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      {userAvatar ? (
                        <Image
                          src={userAvatar || "/placeholder.svg"}
                          alt="User avatar"
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold">
                          {firstName ? firstName.charAt(0).toUpperCase() : "U"}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {loading ? "Loading..." : truncateUsername(displayName, 20)}
                      </p>
                      <p className="text-xs text-gray-500">{roleLabel}</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-2">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 group/item"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover/item:bg-blue-200 transition-colors">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Xem hồ sơ</span>
                  </Link>

                  <Link
                    href="/edit-profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 group/item"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover/item:bg-purple-200 transition-colors">
                      <Settings className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium">Chỉnh sửa hồ sơ</span>
                  </Link>

                  {/* Divider */}
                  <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                  <Link
                    href="/logout"
                    className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 group/item"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover/item:bg-red-200 transition-colors">
                      <LogOut className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="font-medium">Đăng xuất</span>
                  </Link>
                </div>

                {/* Bottom decoration */}
                <div className="h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400"></div>
              </div>
            )}

            {/* Login button for guest users */}
            {!isAuthenticated && (
              <div className="absolute right-0 top-full mt-3 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100">
                  <p className="font-semibold text-gray-800 text-sm">Khách</p>
                  <p className="text-xs text-gray-500">Đăng nhập để có trải nghiệm tốt hơn</p>
                </div>
                <div className="py-2">
                  <Link
                    href="/login"
                    className="flex items-center px-4 py-3 text-sm text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 group/item"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover/item:bg-blue-200 transition-colors">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Đăng nhập</span>
                  </Link>
                </div>
                <div className="h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400"></div>
              </div>
            )}
          </div>

          {/* Beautiful Notifications - BIGGER */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 hover:bg-white/30 rounded-xl transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
            >
              <Bell className="w-10 h-10 text-gray-600" />
              {/* Animated notification badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm rounded-full flex items-center justify-center animate-pulse shadow-lg font-bold">
                3
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
