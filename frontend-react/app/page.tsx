import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function HomePage() {
  const pages = [
    { name: "Đăng nhập", href: "/login", color: "bg-blue-500" },
    { name: "Đăng ký", href: "/register", color: "bg-purple-500" },
    { name: "Quên mật khẩu", href: "/forgot-password", color: "bg-indigo-500" },
    { name: "Đặt lại mật khẩu", href: "/reset-password", color: "bg-amber-500" },
    { name: "Xác thực OTP", href: "/otp", color: "bg-green-500" },
    { name: "Đổi mật khẩu", href: "/change-password", color: "bg-orange-500" },
    { name: "Chỉnh sửa hồ sơ", href: "/edit-profile", color: "bg-cyan-500" },
    { name: "Đăng xuất", href: "/logout", color: "bg-red-500" },
    { name: "🏠 Homepage VSLearn", href: "/homepage", color: "bg-gradient-to-r from-blue-600 to-cyan-600" },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <Image src="/images/whale-background.png" alt="Whale background" fill className="object-cover" priority />
        {/* Muted overlay */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Hệ thống xác thực Whale</h1>
              <p className="text-gray-600">Hệ thống xác thực hoàn chỉnh với thiết kế chủ đề cá voi đẹp mắt</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((page) => (
                <Link key={page.name} href={page.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 ${page.color} rounded-full mx-auto mb-4 flex items-center justify-center`}
                      >
                        {page.name.includes("Homepage") ? (
                          <span className="text-white text-xl">🏠</span>
                        ) : (
                          <div className="w-6 h-6 bg-white rounded-full"></div>
                        )}
                      </div>
                      <h3
                        className={`font-semibold ${page.name.includes("Homepage") ? "text-blue-600" : "text-gray-900"}`}
                      >
                        {page.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
