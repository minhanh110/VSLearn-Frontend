"use client"

import {
  Home,
  BookOpen,
  Camera,
  CreditCard,
  Settings,
  X,
  FolderPlus,
  FileText,
  CheckCircle,
  Edit3,
  Users,
  BarChart3,
  Shield,
  Clock,
  DollarSign,
  UserCheck,
  LogIn,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useUserRole, UserRole } from "@/hooks/use-user-role"

interface FooterProps {
  isOpen?: boolean
  onClose?: () => void
  roleId?: string | null // Legacy prop for backward compatibility
}

// Define menu items for each role
const roleMenus = {
  guest: [
    { icon: Home, label: "Học theo chủ đề", href: "/homepage" },
    { icon: BookOpen, label: "Từ điển", href: "/dictionary" },
    { icon: LogIn, label: "Đăng nhập", href: "/login" },
  ],
  learner: [
    { icon: Home, label: "Học theo chủ đề", href: "/homepage" },
    { icon: BookOpen, label: "Từ điển", href: "/dictionary" },
    { icon: Camera, label: "Thực hành với Camera", href: "/practice" },
    { icon: Package, label: "Các gói học", href: "/packages" },
    { icon: Settings, label: "Cài đặt", href: "/settings" },
  ],
  "content-creator": [
    { icon: FolderPlus, label: "Chủ đề đã tạo", href: "/list-topics" },
    { icon: FileText, label: "Từ vựng đã tạo", href: "/list-vocab" },
    { icon: CheckCircle, label: "Chủ đề đang hoạt động", href: "/list-approved-topic" },
    { icon: Edit3, label: "từ vựng đang hoạt động", href: "/list-approved-vocab" },
    { icon: Settings, label: "Cài đặt", href: "/settings" },
  ],
  "content-approver": [
    { icon: Clock, label: "Chủ đề chờ duyệt", href: "/content-approver/topics" },
    { icon: Clock, label: "Từ vựng chờ duyệt", href: "/content-approver/vocabularies" },
    { icon: Shield, label: "Duyệt lộ trình học", href: "/content-approver/history" },
    { icon: CheckCircle, label: "Chủ đề đang hoạt động", href: "/list-approved-topic" },
    { icon: Edit3, label: "từ vựng đang hoạt động", href: "/list-approved-vocab" },
    { icon: Settings, label: "Cài đặt", href: "/settings" },
  ],
  "general-manager": [
    { icon: Users, label: "Quản lý học viên", href: "/general-manager/learners" },
    { icon: UserCheck, label: "Quản lý người biên soạn", href: "/general-manager/creators" },
    { icon: Shield, label: "Quản lý người kiểm duyệt", href: "/general-manager/approvers" },
    { icon: DollarSign, label: "Quản lý doanh thu", href: "/general-manager/revenue-dashboard" },
    { icon: Settings, label: "Cài đặt", href: "/settings" },
  ],
}

// Get all unique menu items when roleId is null
const getAllMenuItems = () => {
  const allItems = Object.values(roleMenus).flat()
  const uniqueItems = allItems.filter((item, index, self) => index === self.findIndex((t) => t.href === t.href))
  return uniqueItems
}

export function Footer({ isOpen = false, onClose, roleId = null }: FooterProps) {
  const { role, loading } = useUserRole()

  // Determine which menu items to show based on actual role from JWT
  const getMenuItems = () => {
    // If loading, show loading state or default menu
    if (loading) {
      return roleMenus.guest // Default to guest menu while loading
    }

    // Use actual role from JWT if available, otherwise fallback to roleId prop
    const currentRole = role || roleId as keyof typeof roleMenus
    
    if (currentRole && roleMenus[currentRole as keyof typeof roleMenus]) {
      return roleMenus[currentRole as keyof typeof roleMenus]
    }
    
    // Fallback to guest menu if role not found
    return roleMenus.guest
  }

  const menuItems = getMenuItems()

  return (
    <>
      {/* Desktop Sidebar - positioned below header */}
      <div className="hidden lg:block">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-12 h-[calc(100vh-3rem)] w-64 bg-gradient-to-b from-blue-100 to-cyan-100 transform transition-transform duration-300 z-40 shadow-lg flex flex-col ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close button */}
          <div className="flex justify-end p-6 pb-4 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/50 rounded-lg">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Menu items - Scrollable container */}
          <div className="flex-1 overflow-hidden px-6">
            <nav className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent hover:scrollbar-thumb-blue-400 pb-6">
              <div className="space-y-3">
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
              </div>
            </nav>
          </div>
        </aside>
      </div>

      {/* Mobile Footer - Only icons, scrollable horizontally if needed */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-200 to-cyan-200 border-t border-blue-300 z-30">
        <div className="overflow-x-auto scrollbar-none">
          <nav className="flex items-center py-3 px-2 min-w-max">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex flex-col items-center justify-center p-3 text-blue-600 hover:text-blue-800 transition-colors min-w-[60px]"
              >
                <item.icon className="w-6 h-6" />
              </Link>
            ))}
          </nav>
        </div>
      </footer>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-blue-300::-webkit-scrollbar-thumb {
          background-color: rgb(147 197 253);
          border-radius: 6px;
        }
        
        .scrollbar-thumb-blue-400:hover::-webkit-scrollbar-thumb {
          background-color: rgb(96 165 250);
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-none {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}