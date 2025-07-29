"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, Check } from "lucide-react"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { packagesApi, Package } from "@/lib/api/packages"



const PackageDetailPageComponent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [packageData, setPackageData] = useState<Package | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    isLoading: false,
  })

  useEffect(() => {
    if (!packageId) return

    const fetchPackage = async () => {
      try {
        setLoading(true)
        const response = await packagesApi.getPackageById(packageId)
        console.log('Package detail API response:', response)
        if (response.success) {
          const packageData = response.data
          const transformedPackage: Package = {
            id: packageData.id.toString(),
            title: packageData.pricingType, // Sử dụng pricingType thay vì packageName
            description: packageData.description || '',
            price: packageData.price.toLocaleString('vi-VN'),
            duration: packageData.durationDays.toString(),
            features: [], // Backend doesn't have features field yet
            isPopular: false, // Backend doesn't have isPopular field yet
            status: 'active', // Tạm thời set active vì không có isActive field
            createdAt: new Date(packageData.createdAt).toLocaleDateString('vi-VN'),
            updatedAt: packageData.updatedAt ? new Date(packageData.updatedAt).toLocaleDateString('vi-VN') : '-'
          }
          setPackageData(transformedPackage)
        } else {
          console.error('Failed to fetch package:', response.message)
        }
      } catch (error) {
        console.error('Error fetching package:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackage()
  }, [packageId])

  const handleGoBack = () => {
    router.back()
  }

  const handleEdit = () => {
    router.push(`/general-manager/packages/package-edit?id=${packageId}`)
  }

  const handleDelete = () => {
    setDeleteModal({
      isOpen: true,
      isLoading: false,
    })
  }

  const confirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isLoading: true }))

    try {
      const response = await packagesApi.deletePackage(packageId!)
      if (response.success) {
        alert("Xóa gói học thành công!")
        router.push("/general-manager/packages/list-packages")
      } else {
        alert("Có lỗi xảy ra: " + response.message)
      }
    } catch (error: any) {
      console.error('Error deleting package:', error)
      alert("Có lỗi xảy ra. Vui lòng thử lại!")
    } finally {
      setDeleteModal({
        isOpen: false,
        isLoading: false,
      })
    }
  }

  const closeDeleteModal = () => {
    if (!deleteModal.isLoading) {
      setDeleteModal({
        isOpen: false,
        isLoading: false,
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "inactive":
        return "bg-red-100 text-red-700"
      case "draft":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "HOẠT ĐỘNG"
      case "inactive":
        return "KHÔNG HOẠT ĐỘNG"
      case "draft":
        return "BẢN NHÁP"
      default:
        return "KHÔNG XÁC ĐỊNH"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy gói học.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 relative overflow-hidden">
      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleGoBack}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all duration-200"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h1 className="text-2xl font-bold text-gray-800">CHI TIẾT GÓI HỌC</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                    CHỈNH SỬA
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    XÓA
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">TÊN GÓI HỌC:</label>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold text-gray-800">{packageData.title}</p>
                    {packageData.isPopular && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold">
                        PHỔ BIẾN
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">GIÁ (VND):</label>
                  <p className="text-2xl font-bold text-green-600">{packageData.price}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">KHOẢNG THỜI GIAN (NGÀY):</label>
                  <p className="text-lg text-gray-800">{packageData.duration}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">TRẠNG THÁI:</label>
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold ${getStatusColor(packageData.status)}`}>
                    {getStatusText(packageData.status)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">NGÀY TẠO:</label>
                  <p className="text-gray-600">{new Date(packageData.createdAt).toLocaleDateString("vi-VN")}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">NGÀY CẬP NHẬT:</label>
                  <p className="text-gray-600">{new Date(packageData.updatedAt).toLocaleDateString("vi-VN")}</p>
                </div>
              </div>

              {/* Right Column - Description & Features */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">MÔ TẢ:</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{packageData.description}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">TÍNH NĂNG:</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {packageData.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="XÁC NHẬN XÓA GÓI HỌC"
        message="Bạn có chắc chắn muốn xóa gói học này không? Hành động này không thể hoàn tác."
        itemName={packageData?.title}
        isLoading={deleteModal.isLoading}
      />

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default PackageDetailPageComponent
