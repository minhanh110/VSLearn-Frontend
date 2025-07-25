"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
// Import the new modal component at the top
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"

interface Package {
  id: string
  title: string
  description: string
  price: string
  duration: string
  features: string[]
  isPopular: boolean
  status: "active" | "inactive" | "draft"
  createdAt: string
  updatedAt: string
}

const ListPackagesPageComponent = () => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  // Add state for the modal after the existing state declarations
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    packageId: "",
    packageTitle: "",
    isLoading: false,
  })

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockPackages: Package[] = [
      {
        id: "1week",
        title: "GÓI 1 TUẦN",
        description: "Gói học ngắn hạn cho người mới bắt đầu",
        price: "50.000",
        duration: "7",
        features: ["Truy cập cơ bản", "Hỗ trợ email"],
        isPopular: false,
        status: "active",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
      },
      {
        id: "1month",
        title: "GÓI 1 THÁNG",
        description: "Gói học cơ bản cho người mới bắt đầu khám phá ngôn ngữ ký hiệu",
        price: "100.000",
        duration: "30",
        features: ["Truy cập tất cả bài học cơ bản", "Từ điển ngôn ngữ ký hiệu", "Thực hành với camera", "Hỗ trợ 24/7"],
        isPopular: false,
        status: "active",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
      },
      {
        id: "3months",
        title: "GÓI 3 THÁNG",
        description: "Gói học được khuyến nghị cho việc học tập hiệu quả và tiến bộ nhanh chóng",
        price: "250.000",
        duration: "90",
        features: [
          "Tất cả tính năng gói 1 tháng",
          "Bài học nâng cao",
          "Kiểm tra tiến độ",
          "Chứng chỉ hoàn thành",
          "Ưu tiên hỗ trợ",
        ],
        isPopular: true,
        status: "active",
        createdAt: "2024-01-10",
        updatedAt: "2024-01-25",
      },
    ]

    setTimeout(() => {
      setPackages(mockPackages)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreatePackage = () => {
    router.push("/general-manager/packages/create-package")
  }

  const handleViewPackage = (id: string) => {
    router.push(`/general-manager/packages/package-detail?id=${id}`)
  }

  const handleEditPackage = (id: string) => {
    router.push(`/general-manager/packages/package-edit?id=${id}`)
  }

  // Replace the handleDeletePackage function with this new implementation
  const handleDeletePackage = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      packageId: id,
      packageTitle: title,
      isLoading: false,
    })
  }

  const confirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isLoading: true }))

    try {
      // API call to delete package
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      alert("Xóa gói học thành công!")
      const updatedPackages = packages.filter((pkg) => pkg.id !== deleteModal.packageId)
      setPackages(updatedPackages)

      setDeleteModal({
        isOpen: false,
        packageId: "",
        packageTitle: "",
        isLoading: false,
      })
    } catch (error: any) {
      alert("Có lỗi xảy ra. Vui lòng thử lại!")
      setDeleteModal((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const closeDeleteModal = () => {
    if (!deleteModal.isLoading) {
      setDeleteModal({
        isOpen: false,
        packageId: "",
        packageTitle: "",
        isLoading: false,
      })
    }
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
                <h1 className="text-2xl font-bold text-gray-800">DANH SÁCH GÓI HỌC</h1>
                <Button
                  onClick={handleCreatePackage}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  THÊM GÓI HỌC
                </Button>
              </div>
            </div>
          </div>

          {/* Packages List */}
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải...</p>
              </div>
            ) : packages.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 text-center">
                <p className="text-gray-600">Chưa có gói học nào.</p>
              </div>
            ) : (
              packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{pkg.title}</h3>
                        {pkg.isPopular && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold">
                            PHỔ BIẾN
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{pkg.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Giá: {pkg.price} VND</span>
                        <span>Thời gian: {pkg.duration} ngày</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleViewPackage(pkg.id)}
                        className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all duration-200"
                        size="sm"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleEditPackage(pkg.id)}
                        className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-all duration-200"
                        size="sm"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeletePackage(pkg.id, pkg.title)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all duration-200"
                        size="sm"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      {/* Add the modal component before the closing </div> of the main container */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="XÁC NHẬN XÓA GÓI HỌC"
        message="Bạn có chắc chắn muốn xóa gói học này không? Hành động này không thể hoàn tác."
        itemName={deleteModal.packageTitle}
        isLoading={deleteModal.isLoading}
      />
    </div>
  )
}

export default ListPackagesPageComponent
