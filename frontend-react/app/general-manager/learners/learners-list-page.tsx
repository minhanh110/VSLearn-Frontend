"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Users, Lock, Unlock } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import axios from "axios"
import { useUserRole } from "@/hooks/use-user-role"

interface Learner {
  id: number
  name: string
  email: string
  phone: string | null
  status: string
  joinDate: string
  topicsCompleted: number
  packagesOwned: number
}

const LearnersListPage = () => {
  const router = useRouter()
  const { role, loading: roleLoading } = useUserRole()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [learners, setLearners] = useState<Learner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null)

  // Kiểm tra quyền truy cập
  useEffect(() => {
    if (!roleLoading) {
      if (role !== 'general-manager') {
        router.push('/homepage')
        return
      }
    }
  }, [role, roleLoading, router])

  // Fetch learners data from API
  const fetchLearners = async () => {
    if (role !== 'general-manager') return
    
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Vui lòng đăng nhập để truy cập trang này")
        setLoading(false)
        return
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/learners`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("API response:", response.data)
      setLearners(response.data.content || response.data)
    } catch (err: any) {
      console.error("Error fetching learners:", err)
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Không có quyền truy cập. Vui lòng đăng nhập với tài khoản General Manager")
      } else if (err.response?.status === 404) {
        setError("API endpoint không tồn tại")
      } else {
        setError("Không thể tải dữ liệu learners: " + (err.response?.data?.message || err.message))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (role === 'general-manager') {
      fetchLearners()
    }
  }, [role])

  const filteredLearners = learners.filter((learner) => {
    const matchesSearch =
      learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || learner.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (learnerId: number) => {
    router.push(`/general-manager/learners?id=${learnerId}`)
  }

  const handleToggleAccountStatus = async (learner: Learner) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const newStatus = learner.status === "active" ? false : true

      const response = await axios.put(
        `${API_BASE_URL}/api/v1/admin/users/${learner.id}`,
        {
          firstName: learner.name.split(' ')[0] || learner.name,
          lastName: learner.name.split(' ').slice(1).join(' ') || learner.name,
          userName: learner.name.toLowerCase().replace(/\s+/g, ''),
          userEmail: learner.email,
          phoneNumber: learner.phone && learner.phone !== "N/A" && learner.phone !== null ? learner.phone : null,
          userRole: "LEARNER",
          userAvatar: "",
          isActive: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Update local state based on server response
      if (response.data && response.data.status === 200) {
        const serverStatus = newStatus ? "active" : "inactive"
        setLearners((prev) => prev.map((l) => (l.id === learner.id ? { ...l, status: serverStatus } : l)))
        alert("Cập nhật trạng thái tài khoản thành công!")
      }

      setSelectedLearner(null)
    } catch (err: any) {
      console.error("Error updating learner status:", err)
      alert("Có lỗi xảy ra khi cập nhật trạng thái tài khoản")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      <main className="pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-cyan-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-blue-300/30 rounded-full blur-xl"></div>

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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Quản lý học viên
                </h1>
                <p className="text-blue-500 mt-1">Theo dõi và quản lý thông tin học viên</p>
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
                <Button onClick={fetchLearners} className="mt-2 bg-blue-600 hover:bg-blue-700">
                  Thử lại
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Search and Filters */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Tìm kiếm theo tên hoặc email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-blue-200/60 focus:border-blue-400 w-full"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-blue-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white min-w-[180px]"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600 lg:text-right whitespace-nowrap">
                  Tổng cộng: <span className="font-semibold text-blue-600">{filteredLearners.length}</span> học viên
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learners Table */}
          {!loading && !error && (
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-t-lg">
                <CardTitle className="text-lg font-bold text-blue-800 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Danh sách học viên ({filteredLearners.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50/50">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Học viên</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Thông tin liên hệ</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Trạng thái</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Thống kê học tập</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLearners.map((learner, index) => (
                        <tr
                          key={learner.id}
                          className={`border-b border-blue-50 hover:bg-blue-25 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-blue-25/30"}`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Image
                                  src="/images/whale-character.png"
                                  alt={learner.name}
                                  width={50}
                                  height={50}
                                  className="rounded-full border-2 border-blue-200"
                                />
                                <div
                                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${learner.status === "active" ? "bg-green-400" : "bg-gray-400"}`}
                                ></div>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-lg">{learner.name}</div>
                                <div className="text-sm text-gray-500">ID: {learner.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="text-gray-700 font-medium">{learner.email}</div>
                              <div className="text-sm text-gray-500">{learner.phone || "N/A"}</div>
                              <div className="text-xs text-gray-400">Tham gia: {learner.joinDate}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge
                              variant={learner.status === "active" ? "default" : "secondary"}
                              className={`${
                                learner.status === "active"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                              } font-medium px-3 py-1`}
                            >
                              {learner.status === "active" ? "Hoạt động" : "Không hoạt động"}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900">
                                {learner.topicsCompleted} chủ đề hoàn thành
                              </div>
                              <div className="text-sm text-gray-600">{learner.packagesOwned} gói học sở hữu</div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                onClick={() => handleViewDetails(learner.id)}
                                size="sm"
                                variant="ghost"
                                className="text-blue-600 hover:bg-blue-100 p-2"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost" // Sử dụng variant ghost
                                    className={`p-2 ${
                                      learner.status === "active"
                                        ? "text-red-600 hover:bg-red-100" // Màu đỏ cho icon/chữ khi khóa
                                        : "text-green-600 hover:bg-green-100" // Màu xanh lá cho icon/chữ khi mở khóa
                                    }`}
                                    title={learner.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                    onClick={() => setSelectedLearner(learner)}
                                  >
                                    {learner.status === "active" ? (
                                      <Lock className="w-4 h-4" />
                                    ) : (
                                      <Unlock className="w-4 h-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                {/* Updated AlertDialogContent to match learners-detail-page */}
                                <AlertDialogContent className="sm:max-w-[425px] p-6 rounded-xl shadow-2xl border-2 border-blue-100">
                                  <AlertDialogHeader className="text-center space-y-4">
                                    <div
                                      className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                                        selectedLearner?.status === "active" ? "bg-red-100" : "bg-green-100"
                                      }`}
                                    >
                                      {selectedLearner?.status === "active" ? (
                                        <Lock className="w-8 h-8 text-red-600" />
                                      ) : (
                                        <Unlock className="w-8 h-8 text-green-600" />
                                      )}
                                    </div>
                                    <AlertDialogTitle className="text-2xl font-bold text-gray-800">
                                      {selectedLearner?.status === "active"
                                        ? "Xác nhận khóa tài khoản"
                                        : "Xác nhận mở khóa tài khoản"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-base text-gray-600">
                                      Bạn có chắc chắn muốn {selectedLearner?.status === "active" ? "khóa" : "mở khóa"}{" "}
                                      tài khoản của
                                      <span className="font-semibold text-blue-600"> {selectedLearner?.name}</span>{" "}
                                      không?
                                    </AlertDialogDescription>
                                    {selectedLearner?.status === "active" && (
                                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                        ⚠️ Học viên sẽ không thể đăng nhập và sử dụng hệ thống.
                                      </div>
                                    )}
                                    {selectedLearner?.status === "inactive" && (
                                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                        ✅ Học viên sẽ có thể đăng nhập và sử dụng hệ thống bình thường.
                                      </div>
                                    )}
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                                    <AlertDialogCancel
                                      onClick={() => setSelectedLearner(null)}
                                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                                    >
                                      Hủy bỏ
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => selectedLearner && handleToggleAccountStatus(selectedLearner)}
                                      className={`flex-1 font-semibold rounded-lg ${
                                        selectedLearner?.status === "active"
                                          ? "bg-red-500 hover:bg-red-600 text-white"
                                          : "bg-green-500 hover:bg-green-600 text-white"
                                      }`}
                                    >
                                      {selectedLearner?.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
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
                    Hiển thị {filteredLearners.length} trên tổng số {learners.length} học viên
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-blue-200/60 text-blue-600 bg-transparent">
                      Trước
                    </Button>
                    <Button variant="outline" size="sm" className="border-blue-200/60 text-blue-600 bg-blue-100">
                      1
                    </Button>
                    <Button variant="outline" size="sm" className="border-blue-200/60 text-blue-600 bg-transparent">
                      Sau
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default LearnersListPage
