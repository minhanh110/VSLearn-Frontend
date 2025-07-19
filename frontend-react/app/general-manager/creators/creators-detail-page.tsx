"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Mail, Phone, Calendar, BookOpen, FileText, Clock, CheckCircle, Activity } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"

interface CreatorsDetailPageProps {
  creatorId: string
}

const CreatorsDetailPage = ({ creatorId }: CreatorsDetailPageProps) => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Mock data - in real app, fetch based on creatorId
  const creator = {
    id: creatorId,
    name: "Phạm Thị Lan",
    email: "lan.pham@email.com",
    phone: "0123456789",
    status: "active",
    joinDate: "2024-01-10",
    lastLogin: "2024-01-20 16:45",
    topicsCreated: 25,
    vocabularyCreated: 450,
    pendingApproval: 8,
    approvedContent: 17,
    rejectedContent: 3,
    avatar: "/images/whale-character.png",
    bio: "Chuyên gia tạo nội dung tiếng Anh với 10 năm kinh nghiệm. Chuyên về tạo chủ đề giao tiếp và từ vựng cơ bản.",
    specialization: "Tiếng Anh giao tiếp",
  }

  const topics = [
    {
      name: "Giao tiếp hàng ngày",
      vocabulary: 45,
      status: "approved",
      createdDate: "2024-01-15",
      approver: "Nguyễn Văn A",
    },
    { name: "Tiếng Anh công sở", vocabulary: 60, status: "pending", createdDate: "2024-01-18", approver: "-" },
    {
      name: "Du lịch và khách sạn",
      vocabulary: 38,
      status: "approved",
      createdDate: "2024-01-12",
      approver: "Trần Thị B",
    },
    {
      name: "Ẩm thực và nhà hàng",
      vocabulary: 42,
      status: "rejected",
      createdDate: "2024-01-10",
      approver: "Lê Văn C",
    },
  ]

  const activities = [
    { action: 'Tạo chủ đề "Tiếng Anh công sở"', time: "2024-01-20 14:30", type: "create" },
    { action: "Thêm 15 từ vựng mới vào chủ đề giao tiếp", time: "2024-01-20 10:15", type: "update" },
    { action: 'Chủ đề "Giao tiếp hàng ngày" được duyệt', time: "2024-01-19 16:20", type: "approved" },
    { action: "Tạo 20 từ vựng cho chủ đề du lịch", time: "2024-01-19 09:45", type: "create" },
  ]

  const stats = [
    {
      label: "Chủ đề đã tạo",
      value: creator.topicsCreated,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Từ vựng đã tạo",
      value: creator.vocabularyCreated,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Chờ duyệt",
      value: creator.pendingApproval,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "Đã được duyệt",
      value: creator.approvedContent,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
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
                    Chi tiết người tạo nội dung
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
                        <p className="text-gray-600 mb-2">{creator.specialization}</p>
                        <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                          Chuyên gia nội dung
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
                        <Activity className="w-5 h-5 text-blue-600" />
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
                      Chủ đề đã tạo
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
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Chủ đề và từ vựng đã tạo</h3>
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
                            <FileText className="w-4 h-4 text-purple-600" />
                            <span className="text-gray-700">{topic.vocabulary} từ vựng</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">{topic.createdDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700">
                              {topic.approver !== "-" ? `Duyệt bởi: ${topic.approver}` : "Chưa duyệt"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-orange-600" />
                            <span className="text-gray-700">
                              {topic.status === "pending"
                                ? "Đang chờ"
                                : topic.status === "approved"
                                  ? "Hoàn thành"
                                  : "Cần sửa"}
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

export default CreatorsDetailPage
