"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Edit, Trash2, Plus, Download, UserCog } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import axios from "axios"
import { useRouter } from "next/navigation"

interface Creator {
  id: number
  name: string
  email: string
  phone: string
  status: string
  joinDate: string
  topicsCreated: number
  vocabularyCreated: number
  pendingApproval: number
  specialization: string
  avatar: string
}

export default function CreatorsListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  // Fetch creators data from API
  const fetchCreators = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError("Vui lòng đăng nhập để truy cập trang này")
        setLoading(false)
        return
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/creators`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log("API response:", response.data)
      setCreators(response.data.content || response.data)
    } catch (err: any) {
      console.error("Error fetching creators:", err)
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Không có quyền truy cập. Vui lòng đăng nhập với tài khoản General Manager")
      } else if (err.response?.status === 404) {
        setError("API endpoint không tồn tại")
      } else {
        setError("Không thể tải dữ liệu creators: " + (err.response?.data?.message || err.message))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCreators()
  }, [])



  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || creator.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = [
    { label: "Tổng người tạo", value: creators.length, color: "text-blue-600", bg: "bg-blue-100" },
    {
      label: "Đang hoạt động",
      value: creators.filter((c) => c.status === "active").length,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Chủ đề đã tạo",
      value: creators.reduce((sum, c) => sum + c.topicsCreated, 0),
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Từ vựng đã tạo",
      value: creators.reduce((sum, c) => sum + c.vocabularyCreated, 0),
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ]

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
                    Quản lý người tạo nội dung
                  </h1>
                  <p className="text-blue-600 mt-1">Theo dõi và quản lý hoạt động tạo chủ đề và từ vựng</p>
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
                    onClick={fetchCreators} 
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
                          <UserCog className={`w-6 h-6 ${stat.color}`} />
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
                        className="pl-10 border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Xuất Excel
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                      onClick={() => router.push('/general-manager/create-creator')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm người tạo nội dung
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creators Table */}
            {!loading && !error && (
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
                    <UserCog className="w-5 h-5" />
                    Danh sách người tạo nội dung ({filteredCreators.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50/50">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Người tạo</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Liên hệ</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Chuyên môn</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Trạng thái</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Chủ đề</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Từ vựng</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCreators.map((creator, index) => (
                        <tr
                          key={creator.id}
                          className={`border-b border-blue-50 hover:bg-blue-25 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-blue-25/30"}`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Image
                                  src={creator.avatar || "/placeholder.svg"}
                                  alt={creator.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full border-2 border-blue-200"
                                />
                                <div
                                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${creator.status === "active" ? "bg-green-400" : "bg-gray-400"}`}
                                ></div>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{creator.name}</div>
                                <div className="text-sm text-gray-500">{creator.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-gray-700">{creator.email}</div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                              {creator.specialization}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <Badge
                              variant={creator.status === "active" ? "default" : "secondary"}
                              className={`${
                                creator.status === "active"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                              } font-medium`}
                            >
                              {creator.status === "active" ? "Hoạt động" : "Không hoạt động"}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <div className="font-medium text-gray-900">{creator.topicsCreated}</div>
                              <div className="text-xs text-orange-600">{creator.pendingApproval} chờ duyệt</div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-medium text-gray-900">{creator.vocabularyCreated}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-1">
                              <Link href={`/general-manager/creators?id=${creator.id}`}>
                                <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-100 p-2">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-blue-600 hover:bg-blue-100 p-2"
                                onClick={() => router.push(`/general-manager/edit-creator?id=${creator.id}`)}
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
                    Hiển thị {filteredCreators.length} trên tổng số {creators.length} người tạo nội dung
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
