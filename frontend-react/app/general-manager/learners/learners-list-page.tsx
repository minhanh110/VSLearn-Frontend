"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Edit, Trash2, Users, Download } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"

interface Learner {
  id: number
  name: string
  email: string
  phone: string
  status: string
  joinDate: string
  topicsCompleted: number
  packagesOwned: number
}

const LearnersListPage = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [learners, setLearners] = useState<Learner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch learners data from API
  const fetchLearners = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError("Vui lòng đăng nhập để truy cập trang này")
        setLoading(false)
        return
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/learners`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
    fetchLearners()
  }, [])



  const filteredLearners = learners.filter((learner) => {
    const matchesSearch =
      learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || learner.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (learnerId: string) => {
    router.push(`/general-manager/learners?id=${learnerId}`)
  }

  const stats = [
    { label: "Tổng học viên", value: learners.length, color: "text-blue-600", bg: "bg-blue-100" },
    {
      label: "Đang hoạt động",
      value: learners.filter((l) => l.status === "active").length,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Không hoạt động",
      value: learners.filter((l) => l.status === "inactive").length,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "Chủ đề TB/học viên",
      value: Math.round(learners.reduce((sum, l) => sum + l.topicsCompleted, 0) / learners.length),
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ]

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
                <p className="text-blue-500 mt-1">Theo dõi và quản lý thông tin học viên ngôn ngữ ký hiệu</p>
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
                <Button 
                  onClick={fetchLearners} 
                  className="mt-2 bg-blue-600 hover:bg-blue-700"
                >
                  Thử lại
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bg}`}>
                        <Users className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Search and Filters */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Tìm kiếm theo tên hoặc email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-blue-200/60 focus:border-blue-400"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-blue-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-green-200/60 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Xuất Excel
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg"
                    onClick={() => router.push('/general-manager/create-learner')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm học viên
                  </Button>
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
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Liên hệ</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Trạng thái</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Tiến độ</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Gói học</th>
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
                                width={40}
                                height={40}
                                className="rounded-full border-2 border-blue-200"
                              />
                              <div
                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${learner.status === "active" ? "bg-green-400" : "bg-gray-400"}`}
                              ></div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{learner.name}</div>
                              <div className="text-sm text-gray-500">{learner.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-700">{learner.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge
                            variant={learner.status === "active" ? "default" : "secondary"}
                            className={`${
                              learner.status === "active"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            } font-medium`}
                          >
                            {learner.status === "active" ? "Hoạt động" : "Không hoạt động"}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{learner.topicsCompleted} chủ đề</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{learner.packagesOwned} gói</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              onClick={() => handleViewDetails(learner.id)}
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:bg-blue-100 p-2"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-emerald-600 hover:bg-emerald-100 p-2"
                              onClick={() => router.push(`/general-manager/edit-learner?id=${learner.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-100 p-2">
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
