"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { packagesApi, Package } from "@/lib/api/packages"

export function PackagesPageComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const response = await packagesApi.getPackages()
        if (response.success) {
          const transformedPackages: Package[] = response.data.content.map((item: any, index: number) => ({
            id: item.id.toString(),
            title: item.pricingType,
            description: item.description || '',
            price: item.price.toLocaleString('vi-VN') + ' VND',
            duration: item.durationDays.toString() + ' ngày',
            features: [], // Backend chưa có features field
            isPopular: index === 1, // Gói thứ 2 sẽ là popular
            status: 'active',
            createdAt: new Date(item.createdAt).toLocaleDateString('vi-VN'),
            updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('vi-VN') : '-',
            // UI properties
            bgColor: index === 1 ? "bg-blue-500" : "bg-white",
            borderColor: index === 1 ? "border-blue-500" : "border-gray-200",
            textColor: index === 1 ? "text-white" : "text-gray-700",
            buttonStyle: index === 1 ? "bg-white hover:bg-gray-100 text-blue-500" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }))
          setPackages(transformedPackages)
        } else {
          setError(response.message || 'Không thể tải danh sách gói học')
        }
      } catch (error: any) {
        console.error('Error fetching packages:', error)
        setError('Có lỗi xảy ra khi tải danh sách gói học')
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const handlePurchaseClick = (pkg: any) => {
    setSelectedPackage(pkg)
    setShowConfirmModal(true)
  }

  const handleConfirmPurchase = () => {
    setShowConfirmModal(false)
    // Redirect to payment page with package info
    if (selectedPackage) {
      const packageInfo = encodeURIComponent(JSON.stringify({
        id: selectedPackage.id,
        title: selectedPackage.title,
        price: selectedPackage.price,
        duration: selectedPackage.duration,
        features: selectedPackage.features
      }))
      router.push(`/payment?package=${packageInfo}`)
    } else {
    router.push("/payment")
    }
  }

  const handleCancelPurchase = () => {
    setShowConfirmModal(false)
  }

  const handleMaybeLater = () => {
    setShowConfirmModal(false)
    router.push("/homepage")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-700 font-medium">Đang tải danh sách gói học...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              Thử lại
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (packages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-600 font-medium mb-4">Chưa có gói học nào</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              Tải lại
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
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
                  onClick={() => handlePurchaseClick(pkg)}
                  className={`w-full py-3 rounded-xl font-bold transition-all duration-200 ${pkg.buttonStyle}`}
                >
                  MUA NGAY
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal - Simple design like submit popup */}
      {showConfirmModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xs sm:max-w-md mx-4 text-center shadow-xl border-4 border-blue-200">
            {/* Mascot */}
            <div className="flex justify-center mb-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test-nopbai-Zs8JdTqWx02xS7owLjRjo7VBCfEiVs.png"
                alt="Whale with question mark"
                width={120}
                height={120}
                className="object-contain animate-bounce"
              />
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-blue-800 mb-6">BẠN CÓ MUỐN MUA GÓI HỌC?</h3>

            {/* Package Info */}
            <div className="mb-6 p-4 bg-blue-50 rounded-2xl">
              <h4 className="font-bold text-blue-700 mb-2">{selectedPackage.title}</h4>
              <p className="text-blue-600 text-lg font-bold">{selectedPackage.price}</p>
              <p className="text-blue-500 text-sm">{selectedPackage.duration}</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleCancelPurchase}
                className="flex-1 bg-gradient-to-r from-blue-300 to-cyan-300 hover:from-blue-400 hover:to-cyan-400 text-white font-bold py-3 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                QUAY VỀ
              </Button>
              <Button
                onClick={handleConfirmPurchase}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                MUA NGAY
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default PackagesPageComponent
