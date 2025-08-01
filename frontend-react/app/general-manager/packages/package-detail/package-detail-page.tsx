"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, PackageIcon, DollarSign, Calendar, Percent } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { packagesApi } from "@/lib/api/packages"
import Image from "next/image"

const PackageDetailPageComponent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [packageData, setPackageData] = useState(null)
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
        console.log("Package detail API response:", response)
        if (response.success) {
          const packageData = response.data
          const transformedPackage = {
            id: packageData.id.toString(),
            title: packageData.pricingType,
            description: packageData.description || "",
            price: packageData.price.toLocaleString("vi-VN"),
            duration: packageData.durationDays.toString(),
            discount: packageData.discount || 0,
            status: packageData.isActive ? "active" : "inactive",
            createdAt: new Date(packageData.createdAt).toLocaleDateString("vi-VN"),
            updatedAt: packageData.updatedAt ? new Date(packageData.updatedAt).toLocaleDateString("vi-VN") : "-",
          }
          setPackageData(transformedPackage)
        } else {
          console.error("Failed to fetch package:", response.message)
        }
      } catch (error) {
        console.error("Error fetching package:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackage()
  }, [packageId])

  const handleGoBack = () => {
    router.push("/general-manager/packages/list-packages")
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
      console.error("Error deleting package:", error)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <main className="pt-20 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-blue-600">Đang tải thông tin gói học...</p>
          </div>
        </main>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <main className="pt-20 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-blue-600">Không tìm thấy thông tin gói học</p>
            <Button onClick={handleGoBack} className="mt-4">
              Quay lại danh sách
            </Button>
          </div>
        </main>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200/30 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-lg"></div>

      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      <main className="pt-20 pb-20 lg:pb-4 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoBack}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </Button>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/whale-character.png"
                  alt="Whale"
                  width={40}
                  height={40}
                  className="animate-bounce"
                />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Chi tiết gói học
                  </h1>
                  <p className="text-blue-600">Thông tin chi tiết của {packageData.title}</p>
                </div>
              </div>
            </div>

            {/* Package Overview */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                      <PackageIcon className="w-10 h-10 text-white" />
                    </div>
                    <Badge
                      variant={packageData.status === "active" ? "default" : "secondary"}
                      className={`${
                        packageData.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      } font-medium px-4 py-1`}
                    >
                      {packageData.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                    </Badge>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{packageData.title}</h2>
                        <p className="text-gray-600 mb-4">{packageData.description}</p>
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <Button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg">
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </Button>
                        <AlertDialog open={deleteModal.isOpen} onOpenChange={setDeleteModal}>
                          <AlertDialogTrigger asChild>
                            <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white shadow-lg">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="sm:max-w-[425px] p-6 rounded-xl shadow-2xl border-2 border-blue-100">
                            <AlertDialogHeader className="text-center space-y-4">
                              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-red-100">
                                <Trash2 className="w-8 h-8 text-red-600" />
                              </div>
                              <AlertDialogTitle className="text-2xl font-bold text-gray-800">
                                Xác nhận xóa gói học
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base text-gray-600">
                                Bạn có chắc chắn muốn xóa gói học
                                <span className="font-semibold text-blue-600"> {packageData.title}</span> không?
                              </AlertDialogDescription>
                              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                ⚠️ Hành động này không thể hoàn tác.
                              </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                              <AlertDialogCancel
                                onClick={closeDeleteModal}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                              >
                                Hủy bỏ
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={confirmDelete}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                              >
                                Xóa gói học
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-500">Giá gốc</div>
                          <div className="font-medium text-gray-900">{packageData.price} VND</div>
                          {packageData.discount > 0 && (
                            <>
                              <div className="text-xs text-gray-500 mt-1">Giá sau giảm</div>
                              <div className="font-medium text-green-600">
                                {Math.round(
                                  Number(packageData.price.replace(/\./g, "")) * (1 - packageData.discount / 100),
                                ).toLocaleString("vi-VN")}{" "}
                                VND
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Percent className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-500">Giảm giá</div>
                          <div className="font-medium text-gray-900">{packageData.discount}%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-500">Thời hạn</div>
                          <div className="font-medium text-gray-900">{packageData.duration} ngày</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            {/* Pricing Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <h3 className="text-lg font-semibold text-blue-900">Thông tin giá</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">Giá gốc</div>
                      <div className="font-bold text-xl text-gray-900">{packageData.price} VND</div>
                    </div>
                    {packageData.discount > 0 && (
                      <>
                        <div>
                          <div className="text-sm text-gray-500">Giảm giá</div>
                          <div className="font-medium text-orange-600">{packageData.discount}%</div>
                        </div>
                        <div className="border-t pt-4">
                          <div className="text-sm text-gray-500">Giá sau giảm</div>
                          <div className="font-bold text-2xl text-green-600">
                            {Math.round(
                              Number(packageData.price.replace(/\./g, "")) * (1 - packageData.discount / 100),
                            ).toLocaleString("vi-VN")}{" "}
                            VND
                          </div>
                          <div className="text-sm text-green-600">
                            Tiết kiệm:{" "}
                            {Math.round(
                              Number(packageData.price.replace(/\./g, "")) * (packageData.discount / 100),
                            ).toLocaleString("vi-VN")}{" "}
                            VND
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <h3 className="text-lg font-semibold text-blue-900">Thông tin tạo</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">Ngày tạo</div>
                      <div className="font-medium text-gray-900">{packageData.createdAt}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Ngày cập nhật</div>
                      <div className="font-medium text-gray-900">{packageData.updatedAt}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-blue-900">Mô tả chi tiết</h3>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">{packageData.description || "Chưa có mô tả"}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default PackageDetailPageComponent
