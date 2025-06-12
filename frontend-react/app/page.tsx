import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function HomePage() {
  const pages = [
    { name: "Login", href: "/login", color: "bg-blue-500" },
    { name: "Register", href: "/register", color: "bg-purple-500" },
    { name: "Forgot Password", href: "/forgot-password", color: "bg-indigo-500" },
    { name: "Reset Password", href: "/reset-password", color: "bg-amber-500" },
    { name: "OTP Verification", href: "/otp", color: "bg-green-500" },
    { name: "Change Password", href: "/change-password", color: "bg-orange-500" },
    { name: "Edit Profile", href: "/edit-profile", color: "bg-cyan-500" },
    { name: "Login with Email", href: "/login-email", color: "bg-emerald-500" },
    { name: "Logout", href: "/logout", color: "bg-red-500" },
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Whale Auth System</h1>
              <p className="text-gray-600">Complete authentication system with beautiful whale-themed design</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((page) => (
                <Link key={page.name} href={page.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 ${page.color} rounded-full mx-auto mb-4 flex items-center justify-center`}
                      >
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                      <h3 className="font-semibold text-gray-900">{page.name}</h3>
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
