"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Eye,
  EyeOff,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { TopicService } from "@/app/services/topic.service"

interface TopicItem {
  id: number
  topicName: string
  isFree: boolean
  status: "active" | "needs_edit"
  sortOrder: number
  createdAt: string
  createdBy: number
  subtopicCount?: number
  isHidden?: boolean
}

interface CurriculumChangeRequest {
  id: string
  requestedBy: {
    id: number
    name: string
    email: string
  }
  requestedAt: string
  reason?: string
  oldCurriculum: TopicItem[]
  newCurriculum: TopicItem[]
  status: "pending" | "approved" | "rejected"
}

function CurriculumApprovalPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestId = searchParams.get("id")

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [changeRequest, setChangeRequest] = useState<CurriculumChangeRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)

  useEffect(() => {
    const fetchFromDatabase = async () => {
      try {
        setLoading(true)
        const resp = await TopicService.getTopicList({ page: 0, size: 1000, status: "active" })
        const list = resp.data?.topicList || []
        const mapTopic = (t: any): TopicItem => ({
          id: t.id,
          topicName: t.topicName,
          isFree: t.isFree,
          status: (t.status as "active") || "active",
          sortOrder: t.sortOrder,
          createdAt: t.createdAt ? new Date(t.createdAt).toISOString().slice(0, 10) : "",
          createdBy: t.createdBy,
          subtopicCount: t.subtopicCount || 0,
          isHidden: false,
        })
        const items: TopicItem[] = list.map(mapTopic)
        const nowStr = new Date().toISOString().slice(0, 10)
        setChangeRequest({
          id: requestId || "CR-AUTO",
          requestedBy: { id: 0, name: "Hệ thống", email: "" },
          requestedAt: nowStr,
          reason: "",
          oldCurriculum: items,
          newCurriculum: items,
          status: "pending",
        })
      } catch (error) {
        console.error("Error loading curriculum from DB:", error)
        setChangeRequest({
          id: requestId || "CR-AUTO",
          requestedBy: { id: 0, name: "Hệ thống", email: "" },
          requestedAt: new Date().toISOString().slice(0, 10),
          reason: "",
          oldCurriculum: [],
          newCurriculum: [],
          status: "pending",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchFromDatabase()
  }, [requestId])

  // Generate color mapping for topics that changed position
  const getTopicColorMapping = () => {
    if (!changeRequest) return {}

    const colorMapping: Record<number, string> = {}
    const colors = [
      "bg-blue-100 border-blue-300 text-blue-800",
      "bg-green-100 border-green-300 text-green-800",
      "bg-purple-100 border-purple-300 text-purple-800",
      "bg-pink-100 border-pink-300 text-pink-800",
      "bg-indigo-100 border-indigo-300 text-indigo-800",
      "bg-yellow-100 border-yellow-300 text-yellow-800",
      "bg-red-100 border-red-300 text-red-800",
    ]

    let colorIndex = 0

    changeRequest.oldCurriculum.forEach((oldTopic) => {
      const newTopic = changeRequest.newCurriculum.find((t) => t.id === oldTopic.id)
      if (newTopic && newTopic.sortOrder !== oldTopic.sortOrder) {
        colorMapping[oldTopic.id] = colors[colorIndex % colors.length]
        colorIndex++
      }
    })

    return colorMapping
  }

  const colorMapping = getTopicColorMapping()

  const handleApprove = () => {
    setShowApproveModal(true)
  }

  const handleReject = () => {
    setShowRejectModal(true)
  }

  const confirmApprove = async () => {
    try {
      // API call to approve the change request
      console.log("Approving change request:", requestId)
      alert("Đã phê duyệt thay đổi lộ trình học thành công!")
      setShowApproveModal(false)
      router.push("/general-manager/curriculum-requests")
    } catch (error) {
      console.error("Error approving request:", error)
      alert("Có lỗi xảy ra khi phê duyệt!")
    }
  }

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Vui lòng nhập lý do từ chối!")
      return
    }

    try {
      // API call to reject the change request
      console.log("Rejecting change request:", requestId, "Reason:", rejectionReason)
      alert("Đã từ chối thay đổi lộ trình học!")
      setShowRejectModal(false)
      router.push("/general-manager/curriculum-requests")
    } catch (error) {
      console.error("Error rejecting request:", error)
      alert("Có lỗi xảy ra khi từ chối!")
    }
  }

  const renderTopicRow = (topic: TopicItem, isOld: boolean) => {
    const hasColorHighlight = colorMapping[topic.id]
    const isHidden = topic.isHidden

    return (
      <div
        key={`${isOld ? "old" : "new"}-${topic.id}`}
        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
          isHidden
            ? "opacity-40 bg-gray-50 border-gray-200"
            : hasColorHighlight
              ? hasColorHighlight
              : "bg-white border-gray-200 hover:border-blue-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
              {topic.sortOrder}
            </div>
            <div>
              <div className={`font-semibold ${isHidden ? "text-gray-500" : "text-gray-900"}`}>{topic.topicName}</div>
              <div className="text-sm text-gray-500">{topic.subtopicCount} chủ đề phụ</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isHidden && (
              <div className="flex items-center gap-1 text-gray-500">
                <EyeOff className="w-4 h-4" />
                <span className="text-xs font-medium">ẨN</span>
              </div>
            )}
            {topic.isFree && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Miễn phí
              </Badge>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Thêm vào đầu component

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <main className="pt-20 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-blue-600">Đang tải thông tin yêu cầu thay đổi...</p>
          </div>
        </main>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
  }

  if (!changeRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <main className="pt-20 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-blue-600">Không tìm thấy thông tin yêu cầu thay đổi</p>
            <Button onClick={() => router.push("/general-manager/curriculum-requests")} className="mt-4">
              Quay lại danh sách
            </Button>
          </div>
        </main>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    )
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
                    Duyệt thay đổi lộ trình học
                  </h1>
                  <p className="text-blue-600 mt-1">Xem xét và phê duyệt các thay đổi được đề xuất</p>
                </div>
              </div>
            </div>

            {/* Request Information */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Thông tin yêu cầu
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-gray-500">Người yêu cầu</div>
                      <div className="font-medium text-gray-900">{changeRequest.requestedBy.name}</div>
                      <div className="text-sm text-gray-500">{changeRequest.requestedBy.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-gray-500">Ngày yêu cầu</div>
                      <div className="font-medium text-gray-900">{changeRequest.requestedAt}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-gray-500">Trạng thái</div>
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Chờ duyệt</Badge>
                    </div>
                  </div>
                </div>

                {changeRequest.reason && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Lý do thay đổi</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{changeRequest.reason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comparison Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Old Curriculum */}
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 rounded-t-lg">
                  <CardTitle className="text-lg font-bold text-red-900 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Lộ trình hiện tại
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 max-h-[600px] overflow-y-auto">
                  <div className="space-y-3">
                    {changeRequest.oldCurriculum.map((topic) => renderTopicRow(topic, true))}
                  </div>
                </CardContent>
              </Card>

              {/* New Curriculum */}
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="text-lg font-bold text-green-900 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    Lộ trình đề xuất
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 max-h-[600px] overflow-y-auto">
                  <div className="space-y-3">
                    {changeRequest.newCurriculum.map((topic) => renderTopicRow(topic, false))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Legend */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Chú thích:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
                    <span>Chủ đề thay đổi thứ tự (cùng màu ở 2 bên)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-50 border-2 border-gray-200 rounded opacity-40"></div>
                    <span>Chủ đề bị ẩn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-gray-500" />
                    <span>Biểu tượng chủ đề ẩn</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleReject}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Từ chối
              </Button>
              <Button
                onClick={handleApprove}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Phê duyệt
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Xác nhận phê duyệt</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Bạn có chắc chắn muốn phê duyệt thay đổi lộ trình học này không? Sau khi phê duyệt, lộ trình mới sẽ được
                áp dụng cho tất cả học viên.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowApproveModal(false)}
                  className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                >
                  Hủy
                </Button>
                <Button
                  onClick={confirmApprove}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Phê duyệt
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Từ chối thay đổi</h3>
              <p className="text-gray-600 mb-4">Vui lòng nhập lý do từ chối để gửi phản hồi cho người yêu cầu:</p>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Nhập lý do từ chối..."
                className="mb-6 min-h-[100px] border-gray-300 focus:border-red-400 focus:ring-red-200"
              />
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectionReason("")
                  }}
                  className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                >
                  Hủy
                </Button>
                <Button
                  onClick={confirmReject}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Từ chối
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default CurriculumApprovalPage
