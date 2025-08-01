"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Search, Edit3, EyeOff, CheckCircle, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface ApprovedTopicItem {
  id: number
  topicName: string
  isFree: boolean
  status: "active" | "needs_edit"
  sortOrder: number
  createdAt: string
  createdBy: number
  updatedAt?: string
  updatedBy?: number
  subtopicCount?: number
  isHidden?: boolean
  editRequestedBy?: number
  editRequestedAt?: string
}

interface ContentCreator {
  id: number
  name: string
  email: string
}

type UserRole = "content_creator" | "content_approver"

export function ListApprovedTopicComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [topics, setTopics] = useState<ApprovedTopicItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showRequestEditModal, setShowRequestEditModal] = useState(false)
  const [showHideConfirmModal, setShowHideConfirmModal] = useState(false)
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
  const [selectedCreator, setSelectedCreator] = useState("")

  // Mock user role - in real app this would come from auth context
  const [userRole] = useState<UserRole>("content_approver") // Change to "content_creator" to test

  // Mock content creators list
  const contentCreators: ContentCreator[] = [
    { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com" },
    { id: 2, name: "Trần Thị B", email: "tranthib@example.com" },
    { id: 3, name: "Lê Văn C", email: "levanc@example.com" },
    { id: 4, name: "Phạm Thị D", email: "phamthid@example.com" },
  ]

  // Mock data for approved topics
  const mockApprovedTopics: ApprovedTopicItem[] = [
    {
      id: 1,
      topicName: "Chào hỏi cơ bản",
      isFree: true,
      status: "active",
      sortOrder: 1,
      createdAt: "2024-01-15",
      createdBy: 1,
      subtopicCount: 12,
      isHidden: false,
    },
    {
      id: 2,
      topicName: "Gia đình",
      isFree: false,
      status: "needs_edit",
      sortOrder: 2,
      createdAt: "2024-01-20",
      createdBy: 1,
      subtopicCount: 18,
      isHidden: false,
      editRequestedBy: 1,
      editRequestedAt: "2024-02-25",
    },
    {
      id: 3,
      topicName: "Màu sắc",
      isFree: true,
      status: "active",
      sortOrder: 3,
      createdAt: "2024-01-25",
      createdBy: 2,
      subtopicCount: 10,
      isHidden: true,
    },
    {
      id: 4,
      topicName: "Số đếm",
      isFree: true,
      status: "active",
      sortOrder: 4,
      createdAt: "2024-02-01",
      createdBy: 1,
      subtopicCount: 15,
      isHidden: false,
    },
    {
      id: 5,
      topicName: "Thức ăn và đồ uống",
      isFree: false,
      status: "needs_edit",
      sortOrder: 5,
      createdAt: "2024-02-05",
      createdBy: 3,
      subtopicCount: 25,
      isHidden: false,
      editRequestedBy: 2,
      editRequestedAt: "2024-02-26",
    },
  ]

  // Fetch approved topics data
  useEffect(() => {
    const fetchApprovedTopics = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Filter topics based on search term
        const filteredTopics = mockApprovedTopics.filter((topic) =>
          topic.topicName.toLowerCase().includes(searchTerm.toLowerCase()),
        )

        setTopics(filteredTopics)
      } catch (error: any) {
        console.error("Error fetching approved topics:", error)
        alert("Không thể tải danh sách chủ đề đã phê duyệt. Vui lòng thử lại!")
        setTopics([])
      } finally {
        setLoading(false)
      }
    }

    fetchApprovedTopics()
  }, [searchTerm])

  const handleViewTopic = (id: number) => {
    router.push(`/topic-details?id=${id}`)
  }

  const handleRequestEdit = (id: number) => {
    setSelectedTopicId(id)
    setShowRequestEditModal(true)
  }

  const handleSubmitRequestEdit = () => {
    if (!selectedCreator || !selectedTopicId) return

    // Update topic status to needs_edit
    setTopics(
      topics.map((topic) =>
        topic.id === selectedTopicId
          ? {
              ...topic,
              status: "needs_edit",
              editRequestedBy: Number.parseInt(selectedCreator),
              editRequestedAt: new Date().toISOString().split("T")[0],
            }
          : topic,
      ),
    )

    // Here you would make API call to send edit request
    console.log(`Requesting edit for topic ${selectedTopicId} from creator ${selectedCreator}`)
    alert("Đã gửi yêu cầu chỉnh sửa thành công!")

    setShowRequestEditModal(false)
    setSelectedCreator("")
    setSelectedTopicId(null)
  }

  const handleShowHideConfirm = (id: number) => {
    setSelectedTopicId(id)
    setShowHideConfirmModal(true)
  }

  const handleConfirmToggleVisibility = () => {
    if (!selectedTopicId) return

    setTopics(topics.map((topic) => (topic.id === selectedTopicId ? { ...topic, isHidden: !topic.isHidden } : topic)))

    const topic = topics.find((t) => t.id === selectedTopicId)
    const action = topic?.isHidden ? "hiển thị" : "ẩn"
    alert(`Đã ${action} chủ đề thành công!`)

    setShowHideConfirmModal(false)
    setSelectedTopicId(null)
  }

  const getStatusInfo = (topic: ApprovedTopicItem) => {
    if (topic.isHidden) {
      return {
        text: "ẨN",
        className: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300",
      }
    }

    switch (topic.status) {
      case "needs_edit":
        return {
          text: "CẦN CHỈNH SỬA",
          className: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border-yellow-300",
        }
      case "active":
      default:
        return {
          text: "HOẠT ĐỘNG",
          className: "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300",
        }
    }
  }

  const totalPages = Math.ceil(topics.length / 10)
  const startIndex = (currentPage - 1) * 10
  const endIndex = startIndex + 10
  const currentTopics = topics.slice(startIndex, endIndex)

  const selectedTopicForHide = topics.find((t) => t.id === selectedTopicId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-200/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-40 left-16 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-300/25 rounded-full blur-xl animate-bounce"></div>

        {/* Sparkle stars */}
        <div className="absolute top-32 left-1/4 w-6 h-6 text-blue-400 animate-pulse">✨</div>
        <div className="absolute top-48 right-1/4 w-5 h-5 text-cyan-400 animate-bounce">⭐</div>
        <div className="absolute bottom-48 left-1/3 w-4 h-4 text-indigo-400 animate-pulse">💫</div>
        <div className="absolute bottom-36 right-1/3 w-6 h-6 text-blue-400 animate-bounce">✨</div>
      </div>

      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent leading-relaxed">
                CHỦ ĐỀ ĐÃ PHÊ DUYỆT
              </h1>
            </div>
            <p className="text-gray-600 text-lg mb-4">Danh sách chủ đề đang hoạt động và sẵn sàng cho học viên</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
          </div>

          {/* Search Section */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
              <div className="flex flex-col lg:flex-row gap-6 items-end">
                {/* Search */}
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-3">TÌM KIẾM</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-14 border-2 border-blue-200/60 rounded-2xl bg-white/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Table */}
          <div className="relative overflow-x-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden min-w-[700px]">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 px-4 sm:px-8 py-4 sm:py-6">
                <div className="grid grid-cols-5 gap-2 sm:gap-4 font-bold text-blue-700 text-xs sm:text-sm">
                  <div className="text-left">TÊN CHỦ ĐỀ</div>
                  <div className="text-center">NGÀY TẠO</div>
                  <div className="text-center">CHỦ ĐỀ PHỤ</div>
                  <div className="text-center">TRẠNG THÁI</div>
                  <div className="text-center">HÀNH ĐỘNG</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-blue-100/50">
                {loading ? (
                  <div className="px-4 sm:px-8 py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-700 font-medium">Đang tải...</p>
                  </div>
                ) : currentTopics.length === 0 ? (
                  <div className="px-4 sm:px-8 py-8 text-center">
                    <p className="text-gray-500 font-medium">Không tìm thấy chủ đề nào</p>
                  </div>
                ) : (
                  currentTopics.map((topic, index) => {
                    const statusInfo = getStatusInfo(topic)
                    return (
                      <div
                        key={topic.id}
                        className="px-4 sm:px-8 py-4 sm:py-6 hover:bg-blue-50/30 transition-colors group"
                      >
                        <div className="grid grid-cols-5 gap-2 sm:gap-4 items-center text-xs sm:text-sm">
                          {/* Topic Name */}
                          <div className="text-left">
                            <div className="text-gray-700 font-medium truncate">{topic.topicName}</div>
                          </div>

                          {/* Created Date */}
                          <div className="text-center">
                            <div className="text-gray-700 font-medium">{topic.createdAt}</div>
                          </div>

                          {/* Subtopic Count */}
                          <div className="text-center">
                            <div className="text-gray-700 font-medium">{topic.subtopicCount ?? 0}</div>
                          </div>

                          {/* Status */}
                          <div className="text-center">
                            <span
                              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-bold border-2 shadow-sm ${statusInfo.className}`}
                            >
                              {statusInfo.text}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-1 sm:gap-3 justify-center">
                            {/* View Button - Available for all roles */}
                            <Button
                              onClick={() => handleViewTopic(topic.id)}
                              className="group/btn relative p-2 sm:p-3 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-600 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 overflow-hidden"
                              size="sm"
                              title="Xem chi tiết chủ đề"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                            </Button>

                            {/* Request Edit Button - Only for content approver and only if not already needs edit */}
                            {userRole === "content_approver" && topic.status !== "needs_edit" && (
                              <Button
                                onClick={() => handleRequestEdit(topic.id)}
                                className="group/btn relative p-2 sm:p-3 bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-600 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 overflow-hidden"
                                size="sm"
                                title="Yêu cầu chỉnh sửa chủ đề"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                              </Button>
                            )}

                            {/* Hide/Unhide Button - Available for both roles */}
                            <Button
                              onClick={() => handleShowHideConfirm(topic.id)}
                              className={`group/btn relative p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 overflow-hidden ${
                                topic.isHidden
                                  ? "bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-600"
                                  : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-600"
                              }`}
                              size="sm"
                              title={topic.isHidden ? "Hiển thị chủ đề" : "Ẩn chủ đề"}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                              <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                ←
              </Button>

              {/* Dynamic page numbers */}
              {(() => {
                const pages = [];
                const showPages = 5;
                let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                let endPage = Math.min(totalPages, startPage + showPages - 1);
                
                if (endPage - startPage + 1 < showPages) {
                  startPage = Math.max(1, endPage - showPages + 1);
                }

                if (startPage > 1) {
                  pages.push(
                    <Button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      1
                    </Button>
                  );
                  if (startPage > 2) {
                    pages.push(
                      <span key="ellipsis1" className="w-12 h-12 flex items-center justify-center text-gray-500">
                        ...
                      </span>
                    );
                  }
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <Button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-12 h-12 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-200 ${
                        i === currentPage
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                          : "bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {i}
                    </Button>
                  );
                }

                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="ellipsis2" className="w-12 h-12 flex items-center justify-center text-gray-500">
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <Button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {totalPages}
                    </Button>
                  );
                }

                return pages;
              })()}

              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                →
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Request Edit Modal */}
      {showRequestEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowRequestEditModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl border border-white/50 p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-blue-700 mb-2">YÊU CẦU CHỈNH SỬA</h3>
              <p className="text-gray-600">Chọn content creator để gửi yêu cầu chỉnh sửa</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">CHỌN CONTENT CREATOR</label>
              <Select value={selectedCreator} onValueChange={setSelectedCreator}>
                <SelectTrigger className="h-12 border-2 border-blue-200/60 rounded-2xl bg-white/90 focus:border-blue-500">
                  <SelectValue placeholder="Chọn người thực hiện" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-blue-200 shadow-xl">
                  {contentCreators.map((creator) => (
                    <SelectItem key={creator.id} value={creator.id.toString()} className="rounded-lg">
                      {creator.name} ({creator.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setShowRequestEditModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-2xl transition-all duration-300"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmitRequestEdit}
                disabled={!selectedCreator}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                Gửi yêu cầu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hide/Unhide Confirmation Modal */}
      {showHideConfirmModal && selectedTopicForHide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowHideConfirmModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl border border-white/50 p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <AlertTriangle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-orange-700 mb-2">XÁC NHẬN THAY ĐỔI</h3>
              <p className="text-gray-600">
                Bạn có chắc chắn muốn{" "}
                <span className="font-bold text-orange-600">{selectedTopicForHide.isHidden ? "hiển thị" : "ẩn"}</span>{" "}
                chủ đề <span className="font-bold text-blue-600">"{selectedTopicForHide.topicName}"</span>?
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setShowHideConfirmModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-2xl transition-all duration-300"
              >
                Hủy
              </Button>
              <Button
                onClick={handleConfirmToggleVisibility}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default ListApprovedTopicComponent