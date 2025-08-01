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
  BookOpen, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Edit2,
  AlertTriangle 
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

interface CreatorsDetailPageProps {
  creatorId: string
}
interface Creator {
  id: number
  name: string
  email: string
  phone: string
  status: string
  joinDate: string
  lastLogin: string
  topicsCreated: number
  vocabularyCreated: number
  pendingApproval: number
  approvedContent: number
  rejectedContent: number
  avatar: string
  bio: string
  specialization: string
  // New fields for approved counts
  approvedTopicsCount: number
  approvedVocabCount: number
}

const CreatorsDetailPage = ({ creatorId }: CreatorsDetailPageProps) => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [creator, setCreator] = useState<Creator | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showToggleStatusModal, setShowToggleStatusModal] = useState(false)
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)

  useEffect(() => {
    const fetchCreatorDetails = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          setError("Vui lòng đăng nhập để truy cập trang này")
          setLoading(false)
          return
        }

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users/${creatorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userData = response.data
        const creatorData: Creator = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || "N/A",
          status: userData.status,
          joinDate: userData.joinDate,
          lastLogin: userData.lastLogin || "N/A",
          topicsCreated: userData.topicsCreated || 0,
          vocabularyCreated: userData.vocabularyCreated || 0,
          pendingApproval: userData.pendingApproval || 0,
          approvedContent: userData.approvedContent || 0,
          rejectedContent: userData.rejectedContent || 0,
          avatar: userData.avatar || "/images/whale-character.png",
          bio: userData.bio || "N/A",
          specialization: userData.specialization || "N/A",
          // Mocking new approved counts for demonstration
          approvedTopicsCount: 15, // Example value
          approvedVocabCount: 120, // Example value
        }

        setCreator(creatorData)
      } catch (err: any) {
        console.error("Error fetching creator details:", err)
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Không có quyền truy cập. Vui lòng đăng nhập với tài khoản General Manager")
        } else if (err.response?.status === 404) {
          setError("Không tìm thấy thông tin người biên soạn")
        } else {
          setError("Không thể tải thông tin người biên soạn: " + (err.response?.data?.message || err.message))
        }
      } finally {
        setLoading(false)
      }
    }

    if (creatorId) {
      fetchCreatorDetails()
    }
  }, [creatorId])

  const handleToggleAccountStatus = async (creator: Creator) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Vui lòng đăng nhập để thực hiện thao tác này")
        return
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const newStatus = creator.status === "active" ? "inactive" : "active"
      
      await axios.patch(
        `${API_BASE_URL}/api/v1/admin/users/${creator.id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Update local state
      setCreator(prev => prev ? { ...prev, status: newStatus } : null)
      setShowToggleStatusModal(false)
      setSelectedCreator(null)
    } catch (err: any) {
      console.error("Error updating creator status:", err)
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
            <p className="mt-4 text-blue-600">Đang tải thông tin người biên soạn...</p>
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
            <Button onClick={() => router.push("/general-manager/creators")} className="mt-4">
              Quay lại danh sách
            </Button>
          </div>
        </main>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <main className="pt-20 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-blue-600">Không tìm thấy thông tin người biên soạn</p>
            <Button onClick={() => router.push("/general-manager/creators")} className="mt-4">
              Quay lại danh sách
            </Button>
          </div>
        </main>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  const topicsCreated = [
    {
      name: "Giao tiếp hàng ngày",
      vocabulary: 45,
      status: "approved",
      createdDate: "2024-01-15",
      approver: "Nguyễn Văn A",
    },
    { 
      name: "Tiếng Anh công sở", 
      vocabulary: 60, 
      status: "pending", 
      createdDate: "2024-01-18", 
      approver: null 
    },
    {
      name: "Du lịch và khách sạn",
      vocabulary: 38,
      status: "editing",
      createdDate: "2024-01-12",
      approver: null,
    },
    {
      name: "Ẩm thực và nhà hàng",
      vocabulary: 42,
      status: "rejected",
      createdDate: "2024-01-10",
      approver: "Lê Văn C",
    },
    {
      name: "Kinh doanh và thương mại",
      vocabulary: 55,
      status: "draft",
      createdDate: "2024-01-08",
      approver: null,
    },
    {
      name: "Y tế và sức khỏe",
      vocabulary: 48,
      status: "need_revision",
      createdDate: "2024-01-05",
      approver: "Phạm Thị D",
    },
  ]

  const vocabulariesCreated = [
    {
      vocab: "Xin chào",
      meaning: "Hello",
      topic: "Chào hỏi",
      status: "approved",
      createdDate: "2024-01-01",
      approver: "Nguyễn Văn A",
    },
    {
      vocab: "Tạm biệt",
      meaning: "Goodbye",
      topic: "Chào hỏi",
      status: "pending",
      createdDate: "2024-01-05",
      approver: null,
    },
    {
      vocab: "Cảm ơn",
      meaning: "Thank you",
      topic: "Chào hỏi",
      status: "approved",
      createdDate: "2024-01-10",
      approver: "Trần Thị B",
    },
    {
      vocab: "Xin lỗi",
      meaning: "Sorry",
      topic: "Giao tiếp",
      status: "rejected",
      createdDate: "2024-01-12",
      approver: "Lê Văn C",
    },
  ]

  const stats = [
    {
      label: "Chủ đề đã được duyệt",
      value: creator.approvedTopicsCount,
      icon: BookOpen,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Từ vựng đã được duyệt",
      value: creator.approvedVocabCount,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
  ]

  const getTopicStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Đã duyệt</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Chờ duyệt</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Bị từ chối</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Đang biên soạn</Badge>
      case "need_revision":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Cần chỉnh sửa</Badge>
      case "editing":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Đang chỉnh sửa</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  const getVocabStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Đã duyệt</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Chờ duyệt</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Bị từ chối</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  const getApproverInfo = (status: string, approver: string | null) => {
    if (status === "approved" && approver) {
      return (
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-gray-700">Duyệt bởi: {approver}</span>
        </div>
      )
    } else if (status === "rejected" && approver) {
      return (
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-600" />
          <span className="text-gray-700">Từ chối bởi: {approver}</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">Chưa duyệt</span>
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

      <main className="pt-20 pb-20 lg:pb-4 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/general-manager/creators")}
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
                    Chi tiết người biên soạn
                  </h1>
                  <p className="text-blue-600">Thông tin chi tiết của {creator.name}</p>
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
                        src={creator.avatar || "/placeholder.svg"}
                        alt={creator.name}
                        width={100}
                        height={100}
                        className="rounded-full border-4 border-blue-200 shadow-lg"
                      />
                      <div
                        className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white shadow-lg ${creator.status === "active" ? "bg-green-400" : "bg-gray-400"}`}
                      ></div>
                    </div>
                    <Badge
                      variant={creator.status === "active" ? "default" : "secondary"}
                      className={`${
                        creator.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      } font-medium px-4 py-1 mb-2`}
                    >
                      {creator.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                    </Badge>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{creator.topicsCreated} chủ đề</div>
                      <div className="text-sm text-gray-500">{creator.vocabularyCreated} từ vựng</div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{creator.name}</h2>
                        
                      </div>
                      <AlertDialog open={showToggleStatusModal} onOpenChange={setShowToggleStatusModal}>
                        <AlertDialogTrigger asChild>
                          <Button
                            className={`shadow-lg mt-4 md:mt-0 ${
                              creator.status === "active"
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                            onClick={() => setSelectedCreator(creator)}
                          >
                            {creator.status === "active" ? (
                              <Lock className="w-4 h-4 mr-2" />
                            ) : (
                              <Unlock className="w-4 h-4 mr-2" />
                            )}
                            {creator.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-[425px] p-6 rounded-xl shadow-2xl border-2 border-blue-100">
                          <AlertDialogHeader className="text-center space-y-4">
                            <div
                              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                                selectedCreator?.status === "active" ? "bg-red-100" : "bg-green-100"
                              }`}
                            >
                              {selectedCreator?.status === "active" ? (
                                <Lock className="w-8 h-8 text-red-600" />
                              ) : (
                                <Unlock className="w-8 h-8 text-green-600" />
                              )}
                            </div>
                            <AlertDialogTitle className="text-2xl font-bold text-gray-800">
                              {selectedCreator?.status === "active"
                                ? "Xác nhận khóa tài khoản"
                                : "Xác nhận mở khóa tài khoản"}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-base text-gray-600">
                              Bạn có chắc chắn muốn {selectedCreator?.status === "active" ? "khóa" : "mở khóa"} tài khoản
                              của
                              <span className="font-semibold text-blue-600"> {selectedCreator?.name}</span> không?
                            </AlertDialogDescription>
                            {selectedCreator?.status === "active" && (
                              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                ⚠️ Người biên soạn sẽ không thể đăng nhập và sử dụng hệ thống.
                              </div>
                            )}
                            {selectedCreator?.status === "inactive" && (
                              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                ✅ Người biên soạn sẽ có thể đăng nhập và sử dụng hệ thống bình thường.
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
                              onClick={() => selectedCreator && handleToggleAccountStatus(selectedCreator)}
                              className={`flex-1 font-semibold rounded-lg ${
                                selectedCreator?.status === "active"
                                  ? "bg-red-500 hover:bg-red-600 text-white"
                                  : "bg-green-500 hover:bg-green-600 text-white"
                              }`}
                            >
                              {selectedCreator?.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
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
                          <div className="font-medium text-gray-900">{creator.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-500">Số điện thoại</div>
                          <div className="font-medium text-gray-900">{creator.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-500">Ngày tham gia</div>
                          <div className="font-medium text-gray-900">{creator.joinDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-500">Lần cuối hoạt động</div>
                          <div className="font-medium text-gray-900">{creator.lastLogin}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Giới thiệu</h4>
                      <p className="text-gray-600 text-sm">{creator.bio}</p>
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
              <Tabs defaultValue="topics-created" className="w-full">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <TabsList className="grid w-full grid-cols-2 bg-white/50">
                    <TabsTrigger
                      value="topics-created"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      Chủ đề đã tạo
                    </TabsTrigger>
                    <TabsTrigger
                      value="vocab-created"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      Từ vựng đã tạo
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="p-6">
                  <TabsContent value="topics-created" className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Danh sách chủ đề đã tạo</h3>
                    </div>
                    {topicsCreated.map((topic, index) => (
                      <div
                        key={index}
                        className="p-4 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50/50 to-cyan-50/50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{topic.name}</h4>
                          {getTopicStatusBadge(topic.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-600" />
                            <span className="text-gray-700">{topic.vocabulary} từ vựng</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">{topic.createdDate}</span>
                          </div>
                          <div>
                            {getApproverInfo(topic.status, topic.approver)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="vocab-created" className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Danh sách từ vựng đã tạo</h3>
                    </div>
                    {vocabulariesCreated.map((vocab, index) => (
                      <div
                        key={index}
                        className="p-4 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50/50 to-cyan-50/50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">
                            {vocab.vocab} - {vocab.meaning}
                          </h4>
                          {getVocabStatusBadge(vocab.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-purple-600" />
                            <span className="text-gray-700">Chủ đề: {vocab.topic}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">{vocab.createdDate}</span>
                          </div>
                          <div>
                            {getApproverInfo(vocab.status, vocab.approver)}
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

export default CreatorsDetailPage