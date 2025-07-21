"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  UserCheck,
  FileText,
} from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import axios from "axios"

interface ApproversDetailPageProps {
  approverId: string
}

interface Approver {
  id: number
  name: string
  email: string
  phone: string
  status: string
  joinDate: string
  lastLogin: string
  topicsApproved: number
  pendingReview: number
  rejectedTopics: number
  totalReviewed: number
  avatar: string
  bio: string
  specialization: string
}

const ApproversDetailPage = ({ approverId }: ApproversDetailPageProps) => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [approver, setApprover] = useState<Approver | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApproverDetails = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        
        if (!token) {
          setError("Vui lòng đăng nhập để truy cập trang này")
          setLoading(false)
          return
        }

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
        const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/${approverId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        const userData = response.data
        const approverData: Approver = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || "N/A",
          status: userData.status,
          joinDate: userData.joinDate,
          lastLogin: userData.lastLogin || "N/A",
          topicsApproved: userData.topicsApproved || 0,
          pendingReview: userData.pendingReview || 0,
          rejectedTopics: userData.rejectedTopics || 0,
          totalReviewed: userData.totalReviewed || 0,
          avatar: userData.avatar || "/images/whale-character.png",
          bio: userData.bio || "N/A",
          specialization: userData.specialization || "N/A",
        }
        
        setApprover(approverData)
      } catch (err: any) {
        console.error("Error fetching approver details:", err)
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Không có quyền truy cập. Vui lòng đăng nhập với tài khoản General Manager")
        } else if (err.response?.status === 404) {
          setError("Không tìm thấy thông tin người duyệt")
        } else {
          setError("Không thể tải thông tin người duyệt: " + (err.response?.data?.message || err.message))
        }
      } finally {
        setLoading(false)
      }
    }

    if (approverId) {
      fetchApproverDetails()
    }
  }, [approverId])

  // Loading and Error States
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <main className="pt-20 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-blue-600">Đang tải thông tin người duyệt...</p>
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
              onClick={() => router.push("/general-manager/approvers")}
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

  if (!approver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <main className="pt-20 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-blue-600">Không tìm thấy thông tin người duyệt</p>
            <Button 
              onClick={() => router.push("/general-manager/approvers")}
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

  const topics = [
    {
      name: "Giao tiếp hàng ngày",
      creator: "Phạm Thị Lan",
      status: "approved",
      reviewDate: "2024-01-18",
      vocabulary: 45,
    },
    { name: "Tiếng Anh công sở", creator: "Hoàng Văn Nam", status: "pending", reviewDate: "-", vocabulary: 60 },
    {
      name: "Du lịch và khách sạn",
      creator: "Ngô Thị Mai",
      status: "approved",
      reviewDate: "2024-01-15",
      vocabulary: 38,
    },
    {
      name: "Ẩm thực và nhà hàng",
      creator: "Phạm Thị Lan",
      status: "rejected",
      reviewDate: "2024-01-12",
      vocabulary: 42,
    },
  ]

  const activities = [
    { action: 'Duyệt chủ đề "Giao tiếp hàng ngày"', time: "2024-01-20 14:30", type: "approved" },
    { action: 'Từ chối chủ đề "Ẩm thực và nhà hàng"', time: "2024-01-20 10:15", type: "rejected" },
    { action: 'Đang xem xét chủ đề "Tiếng Anh công sở"', time: "2024-01-19 16:20", type: "reviewing" },
    { action: 'Duyệt chủ đề "Du lịch và khách sạn"', time: "2024-01-19 09:45", type: "approved" },
  ]

  const stats = [
    {
      label: "Chủ đề đã duyệt",
      value: approver.topicsApproved,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Chờ duyệt",
      value: approver.pendingReview,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "Đã từ chối",
      value: approver.rejectedTopics,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      label: "Tổng đã xem xét",
      value: approver.totalReviewed,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Đã duyệt</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Chờ duyệt</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Từ chối</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
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
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/general-manager/approvers")}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
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
                    Chi tiết người duyệt
                  </h1>
                  <p className="text-blue-600">Thông tin chi tiết của {approver.name}</p>
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
                        src={approver.avatar || "/placeholder.svg"}
                        alt={approver.name}
                        width={100}
                        height={100}
                        className="rounded-full border-4 border-blue-200 shadow-lg"
                      />
                      <div
                        className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white shadow-lg ${approver.status === "active" ? "bg-green-400" : "bg-gray-400"}`}
                      ></div>
                    </div>
                    <Badge
                      variant={approver.status === "active" ? "default" : "secondary"}
                      className={`${
                        approver.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      } font-medium px-4 py-1 mb-2`}
                    >
                      {approver.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                    </Badge>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{approver.topicsApproved} đã duyệt</div>
                      <div className="text-sm text-gray-500">{approver.pendingReview} chờ duyệt</div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{approver.name}</h2>
                        <p className="text-gray-600 mb-2">Chuyên môn: {approver.specialization}</p>
                        <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                          Chuyên gia duyệt
                        </Badge>
                      </div>
                      <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg mt-4 md:mt-0">
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa thông tin
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-500">Email</div>
                          <div className="font-medium text-gray-900">{approver.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-500">Số điện thoại</div>
                          <div className="font-medium text-gray-900">{approver.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-500">Ngày tham gia</div>
                          <div className="font-medium text-gray-900">{approver.joinDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-500">Lần cuối hoạt động</div>
                          <div className="font-medium text-gray-900">{approver.lastLogin}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Giới thiệu</h4>
                      <p className="text-gray-600 text-sm">{approver.bio}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Tabs defaultValue="topics" className="w-full">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <TabsList className="grid w-full grid-cols-2 bg-white/50">
                    <TabsTrigger
                      value="topics"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      Chủ đề đã xem xét
                    </TabsTrigger>
                    <TabsTrigger
                      value="activity"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      Hoạt động
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="p-6">
                  <TabsContent value="topics" className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Chủ đề đã xem xét</h3>
                    </div>
                    {topics.map((topic, index) => (
                      <div
                        key={index}
                        className="p-4 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50/50 to-cyan-50/50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{topic.name}</h4>
                          {getStatusBadge(topic.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-purple-600" />
                            <span className="text-gray-700">Tạo bởi: {topic.creator}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">{topic.vocabulary} từ vựng</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700">
                              {topic.reviewDate !== "-" ? `Duyệt: ${topic.reviewDate}` : "Chưa duyệt"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-orange-600" />
                            <span className="text-gray-700">
                              {topic.status === "pending"
                                ? "Đang xem xét"
                                : topic.status === "approved"
                                  ? "Đã hoàn thành"
                                  : "Đã từ chối"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="activity" className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Hoạt động gần đây</h3>
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
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default ApproversDetailPage
