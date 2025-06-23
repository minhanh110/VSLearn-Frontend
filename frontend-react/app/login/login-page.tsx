"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { WhaleCharacter } from "../../components/whale-character"
import { BackgroundLayout } from "../../components/background-layout"
import { BackgroundCard } from "../../components/background-card"
import { Logo } from "../../components/logo"
import authService from "../services/auth.service"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'oauth2_failed') {
      setError('Đăng nhập Google thất bại. Vui lòng thử lại hoặc sử dụng tài khoản email.')
    } else if (errorParam === 'true') {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true);
    try {
      const jsonObj = await authService.login({
        username: formData.username,
        password: formData.password,
      });
      if (jsonObj.status === 200) {
        router.push("/homepage")
      }
    } catch (err: any) {
      setError(err.message || "Registration failed")
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  return (
    <BackgroundLayout>
      <BackgroundCard>
        <div className="flex items-center justify-between">
          {/* Left side - Login Form */}
          <div className="w-full max-w-sm space-y-6">
            {/* Logo and Title */}
            <div className="text-center space-y-4">
              <Logo size="lg" />
              <h1 className="text-3xl font-bold text-gray-900">Đăng nhập</h1>
            </div>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Tên đăng nhập
                </Label>
                <Input
                  value={formData.username}
                  name="username"
                  onChange={handleChange}
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập của bạn"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "#93D6F6" } as React.CSSProperties}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </Label>
                <Input
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu của bạn"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": "#93D6F6" } as React.CSSProperties}
                />
              </div>

              <div className="text-right">
                <Link href="/forgot-password" className="text-sm hover:opacity-80" style={{ color: "#93D6F6" }}>
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: "#93D6F6" }}
              >
                {loading ? "Đăng nhập..." : "Đăng nhập"}

              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500">Hoặc đăng nhập với</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              variant="outline"
              className="w-full py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng nhập với Google
            </Button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600">
              {"Bạn chưa có tài khoản? "}
              <Link href="/register" className="font-medium hover:opacity-80" style={{ color: "#93D6F6" }}>
                Đăng ký
              </Link>
            </p>
          </div>

          {/* Right side - Whale Character */}
          <div className="hidden lg:block flex-1 flex justify-center items-center">
            <div className="relative">
              <WhaleCharacter expression="happy" message="Hear my hand" size="lg" />
            </div>
          </div>
        </div>
      </BackgroundCard>
    </BackgroundLayout>
  )
}
