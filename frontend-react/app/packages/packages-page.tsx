"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function PackagesPageComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const packages = [
    {
      id: "1month",
      title: "GÓI 1 THÁNG",
      description: "Gói học cơ bản cho người mới bắt đầu khám phá ngôn ngữ ký hiệu",
      price: "100.000 VND",
      duration: "1 tháng",
      features: ["Truy cập tất cả bài học cơ bản", "Từ điển ngôn ngữ ký hiệu", "Thực hành với camera", "Hỗ trợ 24/7"],
      isPopular: false,
      bgColor: "bg-white",
      borderColor: "border-gray-200",
      textColor: "text-gray-700",
      buttonStyle: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    },
    {
      id: "3months",
      title: "GÓI 3 THÁNG",
      description: "Gói học được khuyến nghị cho việc học tập hiệu quả và tiến bộ nhanh chóng",
      price: "250.000 VND",
      duration: "3 tháng",
      features: [
        "Tất cả tính năng gói 1 tháng",
        "Bài học nâng cao",
        "Kiểm tra tiến độ",
        "Chứng chỉ hoàn thành",
        "Ưu tiên hỗ trợ",
      ],
      isPopular: true,
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500",
      textColor: "text-white",
      buttonStyle: "bg-white hover:bg-gray-100 text-blue-500",
    },
    {
      id: "6months",
      title: "GÓI 6 THÁNG",
      description: "Gói học toàn diện cho việc thành thạo ngôn ngữ ký hiệu một cách hoàn thiện",
      price: "500.000 VND",
      duration: "6 tháng",
      features: [
        "Tất cả tính năng gói 3 tháng",
        "Bài học chuyên sâu",
        "Lớp học trực tuyến",
        "Mentor cá nhân",
        "Tài liệu độc quyền",
      ],
      isPopular: false,
      bgColor: "bg-white",
      borderColor: "border-gray-200",
      textColor: "text-gray-700",
      buttonStyle: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    },
  ]

  const handlePurchase = (packageId: string) => {
    // Handle package purchase logic here
    console.log(`Purchasing package: ${packageId}`)
    // You can integrate with payment gateway here
    alert("Chức năng thanh toán sẽ được tích hợp sớm!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-6 h-6 text-blue-300 animate-pulse">⭐</div>
        <div className="absolute top-32 right-24 w-5 h-5 text-cyan-300 animate-bounce">⭐</div>
        <div className="absolute bottom-40 left-16 w-5 h-5 text-blue-300 animate-pulse">⭐</div>
        <div className="absolute bottom-32 right-20 w-6 h-6 text-cyan-300 animate-bounce">⭐</div>
      </div>

      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 relative">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">Nghe bằng mắt</h1>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">Hiểu bằng trái tim</h2>
              <p className="text-gray-600 text-lg mb-6">
                Chạm đến trái tim người khiếm thính - Bắt đầu bằng một gói học!
              </p>
            </div>

            {/* Mascot - positioned in right corner, hidden on mobile */}
            <div className="absolute top-0 right-4 z-20 hidden md:block">
              <div className="relative animate-bounce">
                <Image
                  src="/images/whale-coin.png"
                  alt="VSLearn whale mascot with coin"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-2xl border-2 ${pkg.borderColor} ${pkg.bgColor} p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  pkg.isPopular ? "ring-4 ring-blue-200" : ""
                }`}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                      KHUYẾN NGHỊ
                    </div>
                  </div>
                )}

                {/* Package Header */}
                <div className="text-center mb-6">
                  <h3 className={`text-lg font-bold ${pkg.textColor} mb-2`}>{pkg.title}</h3>
                  <p className={`text-sm ${pkg.isPopular ? "text-blue-100" : "text-gray-500"} mb-4`}>
                    {pkg.description}
                  </p>
                  <div className={`text-3xl font-bold ${pkg.textColor} mb-2`}>{pkg.price}</div>
                  <div className={`text-sm ${pkg.isPopular ? "text-blue-100" : "text-gray-500"}`}>{pkg.duration}</div>
                </div>

                {/* Features List */}
                <div className="mb-6">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className={`w-5 h-5 ${pkg.isPopular ? "text-white" : "text-green-500"} flex-shrink-0`} />
                        <span className={`text-sm ${pkg.textColor}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Purchase Button */}
                <Button
                  onClick={() => handlePurchase(pkg.id)}
                  className={`w-full py-3 rounded-xl font-bold transition-all duration-200 ${pkg.buttonStyle}`}
                >
                  MUA NGAY
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default PackagesPageComponent
