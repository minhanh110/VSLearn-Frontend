"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  UserCheck,
  FileText,
  BookOpen,
} from "lucide-react"
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
  vocabularyApproved: number
  avatar: string
  bio: string
  specialization: string
}

interface ApprovedTopic {
  id: number
  name: string
  vocabulary: number
  creator: string
  status: string
  approvalDate: string
}

interface ApprovedVocabulary {
  id: number
  vocab: string
  meaning: string
  topic: string
  creator: string
  status: string
  approvalDate: string
}

interface ApproverStats {
  totalTopics: number
  approvedTopics: number
  rejectedTopics: number
  totalVocabularies: number
  approvedVocabularies: number
  rejectedVocabularies: number
  lastActivity: string | null
}

const ApproversDetailPage = ({ approverId }: ApproversDetailPageProps) => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [approver, setApprover] = useState<Approver | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showToggleStatusModal, setShowToggleStatusModal] = useState(false)
  const [selectedApprover, setSelectedApprover] = useState<Approver | null>(null)
  const [approvedTopics, setApprovedTopics] = useState<ApprovedTopic[]>([])
  const [approvedVocabularies, setApprovedVocabularies] = useState<ApprovedVocabulary[]>([])
  const [approverStats, setApproverStats] = useState<ApproverStats | null>(null)

  useEffect(() => {
    fetchApproverDetails()
  }, [approverId])

  const fetchApproverDetails = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Vui lòng đăng nhập để truy cập trang này")
        setLoading(false)
        return
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      console.log("Fetching approver details for ID:", approverId)
      
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/${approverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("API Response:", response.data)

      if (response.data) {
        if (response.data.error) {
          setError("Không thể tải thông tin người kiểm duyệt: " + response.data.error)
          return
        }
        
        const userData = response.data
        const approverData: Approver = {
          id: userData.id,
          name: userData.name || `${userData.firstName} ${userData.lastName}`,
          email: userData.email || userData.userEmail || "",
          phone: userData.phone || userData.phoneNumber || "N/A",
          status: userData.status || "active",
          joinDate: userData.joinDate || "N/A",
          lastLogin: userData.lastLogin || "N/A",
          topicsApproved: userData.topicsApproved || 0,
          vocabularyApproved: userData.vocabularyApproved || 0,
          avatar: userData.avatar || userData.userAvatar || "/images/whale-character.png",
          bio: userData.bio || "N/A",
          specialization: userData.specialization || "N/A",
        }

        setApprover(approverData)
        
        // Fetch additional data
        await Promise.all([
          fetchApproverTopics(),
          fetchApproverVocabularies(),
          fetchApproverStats()
        ])
      } else {
        setError("Không thể tải thông tin người kiểm duyệt")
      }
    } catch (err: any) {
      console.error("Error fetching approver details:", err)
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Không có quyền truy cập. Vui lòng đăng nhập với tài khoản General Manager")
      } else if (err.response?.status === 404) {
        setError("Không tìm thấy thông tin người kiểm duyệt")
      } else {
        setError("Không thể tải thông tin người kiểm duyệt: " + (err.response?.data?.message || err.message))
      }
      
      // Set a fallback approver object with basic info
      const fallbackApprover: Approver = {
        id: parseInt(approverId),
        name: `Người kiểm duyệt #${approverId}`,
        email: "N/A",
        phone: "N/A",
        status: "unknown",
        joinDate: "N/A",
        lastLogin: "N/A",
        topicsApproved: 0,
        vocabularyApproved: 0,
        avatar: "/images/whale-character.png",
        bio: "N/A",
        specialization: "N/A",
      }
      setApprover(fallbackApprover)
    } finally {
      setLoading(false)
    }
  }

  const fetchApproverTopics = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/${approverId}/approved-topics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data) {
        if (response.data.error) {
          console.error("Error fetching approved topics:", response.data.error)
          return
        }
        setApprovedTopics(response.data.topics || [])
      }
    } catch (err: any) {
      console.error("Error fetching approver topics:", err)
    }
  }

  const fetchApproverVocabularies = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/${approverId}/approved-vocabularies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data) {
        if (response.data.error) {
          console.error("Error fetching approved vocabularies:", response.data.error)
          return
        }
        setApprovedVocabularies(response.data.vocabularies || [])
      }
    } catch (err: any) {
      console.error("Error fetching approver vocabularies:", err)
    }
  }

  const fetchApproverStats = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/${approverId}/approver-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data) {
        if (response.data.error) {
          console.error("Error fetching approver stats:", response.data.error)
          return
        }
        setApproverStats(response.data)
      }
    } catch (err: any) {
      console.error("Error fetching approver stats:", err)
    }
  }

  const handleToggleAccountStatus = async (approver: Approver) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Vui lòng đăng nhập để thực hiện thao tác này")
        return
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const newStatus = approver.status === "active" ? false : true

      const response = await axios.put(
        `${API_BASE_URL}/api/v1/admin/users/${approver.id}`,
        {
          firstName: approver.name.split(' ')[0] || approver.name,
          lastName: approver.name.split(' ').slice(1).join(' ') || approver.name,
          userName: approver.name.toLowerCase().replace(/\s+/g, ''),
          userEmail: approver.email,
          phoneNumber: approver.phone && approver.phone !== "N/A" ? approver.phone : null,
          userRole: "CONTENT_APPROVER",
          userAvatar: approver.avatar || "",
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
        setApprover((prev) => (prev ? { ...prev, status: serverStatus } : null))
        setShowToggleStatusModal(false)
        setSelectedApprover(null)
        alert("Cập nhật trạng thái tài khoản thành công!")
      }
    } catch (err: any) {
      console.error("Error updating approver status:", err)
      setError("Không thể cập nhật trạng thái tài khoản: " + (err.response?.data?.message || err.message))
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
            <p className="mt-4 text-blue-600">Đang tải thông tin người kiểm duyệt ...</p>
          </div>
        </main>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  if (error && !approver) {
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
              <Button onClick={() => fetchApproverDetails()} className="bg-blue-600 hover:bg-blue-700">
                Thử lại
              </Button>
              <Button onClick={() => router.push("/general-manager/approvers")} variant="outline">
                Quay lại danh sách
              </Button>
            </div>
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
            <p className="text-blue-600">Không tìm thấy thông tin người kiểm duyệt </p>
            <Button onClick={() => router.push("/general-manager/approvers")} className="mt-4">
              Quay lại danh sách
            </Button>
          </div>
        </main>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  // Use approved topics and vocabularies from API instead of hardcoded data

  const stats = [
    {
      label: "Chủ đề đã duyệt",
      value: approverStats?.approvedTopics || approver.topicsApproved || 0,
      icon: BookOpen,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Từ vựng đã duyệt",
      value: approverStats?.approvedVocabularies || approver.vocabularyApproved || 0,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Đã duyệt</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Từ chối</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  const getApprovalInfo = (status: string, approvalDate: string) => {
    if (status === "approved") {
      return (
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-gray-700">Ngày duyệt: {approvalDate}</span>
        </div>
      )
    } else if (status === "rejected") {
      return (
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-600" />
          <span className="text-gray-700">Ngày từ chối: {approvalDate}</span>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 relative overflow-hidden">
                {/* Decorative background elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200/30 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-lg"></div>

          <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

          {/* Error Alert */}
          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">⚠️</span>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

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
                    Chi tiết người kiểm duyệt 
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
                      <div className="font-medium text-gray-900">{approver.topicsApproved} chủ đề</div>
                      <div className="text-sm text-gray-500">{approver.vocabularyApproved} từ vựng</div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{approver.name}</h2>
                      </div>
                      <AlertDialog open={showToggleStatusModal} onOpenChange={setShowToggleStatusModal}>
                        <AlertDialogTrigger asChild>
                          <Button
                            className={`shadow-lg mt-4 md:mt-0 ${
                              approver.status === "active"
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                            onClick={() => setSelectedApprover(approver)}
                          >
                            {approver.status === "active" ? (
                              <Lock className="w-4 h-4 mr-2" />
                            ) : (
                              <Unlock className="w-4 h-4 mr-2" />
                            )}
                            {approver.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
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
                              Bạn có chắc chắn muốn {selectedApprover?.status === "active" ? "khóa" : "mở khóa"} tài
                              khoản của
                              <span className="font-semibold text-blue-600"> {selectedApprover?.name}</span> không?
                            </AlertDialogDescription>
                            {selectedApprover?.status === "active" && (
                              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                âš ï¸ người kiểm duyệt sẽ không thể đăng nhập và sử dụng hệ thống.
                              </div>
                            )}
                            {selectedApprover?.status === "inactive" && (
                              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                âœ… người kiểm duyệt sẽ có thể đăng nhập và sử dụng hệ thống bình thường.
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
                        <Calendar className="w-5 h-5 text-blue-600" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Chủ đề đã duyệt
                    </TabsTrigger>
                    <TabsTrigger
                      value="vocabulary"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      Từ vựng đã duyệt
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="p-6">
                  <TabsContent value="topics" className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Chủ đề đã duyệt</h3>
                    </div>
                    {approvedTopics.length > 0 ? (
                      approvedTopics.map((topic, index) => (
                        <div
                          key={topic.id || index}
                          className="p-4 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50/50 to-cyan-50/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">{topic.name}</h4>
                            {getStatusBadge(topic.status)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-700">{topic.vocabulary} từ vựng</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-purple-600" />
                              <span className="text-gray-700">Tạo bởi: {topic.creator}</span>
                            </div>
                            <div>{getApprovalInfo(topic.status, topic.approvalDate)}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Chưa có chủ đề nào được duyệt</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="vocabulary" className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Từ vựng đã duyệt</h3>
                    </div>
                    {approvedVocabularies.length > 0 ? (
                      approvedVocabularies.map((vocab, index) => (
                        <div
                          key={vocab.id || index}
                          className="p-4 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50/50 to-cyan-50/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">
                              {vocab.vocab} - {vocab.meaning}
                            </h4>
                            {getStatusBadge(vocab.status)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-700">Chủ đề: {vocab.topic}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-purple-600" />
                              <span className="text-gray-700">Tạo bởi: {vocab.creator}</span>
                            </div>
                            <div>{getApprovalInfo(vocab.status, vocab.approvalDate)}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Chưa có từ vựng nào được duyệt</p>
                      </div>
                    )}
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

