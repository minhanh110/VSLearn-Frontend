"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Mail, Phone, Calendar, BookOpen, Activity, MapPin, User, Package } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import axios from "axios"

interface LearnersDetailPageProps {
  learnerId: string
}

interface Learner {
  id: number
  name: string
  email: string
  phone: string
  status: string
  joinDate: string
  lastLogin: string
  topicsCompleted: number
  packagesOwned: number
  avatar: string
  address: string
  birthDate: string
}

const LearnersDetailPage = ({ learnerId }: LearnersDetailPageProps) => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [learner, setLearner] = useState<Learner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLearnerDetails = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        
        if (!token) {
          setError("Vui lòng đăng nhập để truy cập trang này")
          setLoading(false)
          return
        }

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
        const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/${learnerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        const userData = response.data
        const learnerData: Learner = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || "N/A",
          status: userData.status,
          joinDate: userData.joinDate,
          lastLogin: userData.lastLogin || "N/A",
          topicsCompleted: userData.topicsCompleted || 0,
          packagesOwned: userData.packagesOwned || 0,
          avatar: userData.avatar || "/images/whale-character.png",
          address: userData.address || "N/A",
          birthDate: userData.birthDate || "N/A",
        }
        
        setLearner(learnerData)
      } catch (err: any) {
        console.error("Error fetching learner details:", err)
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Không có quyền truy cập. Vui lòng đăng nhập với tài khoản General Manager")
        } else if (err.response?.status === 404) {
          setError("Không tìm thấy thông tin học viên")
        } else {
          setError("Không thể tải thông tin học viên: " + (err.response?.data?.message || err.message))
        }
      } finally {
        setLoading(false)
      }
    }

    if (learnerId) {
      fetchLearnerDetails()
    }
  }, [learnerId])

  // Loading and Error States
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <main className="pt-20 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-blue-600">Đang tải thông tin học viên...</p>
          </div>
        </main>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <main className="pt-20 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="font-bold">Lỗi</p>
              <p>{error}</p>
            </div>
            <Button 
              onClick={() => router.push("/general-manager/learners")}
              className="mt-4"
            >
              Quay lại danh sách
            </Button>
          </div>
        </main>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  if (!learner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <main className="pt-20 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-blue-600">Không tìm thấy thông tin học viên</p>
            <Button 
              onClick={() => router.push("/general-manager/learners")}
              className="mt-4"
            >
              Quay lại danh sách
            </Button>
          </div>
        </main>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  const packages = [
    {
      name: "Gói học cơ bản - 6 tháng",
      type: "6-month",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      price: "1,200,000 VNĐ",
    },
    {
      name: "Gói học nâng cao - 1 năm",
      type: "12-month",
      status: "expired",
      startDate: "2023-06-01",
      endDate: "2024-06-01",
      price: "2,000,000 VNĐ",
    },
  ]

  const activities = [
    { action: 'Hoàn thành chủ đề "Chào hỏi cơ bản"', time: "2024-01-20 10:30", type: "topic" },
    { action: "Đăng nhập vào hệ thống", time: "2024-01-20 09:15", type: "login" },
    { action: 'Hoàn thành bài kiểm tra "Số đếm"', time: "2024-01-19 16:45", type: "test" },
    { action: "Xem video bài giảng", time: "2024-01-19 14:20", type: "video" },
  ]

  const stats = [
    {
      label: "Chủ đề hoàn thành",
      value: learner.topicsCompleted,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Gói học sở hữu",
      value: learner.packagesOwned,
      icon: Package,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Gói đang hoạt động",
      value: packages.filter((p) => p.status === "active").length,
      icon: Package,
      color: "text-orange-600",
      bg: "bg-orange-100",
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
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/general-manager/learners")}
              className="border-blue-200/60 text-blue-600 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Button>
            <div className="flex items-center gap-3 text-center sm:text-left">
              <Image src="/images/whale-character.png" alt="Whale" width={40} height={40} className="animate-bounce" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Chi tiết học viên
                </h1>
                <p className="text-blue-500">Thông tin chi tiết của {learner.name}</p>
              </div>
            </div>
          </div>

          {/* Profile Overview */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Image
                      src={learner.avatar || "/placeholder.svg"}
                      alt={learner.name}
                      width={100}
                      height={100}
                      className="rounded-full border-4 border-blue-200 shadow-lg"
                    />
                    <div
                      className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white shadow-lg ${learner.status === "active" ? "bg-green-400" : "bg-gray-400"}`}
                    ></div>
                  </div>
                  <Badge
                    variant={learner.status === "active" ? "default" : "secondary"}
                    className={`${
                      learner.status === "active"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    } font-medium px-4 py-1 mb-2`}
                  >
                    {learner.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                  </Badge>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{learner.name}</h2>
                      <p className="text-blue-500 mb-2 font-medium">ID: {learner.id}</p>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg mt-4 md:mt-0">
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa thông tin
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-xs text-gray-500">Email</div>
                        <div className="font-medium text-gray-900">{learner.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-xs text-gray-500">Số điện thoại</div>
                        <div className="font-medium text-gray-900">{learner.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-xs text-gray-500">Ngày tham gia</div>
                        <div className="font-medium text-gray-900">{learner.joinDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-xs text-gray-500">Lần cuối truy cập</div>
                        <div className="font-medium text-gray-900">{learner.lastLogin}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-3 rounded-full ${stat.bg} mb-3`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Detailed Information */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <Tabs defaultValue="packages" className="w-full">
              <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-t-lg">
                <TabsList className="grid w-full grid-cols-3 bg-white/50">
                  <TabsTrigger
                    value="packages"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    Gói học
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    Hoạt động
                  </TabsTrigger>
                  <TabsTrigger value="info" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    Thông tin cá nhân
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="p-6">
                <TabsContent value="packages" className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-800">Gói học đã mua</h3>
                  </div>
                  {packages.map((pkg, index) => (
                    <div
                      key={index}
                      className="p-4 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50/50 to-cyan-50/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                        <Badge
                          variant={pkg.status === "active" ? "default" : "secondary"}
                          className={`${
                            pkg.status === "active"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                          } font-medium`}
                        >
                          {pkg.status === "active" ? "Đang hoạt động" : "Đã hết hạn"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-blue-600 font-medium text-sm">Thời gian:</span>
                          <div className="text-gray-700">
                            {pkg.startDate} - {pkg.endDate}
                          </div>
                        </div>
                        <div>
                          <span className="text-blue-600 font-medium text-sm">Loại gói:</span>
                          <div className="text-gray-700">{pkg.type === "6-month" ? "6 tháng" : "12 tháng"}</div>
                        </div>
                        <div>
                          <span className="text-blue-600 font-medium text-sm">Giá:</span>
                          <div className="text-gray-700 font-medium">{pkg.price}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-800">Hoạt động gần đây</h3>
                  </div>
                  {activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 border-l-4 border-blue-200 bg-blue-50/30 rounded-r-lg"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">{activity.action}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                            {activity.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="info" className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-800">Thông tin cá nhân</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <label className="text-sm font-medium text-blue-600">Họ và tên</label>
                        <p className="text-gray-900 font-medium">{learner.name}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <label className="text-sm font-medium text-blue-600">Email</label>
                        <p className="text-gray-900 font-medium">{learner.email}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <label className="text-sm font-medium text-blue-600">Số điện thoại</label>
                        <p className="text-gray-900 font-medium">{learner.phone}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <label className="text-sm font-medium text-blue-600">Ngày sinh</label>
                        <p className="text-gray-900 font-medium">{learner.birthDate}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <label className="text-sm font-medium text-blue-600">Chủ đề hoàn thành</label>
                        <p className="text-gray-900 font-medium">{learner.topicsCompleted} chủ đề</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <label className="text-sm font-medium text-blue-600">Ngày tham gia</label>
                        <p className="text-gray-900 font-medium">{learner.joinDate}</p>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <label className="text-sm font-medium text-blue-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Địa chỉ
                        </label>
                        <p className="text-gray-900 font-medium">{learner.address}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </main>

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default LearnersDetailPage
