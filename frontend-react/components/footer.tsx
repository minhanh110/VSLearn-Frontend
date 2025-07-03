"use client"

import { Home, BookOpen, Camera, DollarSign, Settings, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useUser } from "@/hooks/useUser"

interface FooterProps {
  isOpen?: boolean
  onClose?: () => void
}

const menuItems = [
  { icon: Home, label: "Học theo chủ đề", href: "/homepage" },
  { icon: BookOpen, label: "Từ điển", href: "/dictionary" },
  { icon: Camera, label: "Thực hành Camera", href: "/practice" },
  { icon: DollarSign, label: "Các gói học", href: "/packages" },
  { icon: Settings, label: "Cài đặt", href: "/settings" },
]

export function Footer({ isOpen = false, onClose }: FooterProps) {
  const { userInfo, loading, isAuthenticated } = useUser()

  return (
    <>
      {/* Desktop Sidebar - positioned below header */}
      <div className="hidden lg:block">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-12 h-[calc(100vh-3rem)] w-64 bg-gradient-to-b from-blue-100 to-cyan-100 transform transition-transform duration-300 z-40 shadow-lg ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close button */}
          <div className="flex justify-end p-6">
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/50 rounded-lg">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User info section - chỉ hiện cho authenticated users */}
          {isAuthenticated && (
            <div className="px-6 mb-6">
              <div className="bg-white/60 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {loading ? "Loading..." : (userInfo?.displayName || "User")}
                    </p>
                    <p className="text-xs text-gray-500">Học viên</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Guest info section - chỉ hiện cho guest users */}
          {!isAuthenticated && (
            <div className="px-6 mb-6">
              <div className="bg-white/60 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">Khách</p>
                    <p className="text-xs text-gray-500">Chưa đăng nhập</p>
                  </div>
                </div>
                <Link
                  href="/login"
                  className="mt-3 w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-center block"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          )}

          {/* Menu items */}
          <nav className="px-6 space-y-3">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-4 px-5 py-4 rounded-xl text-gray-700 hover:bg-white/60 transition-all duration-200 hover:shadow-md group whitespace-nowrap"
                onClick={onClose}
              >
                <item.icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>
      </div>

      {/* Mobile Footer - Only icons */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-200 to-cyan-200 border-t border-blue-300 z-30">
        <nav className="flex items-center justify-around py-3">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex flex-col items-center justify-center p-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <item.icon className="w-6 h-6" />
            </Link>
          ))}
        </nav>
      </footer>
    </>
  )
}
