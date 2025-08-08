"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Lock, Mail, Phone, Calendar, BookOpen, Activity, MapPin, User, Package, Unlock } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import axios from "axios"
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

interface LearnersDetailPageProps {
  learnerId: string
}
interface Learner {
  id: number
  name: string
  username: string
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

interface Package {
  id: number
  name: string
  type: string
  status: string
  startDate: string
  endDate: string
  price: string
  code: string
}

interface Activity {
  id: number
  action: string
  time: string
  type: string
  isComplete: boolean
}

interface DetailedStats {
  completedTopics: number
  totalPackages: number
  activePackages: number
  totalProgress: number
  lastActivity: string | null
}

const LearnersDetailPage = ({ learnerId }: LearnersDetailPageProps) => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [learner, setLearner] = useState<Learner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showToggleStatusModal, setShowToggleStatusModal] = useState(false) // New state
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null) // New state
  const [packages, setPackages] = useState<Package[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [detailedStats, setDetailedStats] = useState<DetailedStats | null>(null)

  useEffect(() => {
    fetchLearnerDetails()
  }, [learnerId])

  const fetchLearnerDetails = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Vui lòng đăng nhập để truy cập trang này")
        setLoading(false)
        return
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      console.log("Fetching learner details for ID:", learnerId)
      console.log("API URL:", `${API_BASE_URL}/api/v1/admin/users/${learnerId}`)
      
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/${learnerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      console.log("API Response:", response.data)

      if (response.data) {
        // Check if response has error
        if (response.data.error) {
          setError("Không thể tải thông tin học viên: " + response.data.error)
          return
        }
        
        // Transform the data to match Learner interface
        const userData = response.data
        const learnerData: Learner = {
          id: userData.id,
          name: userData.name || `${userData.firstName} ${userData.lastName}`,
          username: userData.userName || userData.email?.split("@")[0] || "",
          email: userData.email || userData.userEmail || "",
          phone: userData.phone || userData.phoneNumber || "N/A",
          status: userData.status || "active",
          joinDate: userData.joinDate || "N/A",
          lastLogin: userData.lastLogin || "N/A",
          topicsCompleted: userData.topicsCompleted || 0,
          packagesOwned: userData.packagesOwned || 0,
          avatar: userData.avatar || userData.userAvatar || "/images/whale-character.png",
          address: userData.address || "N/A",
          birthDate: userData.birthDate || "N/A",
        }
        
        setLearner(learnerData)
        
        // Fetch additional data
        await Promise.all([
          fetchLearnerPackages(),
          fetchLearnerActivities(),
          fetchLearnerDetailedStats()
        ])
      } else {
        setError("Không thể tải thông tin học viên")
      }
    } catch (err: any) {
      console.error("Error fetching learner details:", err)
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Không có quyền truy cập. Vui lòng đăng nhập với tài khoản General Manager")
      } else if (err.response?.status === 404) {
        setError("Không tìm thấy học viên")
      } else {
        setError("Không thể tải thông tin học viên: " + (err.response?.data?.message || err.message))
      }
      
      // Set a fallback learner object with basic info
      const fallbackLearner: Learner = {
        id: parseInt(learnerId),
        name: `Học viên #${learnerId}`,
        username: `user_${learnerId}`,
        email: "N/A",
        phone: "N/A",
        status: "unknown",
        joinDate: "N/A",
        lastLogin: "N/A",
        topicsCompleted: 0,
        packagesOwned: 0,
        avatar: "/images/whale-character.png",
        address: "N/A",
        birthDate: "N/A",
      }
      setLearner(fallbackLearner)
    } finally {
      setLoading(false)
    }
  }

  const fetchLearnerPackages = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/${learnerId}/packages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data) {
        if (response.data.error) {
          console.error("Error fetching packages:", response.data.error)
          return
        }
        setPackages(response.data.packages || [])
      }
    } catch (err: any) {
      console.error("Error fetching learner packages:", err)
    }
  }

  const fetchLearnerActivities = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/${learnerId}/activities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data) {
        if (response.data.error) {
          console.error("Error fetching activities:", response.data.error)
          return
        }
        setActivities(response.data.activities || [])
      }
    } catch (err: any) {
      console.error("Error fetching learner activities:", err)
    }
  }

  const fetchLearnerDetailedStats = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/${learnerId}/detailed-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data) {
        if (response.data.error) {
          console.error("Error fetching detailed stats:", response.data.error)
          return
        }
        setDetailedStats(response.data)
      }
    } catch (err: any) {
      console.error("Error fetching learner detailed stats:", err)
    }
  }

  const handleToggleAccountStatus = async (learnerToUpdate: Learner) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Vui lòng đăng nhập để truy cập trang này")
        return
      }

      
      const newStatus = learnerToUpdate.status === "active" ? false : true

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      
      const requestData = {
        firstName: learnerToUpdate.name.split(' ')[0] || learnerToUpdate.name,
        lastName: learnerToUpdate.name.split(' ').slice(1).join(' ') || learnerToUpdate.name,
        userName: learnerToUpdate.username || learnerToUpdate.name.toLowerCase().replace(/\s+/g, ''),
        userEmail: learnerToUpdate.email,
        phoneNumber: learnerToUpdate.phone && learnerToUpdate.phone !== "N/A" ? learnerToUpdate.phone : null,
        userRole: "LEARNER",
        userAvatar: learnerToUpdate.avatar || "",
        isActive: newStatus
      }
      
      console.log("Request data:", requestData)
      
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/admin/users/${learnerToUpdate.id}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Update local state based on server response
      if (response.data && response.data.status === 200) {
        const serverStatus = newStatus ? "active" : "inactive"
        setLearner((prev) => (prev ? { ...prev, status: serverStatus } : null))
        alert("Cập nhật trạng thái tài khoản thành công!")
      }

      setShowToggleStatusModal(false)
      setSelectedLearner(null)
    } catch (err: any) {
      console.error("Error updating learner status:", err)
      console.error("Error response:", err.response?.data)
      console.error("Error status:", err.response?.status)
      alert("Có lỗi xảy ra khi cập nhật trạng thái tài khoản: " + (err.response?.data?.message || err.message))
    }
  }

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

  if (error && !learner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <main className="pt-20 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="font-bold">Lỗi</p>
              <p>{error}</p>
            </div>
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={() => fetchLearnerDetails()} className="bg-blue-600 hover:bg-blue-700">
                Thử lại
              </Button>
              <Button onClick={() => router.push("/general-manager/learners")} variant="outline">
                Quay lại danh sách
              </Button>
            </div>
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
            <Button onClick={() => router.push("/general-manager/learners")} className="mt-4">
              Quay lại danh sách
            </Button>
          </div>
        </main>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  const stats = [
    {
      label: "Chủ đề hoàn thành",
      value: detailedStats?.completedTopics || learner?.topicsCompleted || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Gói học sử dụng",
      value: detailedStats?.totalPackages || learner?.packagesOwned || 0,
      icon: Package,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Gói đang hoạt động",
      value: detailedStats?.activePackages || packages.filter((p) => p.status === "active").length,
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

          {/* Error Alert */}
          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">⚠️</span>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

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
                      <p className="text-blue-500 mb-2 font-medium">Username: {learner.username}</p>
                    </div>
                    <AlertDialog open={showToggleStatusModal} onOpenChange={setShowToggleStatusModal}>
                      <AlertDialogTrigger asChild>
                        <Button
                          className={`shadow-lg mt-4 md:mt-0 ${
                            learner.status === "active"
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                          onClick={() => setSelectedLearner(learner)}
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          {learner.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                        </Button>
                      </AlertDialogTrigger>
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
                            Bạn có chắc chắn muốn {selectedLearner?.status === "active" ? "khóa" : "mở khóa"} tài khoản
                            của
                            <span className="font-semibold text-blue-600"> {selectedLearner?.name}</span> không?
                          </AlertDialogDescription>
                          {selectedLearner?.status === "active" && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                              âš ï¸ Học viên sẽ không thể đăng nhập và sử dụng hệ thống.
                            </div>
                          )}
                          {selectedLearner?.status === "inactive" && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                              âœ… Học viên sẽ có thể đăng nhập và sử dụng hệ thống bình thường.
                            </div>
                          )}
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                          <AlertDialogCancel
                            onClick={() => setShowToggleStatusModal(false)}
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
                  {packages.length > 0 ? (
                    packages.map((pkg, index) => (
                      <div
                        key={pkg.id || index}
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
                            <div className="text-gray-700">{pkg.type}</div>
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium text-sm">Giá:</span>
                            <div className="text-gray-700 font-medium">{pkg.price} VNĐ</div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Mã gói: {pkg.code}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Chưa có gói học nào</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-800">Hoạt động gần đây</h3>
                  </div>
                  {activities.length > 0 ? (
                    activities.map((activity, index) => (
                      <div
                        key={activity.id || index}
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
                            {activity.isComplete && (
                              <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                                Hoàn thành
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Chưa có hoạt động nào</p>
                    </div>
                  )}
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
                        <p className="text-gray-900 font-medium">{detailedStats?.completedTopics || learner.topicsCompleted || 0} chủ đề</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <label className="text-sm font-medium text-blue-600">Ngày tham gia</label>
                        <p className="text-gray-900 font-medium">{learner.joinDate}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <label className="text-sm font-medium text-blue-600">Hoạt động cuối</label>
                        <p className="text-gray-900 font-medium">{detailedStats?.lastActivity || "Chưa có"}</p>
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

