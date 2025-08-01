"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { packagesApi } from "@/lib/api/packages"
import Image from "next/image"
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

const ListPackagesPageComponent = () => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    packageId: "",
    packageTitle: "",
    isLoading: false,
  })

  // Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)

        const response = await packagesApi.getPackages()
        console.log("Packages API response:", response)
        if (response.success) {
          const transformedPackages = response.data.content.map((item: any) => ({
            id: item.id.toString(),
            title: item.pricingType,
            description: item.description || "",
            price: item.price.toLocaleString("vi-VN"),
            duration: item.durationDays.toString(),
            discount: item.discount || 0,
            status: item.isActive ? "active" : "inactive",
            createdAt: new Date(item.createdAt).toLocaleDateString("vi-VN"),
            updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("vi-VN") : "-",
          }))
          setPackages(transformedPackages)
        } else {
          console.error("Failed to fetch packages:", response.message || "Unknown error")
          // Fallback to mock data
          const mockPackages = [
            {
              id: "1",
              title: "GÓI 1 TUẦN",
              description: "Gói học ngắn hạn cho người mới bắt đầu",
              price: "50.000",
              duration: "7",
              discount: 10,
              status: "active",
              createdAt: "2024-01-15",
              updatedAt: "2024-01-20",
            },
            {
              id: "2",
              title: "GÓI 1 THÁNG",
              description: "Gói học cơ bản cho người mới bắt đầu",
              price: "100.000",
              duration: "30",
              discount: 15,
              status: "inactive",
              createdAt: "2024-01-15",
              updatedAt: "2024-01-20",
            },
          ]
          setPackages(mockPackages)
        }
      } catch (error) {
        console.error("Error fetching packages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || pkg.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreatePackage = () => {
    router.push("/general-manager/packages/create-package")
  }

  const handleViewPackage = (id: string) => {
    router.push(`/general-manager/packages/package-detail?id=${id}`)
  }

  const handleEditPackage = (id: string) => {
    router.push(`/general-manager/packages/package-edit?id=${id}`)
  }

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
      const response = await packagesApi.deletePackage(deleteModal.packageId)
      if (response.success) {
        alert("Xóa gói học thành công!")
        const updatedPackages = packages.filter((pkg) => pkg.id !== deleteModal.packageId)
        setPackages(updatedPackages)
      } else {
        alert("Có lỗi xảy ra: " + response.message)
      }
    } catch (error: any) {
      console.error("Error deleting package:", error)
      alert("Có lỗi xảy ra. Vui lòng thử lại!")
    } finally {
      setDeleteModal({
        isOpen: false,
        packageId: "",
        packageTitle: "",
        isLoading: false,
      })
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
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Image
                  src="/images/whale-character.png"
                  alt="Whale mascot"
                  width={60}
                  height={60}
                  className="animate-bounce"
                />
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Quản lý gói học
                  </h1>
                  <p className="text-blue-600 mt-1">Theo dõi và quản lý các gói học trong hệ thống</p>
                </div>
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Đang tải dữ liệu...</p>
                </CardContent>
              </Card>
            )}

            {/* Search, Filters and Add Button */}
            {!loading && (
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Tìm kiếm theo tên gói hoặc mô tả..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 border-blue-200 focus:border-blue-400 w-full"
                        />
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white min-w-[180px]"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                      </select>
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                      onClick={handleCreatePackage}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm gói học
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Packages Table */}
            {!loading && (
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
                    {/* Package Icon */}
                    Danh sách gói học ({filteredPackages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-blue-50/50">
                        <tr>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Tên gói</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Giá gốc / Giá sau giảm</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Giảm giá</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Thời hạn</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Trạng thái</th>
                          <th className="text-center py-4 px-6 font-semibold text-gray-700">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPackages.map((pkg, index) => (
                          <tr
                            key={pkg.id}
                            className={`border-b border-blue-50 hover:bg-blue-25 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-blue-25/30"}`}
                          >
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-semibold text-gray-900">{pkg.title}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{pkg.description}</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-medium text-gray-900">{pkg.price} VND</div>
                                {pkg.discount > 0 && (
                                  <div className="text-sm text-green-600 font-medium">
                                    {Math.round(
                                      Number(pkg.price.replace(/\./g, "")) * (1 - pkg.discount / 100),
                                    ).toLocaleString("vi-VN")}{" "}
                                    VND
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
                                {pkg.discount}%
                              </Badge>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-gray-700">{pkg.duration} ngày</div>
                            </td>
                            <td className="py-4 px-6">
                              <Badge
                                variant={pkg.status === "active" ? "default" : "secondary"}
                                className={`${
                                  pkg.status === "active"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                } font-medium`}
                              >
                                {pkg.status === "active" ? "Hoạt động" : "Không hoạt động"}
                              </Badge>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-600 hover:bg-blue-100 p-2"
                                  title="Xem chi tiết"
                                  onClick={() => handleViewPackage(pkg.id)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-green-600 hover:bg-green-100 p-2"
                                  title="Chỉnh sửa"
                                  onClick={() => handleEditPackage(pkg.id)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-red-600 hover:bg-red-100 p-2"
                                      title="Xóa"
                                      onClick={() => handleDeletePackage(pkg.id, pkg.title)}
                                    >
                                      <Trash2 className="w-4 h-4" />
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
                                        <span className="font-semibold text-blue-600"> {pkg.title}</span> không?
                                      </AlertDialogDescription>
                                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                        ⚠️ Hành động này không thể hoàn tác.
                                      </div>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                                      <AlertDialogCancel className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg">
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between px-6 py-4 bg-blue-50/30 border-t border-blue-100">
                    <div className="text-sm text-gray-600">
                      Hiển thị {filteredPackages.length} trên tổng số {packages.length} gói học
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 bg-transparent">
                        Trước
                      </Button>
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 bg-blue-100">
                        1
                      </Button>
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 bg-transparent">
                        Sau
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default ListPackagesPageComponent
