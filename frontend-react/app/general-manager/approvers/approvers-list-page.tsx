"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Plus, UserCheck, Lock, Unlock } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import axios from "axios"
import { useRouter } from "next/navigation"
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

interface Approver {
  id: number
  name: string
  email: string
  phone: string | null
  status: string
  joinDate: string
  topicsApproved: number
  pendingReview: number
  specialization: string
  avatar: string
}

export default function ApproversListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [approvers, setApprovers] = useState<Approver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedApprover, setSelectedApprover] = useState<Approver | null>(null)
  const router = useRouter()

  // Fetch approvers data from API
  const fetchApprovers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Vui lòng đăng nhập để truy cập trang này")
        setLoading(false)
        return
      }

      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/approvers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("API response:", response.data)
      setApprovers(response.data.content || response.data)
    } catch (err: any) {
      console.error("Error fetching approvers:", err)
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Không có quyền truy cập. Vui lòng đăng nhập với tài khoản General Manager")
      } else if (err.response?.status === 404) {
        setError("API endpoint không tồn tại")
      } else {
        setError("Không thể tải dữ liệu approvers: " + (err.response?.data?.message || err.message))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApprovers()
  }, [])

  const filteredApprovers = approvers.filter((approver) => {
    const matchesSearch =
      approver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approver.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || approver.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleToggleAccountStatus = async (approverToUpdate: Approver) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const newStatus = approverToUpdate.status === "active" ? false : true

      const response = await axios.put(
        `${API_BASE_URL}/api/v1/admin/users/${approverToUpdate.id}`,
        {
          firstName: approverToUpdate.name.split(' ')[0] || approverToUpdate.name,
          lastName: approverToUpdate.name.split(' ').slice(1).join(' ') || approverToUpdate.name,
          userName: approverToUpdate.name.toLowerCase().replace(/\s+/g, ''),
          userEmail: approverToUpdate.email,
          phoneNumber: approverToUpdate.phone && approverToUpdate.phone !== "N/A" && approverToUpdate.phone !== null ? approverToUpdate.phone : null,
          userRole: "CONTENT_APPROVER",
          userAvatar: approverToUpdate.avatar || "",
          isActive: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Update local state based on server response
      if (response.data && response.data.status === 200) {
        const serverStatus = newStatus ? "active" : "inactive"
        setApprovers((prev) => prev.map((a) => (a.id === approverToUpdate.id ? { ...a, status: serverStatus } : a)))
        setSelectedApprover(null) // Close modal
        alert("Cập nhật trạng thái tài khoản thành công!")
      }
    } catch (err: any) {
      console.error("Error updating approver status:", err)
      alert("Có lỗi xảy ra khi cập nhật trạng thái tài khoản")
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
                    Quản lý người duyệt
                  </h1>
                  <p className="text-blue-600 mt-1">Theo dõi và quản lý hoạt động duyệt chủ đề</p>
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

            {error && (
              <Card className="border-0 shadow-lg bg-red-50/95 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <p className="text-red-600">{error}</p>
                  <Button onClick={fetchApprovers} className="mt-2 bg-blue-600 hover:bg-blue-700">
                    Thử lại
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Search, Filters and Add Button */}
            {!loading && !error && (
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Tìm kiếm theo tên hoặc email..."
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
                      onClick={() => router.push("/general-manager/create-approver")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm người duyệt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Approvers Table */}
            {!loading && !error && (
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Danh sách người duyệt ({filteredApprovers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-blue-50/50">
                        <tr>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Người duyệt</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Liên hệ</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Trạng thái</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Đã duyệt</th>
                          <th className="text-center py-4 px-6 font-semibold text-gray-700">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApprovers.map((approver, index) => (
                          <tr
                            key={approver.id}
                            className={`border-b border-blue-50 hover:bg-blue-25 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-blue-25/30"}`}
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Image
                                    src={approver.avatar || "/placeholder.svg"}
                                    alt={approver.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full border-2 border-blue-200"
                                  />
                                  <div
                                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${approver.status === "active" ? "bg-green-400" : "bg-gray-400"}`}
                                  ></div>
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">{approver.name}</div>
                                  <div className="text-sm text-gray-500">{approver.phone || "N/A"}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-gray-700">{approver.email}</div>
                            </td>
                            <td className="py-4 px-6">
                              <Badge
                                variant={approver.status === "active" ? "default" : "secondary"}
                                className={`${
                                  approver.status === "active"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                } font-medium`}
                              >
                                {approver.status === "active" ? "Hoạt động" : "Không hoạt động"}
                              </Badge>
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-medium text-gray-900">{approver.topicsApproved}</div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-center gap-1">
                                {/* View Button */}
                                <Link href={`/general-manager/approvers?id=${approver.id}`}>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-blue-600 hover:bg-blue-100 p-2"
                                    title="Xem chi tiết"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </Link>

                                {/* Lock/Unlock Button with AlertDialog */}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className={`p-2 ${
                                        approver.status === "active"
                                          ? "text-red-600 hover:bg-red-100" // Red for active (to lock)
                                          : "text-green-600 hover:bg-green-100" // Green for inactive (to unlock)
                                      }`}
                                      title={approver.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                      onClick={() => setSelectedApprover(approver)}
                                    >
                                      {approver.status === "active" ? (
                                        <Lock className="w-4 h-4" />
                                      ) : (
                                        <Unlock className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="sm:max-w-[425px] p-6 rounded-xl shadow-2xl border-2 border-blue-100">
                                    <AlertDialogHeader className="text-center space-y-4">
                                      <div
                                        className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                                          selectedApprover?.status === "active" ? "bg-red-100" : "bg-green-100"
                                        }`}
                                      >
                                        {selectedApprover?.status === "active" ? (
                                          <Lock className="w-8 h-8 text-red-600" />
                                        ) : (
                                          <Unlock className="w-8 h-8 text-green-600" />
                                        )}
                                      </div>
                                      <AlertDialogTitle className="text-2xl font-bold text-gray-800">
                                        {selectedApprover?.status === "active"
                                          ? "Xác nhận khóa tài khoản"
                                          : "Xác nhận mở khóa tài khoản"}
                                      </AlertDialogTitle>
                                      <AlertDialogDescription className="text-base text-gray-600">
                                        Bạn có chắc chắn muốn {selectedApprover?.status === "active" ? "khóa" : "mở khóa"} tài khoản của
                                        <span className="font-semibold text-blue-600"> {selectedApprover?.name}</span> không?
                                      </AlertDialogDescription>
                                      {selectedApprover?.status === "active" && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                          ⚠️ Người duyệt sẽ không thể đăng nhập và sử dụng hệ thống.
                                        </div>
                                      )}
                                      {selectedApprover?.status === "inactive" && (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                          ✅ Người duyệt sẽ có thể đăng nhập và sử dụng hệ thống bình thường.
                                        </div>
                                      )}
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                                      <AlertDialogCancel
                                        onClick={() => setSelectedApprover(null)}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                                      >
                                        Hủy bỏ
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => selectedApprover && handleToggleAccountStatus(selectedApprover)}
                                        className={`flex-1 font-semibold rounded-lg ${
                                          selectedApprover?.status === "active"
                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                            : "bg-green-500 hover:bg-green-600 text-white"
                                        }`}
                                      >
                                        {selectedApprover?.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
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
                      Hiển thị {filteredApprovers.length} trên tổng số {approvers.length} người duyệt
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