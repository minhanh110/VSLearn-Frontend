"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Edit3, Search, AlertCircle, CheckCircle, Settings, X, Save, EyeOff, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { TopicService } from "@/app/services/topic.service"
import { useUserRole } from "@/hooks/use-user-role"

interface ApprovedTopicItem {
  id: number
  topicName: string
  isFree: boolean
  status: string
  sortOrder: number
  createdAt: string
  createdBy: number
  updatedAt?: string
  updatedBy?: number
  deletedAt?: string
  deletedBy?: number
  subtopicCount?: number // Assuming this comes from API or is calculated
  isHidden?: boolean // Assuming this is a property managed by the system
}

interface ContentCreator {
  id: number
  name: string
  email: string
}

export function ListApprovedTopicComponent() {
  const router = useRouter()
  const { role, loading: roleLoading } = useUserRole()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [topics, setTopics] = useState<ApprovedTopicItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showRequestEditModal, setShowRequestEditModal] = useState(false)
  const [showHideConfirmModal, setShowHideConfirmModal] = useState(false)
  const [showSavePricingConfirmModal, setShowSavePricingConfirmModal] = useState(false) // New state for pricing confirm modal
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
  const [selectedCreator, setSelectedCreator] = useState("")

  // States for curriculum management (reordering)
  const [isEditingCurriculum, setIsEditingCurriculum] = useState(false)
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null)
  const [dragOverItemId, setDragOverItemId] = useState<number | null>(null)
  const [tempTopics, setTempTopics] = useState<ApprovedTopicItem[]>([])

  // States for pricing configuration
  const [isConfiguringPricing, setIsConfiguringPricing] = useState(false)
  const [freeUntilTopicId, setFreeUntilTopicId] = useState<string | null>(null) // Store as string for Select component
  const [tempPricingTopics, setTempPricingTopics] = useState<ApprovedTopicItem[]>([])

  // Mock content creators list (can be fetched from API if available)
  const contentCreators: ContentCreator[] = [
    { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com" },
    { id: 2, name: "Trần Thị B", email: "tranthib@example.com" },
    { id: 3, name: "Lê Văn C", email: "levanc@example.com" },
    { id: 4, name: "Phạm Thị D", email: "phamthid@example.com" },
  ]

  // Kiểm tra quyền truy cập
  useEffect(() => {
    if (!roleLoading) {
      if (role !== "content-creator" && role !== "content-approver" && role !== "general-manager") {
        router.push("/homepage")
        return
      }
    }
  }, [role, roleLoading, router])

  // Fetch approved topics data
  useEffect(() => {
    if (role === "content-creator" || role === "content-approver" || role === "general-manager") {
      const fetchApprovedTopics = async () => {
        try {
          setLoading(true)
          const response = await TopicService.getTopicList({
            page: currentPage - 1,
            search: searchTerm,
            status: "active", // Chỉ lấy topics đã được approve
          })
          // Ensure topics are sorted by sortOrder
          const sortedTopics = (response.data.topicList || response.data).sort(
            (a: any, b: any) => a.sortOrder - b.sortOrder,
          )
          setTopics(sortedTopics)
          setTempTopics(sortedTopics) // Initialize tempTopics for reordering
          setTempPricingTopics(sortedTopics) // Initialize tempPricingTopics for pricing config
        } catch (error: any) {
          console.error("Error fetching approved topics:", error)
          alert("Không thể tải danh sách chủ đề đã duyệt. Vui lòng thử lại!")
          setTopics([])
        } finally {
          setLoading(false)
        }
      }

      fetchApprovedTopics()
    }
  }, [currentPage, searchTerm, role])

  // Logic to calculate isFree status based on freeUntilTopicId
  useEffect(() => {
    if (isConfiguringPricing && topics.length > 0) {
      const newPricingTopics = [...topics].sort((a, b) => a.sortOrder - b.sortOrder) // Ensure sorted
      let pivotOrder = -1

      if (freeUntilTopicId === "all-free") {
        // All topics are free
        setTempPricingTopics(newPricingTopics.map((topic) => ({ ...topic, isFree: true })))
        return
      } else if (freeUntilTopicId === "null") {
        // All topics are paid
        setTempPricingTopics(newPricingTopics.map((topic) => ({ ...topic, isFree: false })))
        return
      } else if (freeUntilTopicId) {
        const pivotTopic = newPricingTopics.find((t) => t.id === Number(freeUntilTopicId))
        if (pivotTopic) {
          pivotOrder = pivotTopic.sortOrder
        }
      }

      const updatedTopics = newPricingTopics.map((topic) => ({
        ...topic,
        isFree: pivotOrder === -1 ? true : topic.sortOrder <= pivotOrder, // <= to include the pivot topic as free
      }))
      setTempPricingTopics(updatedTopics)
    } else if (!isConfiguringPricing) {
      // When not configuring, tempPricingTopics should reflect current topics
      setTempPricingTopics([...topics])
    }
  }, [freeUntilTopicId, topics, isConfiguringPricing])

  const handleViewTopic = (id: number) => {
    router.push(`/topic-details?id=${id}`)
  }

  const handleRequestEdit = (id: number) => {
    setSelectedTopicId(id)
    setShowRequestEditModal(true)
  }

  const handleSubmitRequestEdit = async () => {
    if (!selectedCreator || !selectedTopicId) return

    try {
      // Simulate API call to send edit request
      // await TopicService.requestEdit(selectedTopicId, Number.parseInt(selectedCreator));
      alert("Đã gửi yêu cầu chỉnh sửa thành công!")

      // Update topic status to needs_edit in local state
      setTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic.id === selectedTopicId
            ? {
                ...topic,
                status: "needs_edit" as const,
                // editRequestedBy: Number.parseInt(selectedCreator), // These fields are not in original interface
                // editRequestedAt: new Date().toISOString().split("T")[0],
              }
            : topic,
        ),
      )
      setTempTopics((prevTempTopics) =>
        prevTempTopics.map((topic) =>
          topic.id === selectedTopicId
            ? {
                ...topic,
                status: "needs_edit" as const,
              }
            : topic,
        ),
      )
    } catch (error) {
      console.error("Error sending edit request:", error)
      alert("Có lỗi xảy ra khi gửi yêu cầu chỉnh sửa. Vui lòng thử lại!")
    } finally {
      setShowRequestEditModal(false)
      setSelectedCreator("")
      setSelectedTopicId(null)
    }
  }

  const handleShowHideConfirm = (id: number) => {
    setSelectedTopicId(id)
    setShowHideConfirmModal(true)
  }

  const handleConfirmToggleVisibility = () => {
    if (!selectedTopicId) return

    const targetTopics = isEditingCurriculum ? tempTopics : isConfiguringPricing ? tempPricingTopics : topics
    const updatedTopics = targetTopics.map((topic) =>
      topic.id === selectedTopicId ? { ...topic, isHidden: !topic.isHidden } : topic,
    )

    if (isEditingCurriculum) {
      setTempTopics(updatedTopics)
    } else if (isConfiguringPricing) {
      setTempPricingTopics(updatedTopics)
    } else {
      setTopics(updatedTopics)
    }

    const topic = updatedTopics.find((t) => t.id === selectedTopicId)
    const action = topic?.isHidden ? "hiển thị" : "ẩn"
    alert(`Đã ${action} chủ đề thành công!`)

    setShowHideConfirmModal(false)
    setSelectedTopicId(null)
  }

  // Curriculum editing functions
  const handleStartEditingCurriculum = () => {
    setIsEditingCurriculum(true)
    setTempTopics([...topics]) // Copy current topics to temp for editing
    setIsConfiguringPricing(false) // Exit pricing config mode
  }

  const handleCancelEditingCurriculum = () => {
    setIsEditingCurriculum(false)
    setTempTopics([...topics]) // Revert temp topics to original
    setDraggedItemId(null)
    setDragOverItemId(null)
  }

  const handleSaveCurriculumChanges = async () => {
    // Update sort orders based on new positions
    const updatedTopics = tempTopics.map((topic, index) => ({
      ...topic,
      sortOrder: index + 1,
    }))

    try {
      await TopicService.reorderTopics(updatedTopics.map((t) => ({ id: t.id, sortOrder: t.sortOrder })))
      setTopics(updatedTopics) // Apply changes to main topics state
      alert("Đã lưu thay đổi lộ trình học thành công!")
    } catch (e) {
      alert("Không thể lưu thay đổi lộ trình. Vui lòng thử lại!")
    } finally {
      setIsEditingCurriculum(false)
      setDraggedItemId(null)
      setDragOverItemId(null)
    }
  }

  const handleToggleVisibilityInEdit = (id: number) => {
    setSelectedTopicId(id)
    setShowHideConfirmModal(true)
  }

  // Drag and drop functions with updated logic
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    setDraggedItemId(id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.preventDefault()
    setDragOverItemId(id)
  }

  const handleDragLeave = () => {
    setDragOverItemId(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.preventDefault()
    if (draggedItemId === null) return

    const draggedIndex = tempTopics.findIndex((item) => item.id === draggedItemId)
    const dropIndex = tempTopics.findIndex((item) => item.id === id)

    if (draggedIndex === -1 || dropIndex === -1) return

    const newOrder = [...tempTopics]
    const [moved] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(dropIndex, 0, moved)

    setTempTopics(newOrder)
    setDraggedItemId(null)
    setDragOverItemId(null)
  }

  // Pricing configuration functions
  const handleStartConfiguringPricing = () => {
    setIsConfiguringPricing(true)
    setIsEditingCurriculum(false) // Exit curriculum editing mode
    // Find the current pivot topic if any, to pre-select in the dropdown
    const sortedTopics = [...topics].sort((a, b) => a.sortOrder - b.sortOrder)
    let initialFreeUntilId: string | null = null

    if (sortedTopics.every((t) => t.isFree)) {
      initialFreeUntilId = "all-free" // If all are free, select "Tất cả miễn phí"
    } else {
      const firstPaidIndex = sortedTopics.findIndex((t) => !t.isFree)
      if (firstPaidIndex > 0) {
        initialFreeUntilId = String(sortedTopics[firstPaidIndex - 1].id) // Last free topic ID
      } else {
        initialFreeUntilId = "null" // If the very first topic is paid, or no topics, then "Tất cả có phí"
      }
    }
    setFreeUntilTopicId(initialFreeUntilId)
    setTempPricingTopics([...topics]) // Initialize tempPricingTopics with current topics
  }

  const handleCancelConfiguringPricing = () => {
    setIsConfiguringPricing(false)
    setFreeUntilTopicId(null) // Reset selection
    setTempPricingTopics([...topics]) // Revert temp pricing topics
  }

  const handleSavePricingChanges = () => {
    setShowSavePricingConfirmModal(true) // Show confirmation modal
  }

  const handleConfirmSavePricingChanges = async () => {
    // Prepare updates for topics whose isFree status has changed
    const updates = tempPricingTopics.map((topic) => ({
      id: topic.id,
      isFree: topic.isFree,
      isHidden: topic.isHidden, // Also save hidden status if changed in this mode
    }))

    try {
      // Simulate API call to update pricing
      console.log("Simulating saving pricing changes:", updates)
      // await TopicService.updateTopicPricing(updates); // Assuming such an API exists
      setTopics(tempPricingTopics) // Apply changes to main topics state
      alert("Đã lưu cấu hình giá thành công!")
    } catch (e) {
      console.error("Error saving pricing changes:", e)
      alert("Không thể lưu cấu hình giá. Vui lòng thử lại!")
    } finally {
      setShowSavePricingConfirmModal(false) // Close confirmation modal
      setIsConfiguringPricing(false)
    }
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

  const displayTopics = isEditingCurriculum ? tempTopics : isConfiguringPricing ? tempPricingTopics : topics
  const totalPages = Math.ceil(displayTopics.length / 10)
  const startIndex = (currentPage - 1) * 10
  const endIndex = startIndex + 10
  const currentTopics = displayTopics.slice(startIndex, endIndex)

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

          {/* Search Section and Curriculum Management */}
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
                      disabled={isEditingCurriculum || isConfiguringPricing}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {!isEditingCurriculum && !isConfiguringPricing ? (
                    <>
                      <Button
                        onClick={handleStartEditingCurriculum}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <div className="flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          <span className="font-bold">Thay đổi lộ trình học</span>
                        </div>
                      </Button>
                      <Button
                        onClick={handleStartConfiguringPricing}
                        className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          <span className="font-bold">Cấu hình giá</span>
                        </div>
                      </Button>
                    </>
                  ) : isEditingCurriculum ? (
                    <div className="flex gap-3">
                      <Button
                        onClick={handleCancelEditingCurriculum}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <div className="flex items-center gap-2">
                          <X className="w-5 h-5" />
                          <span className="font-bold">Hủy</span>
                        </div>
                      </Button>
                      <Button
                        onClick={handleSaveCurriculumChanges}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <div className="flex items-center gap-2">
                          <Save className="w-5 h-5" />
                          <span className="font-bold">Nộp thay đổi</span>
                        </div>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        onClick={handleCancelConfiguringPricing}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <div className="flex items-center gap-2">
                          <X className="w-5 h-5" />
                          <span className="font-bold">Hủy</span>
                        </div>
                      </Button>
                      <Button
                        onClick={handleSavePricingChanges}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <div className="flex items-center gap-2">
                          <Save className="w-5 h-5" />
                          <span className="font-bold">Lưu cấu hình</span>
                        </div>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Configuration Section */}
          {isConfiguringPricing && (
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <DollarSign className="w-8 h-8 text-purple-600" />
                    <h3 className="text-xl font-bold text-purple-700">CẤU HÌNH CHỦ ĐỀ MIỄN PHÍ/CÓ PHÍ</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Chọn chủ đề mà từ đó trở xuống sẽ là chủ đề có phí. Các chủ đề phía trên sẽ là miễn phí.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="block text-sm font-bold text-gray-700 min-w-[120px]">MIỄN PHÍ ĐẾN:</label>
                  <Select value={freeUntilTopicId || "null"} onValueChange={setFreeUntilTopicId}>
                    <SelectTrigger className="flex-1 h-12 border-2 border-purple-200/60 rounded-2xl bg-white/90 focus:border-purple-500">
                      <SelectValue placeholder="Chọn chủ đề miễn phí cuối cùng" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-purple-200 shadow-xl">
                      <SelectItem value="null">Tất cả có phí</SelectItem>
                      {topics
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((topic) => (
                          <SelectItem key={topic.id} value={String(topic.id)}>
                            {topic.topicName} (Thứ tự: {topic.sortOrder})
                          </SelectItem>
                        ))}
                      <SelectItem value="all-free">Tất cả miễn phí</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Topics Table */}
          <div className="relative overflow-x-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden min-w-[700px]">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 px-4 sm:px-8 py-4 sm:py-6">
                <div
                  className={`grid gap-2 sm:gap-4 font-bold text-blue-700 text-xs sm:text-sm ${
                    isEditingCurriculum || isConfiguringPricing ? "grid-cols-7" : "grid-cols-6"
                  }`}
                >
                  {isEditingCurriculum && <div className="text-center">THỨ TỰ</div>}
                  <div className="text-left">TÊN CHỦ ĐỀ</div>
                  <div className="text-center">NGÀY TẠO</div>
                  <div className="text-center">CHỦ ĐỀ PHỤ</div>
                  <div className="text-center">TRẠNG THÁI</div>
                  <div className="text-center">LOẠI GÓI</div> {/* New column for pricing */}
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
                    const isDragging = draggedItemId === topic.id
                    const isDragOver = dragOverItemId === topic.id
                    const actualIndex = startIndex + index // Get the actual index in the full list
                    const displayTopic = isConfiguringPricing
                      ? tempPricingTopics.find((t) => t.id === topic.id) || topic
                      : topic

                    return (
                      <div
                        key={topic.id}
                        draggable={isEditingCurriculum}
                        onDragStart={(e) => handleDragStart(e, topic.id)}
                        onDragOver={(e) => handleDragOver(e, topic.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, topic.id)}
                        className={`px-4 sm:px-8 py-4 sm:py-6 transition-colors group ${
                          isDragging
                            ? "opacity-50 bg-blue-100/50"
                            : isDragOver
                              ? "bg-blue-200/30 border-t-2 border-blue-400"
                              : "hover:bg-blue-50/30"
                        } ${isEditingCurriculum ? "cursor-move" : "cursor-default"}`}
                      >
                        <div
                          className={`grid gap-2 sm:gap-4 items-center text-xs sm:text-sm ${
                            isEditingCurriculum || isConfiguringPricing ? "grid-cols-7" : "grid-cols-6"
                          }`}
                        >
                          {/* Order Number - Only show in editing mode */}
                          {isEditingCurriculum && (
                            <div className="text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                                {actualIndex + 1}
                              </span>
                            </div>
                          )}

                          {/* Topic Name */}
                          <div className="text-left">
                            <div className="text-gray-700 font-medium truncate">{displayTopic.topicName}</div>
                          </div>

                          {/* Created Date */}
                          <div className="text-center">
                            <div className="text-gray-700 font-medium">
                              {new Date(displayTopic.createdAt).toLocaleDateString("vi-VN")}
                            </div>
                          </div>

                          {/* Subtopic Count */}
                          <div className="text-center">
                            <div className="text-gray-700 font-medium">{displayTopic.subtopicCount ?? 0}</div>
                          </div>

                          {/* Status */}
                          <div className="text-center">
                            <span
                              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-bold border-2 shadow-sm ${statusInfo.className}`}
                            >
                              {statusInfo.text}
                            </span>
                          </div>

                          {/* Pricing Type */}
                          <div className="text-center">
                            <span
                              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-bold border-2 shadow-sm ${
                                displayTopic.isFree
                                  ? "bg-green-100 text-green-700 border-green-300"
                                  : "bg-purple-100 text-purple-700 border-purple-300"
                              }`}
                            >
                              {displayTopic.isFree ? "MIỄN PHÍ" : "CÓ PHÍ"}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-1 sm:gap-3 justify-center">
                            {/* View Button - Available for all roles when not editing */}
                            {!isEditingCurriculum && !isConfiguringPricing && (
                              <Button
                                onClick={() => handleViewTopic(displayTopic.id)}
                                className="p-2 sm:p-3 bg-blue-200 hover:bg-blue-300 text-blue-600 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                                size="sm"
                                title="Xem chi tiết chủ đề"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            )}

                            {/* Request Edit Button - Only for content approver and only if not already needs edit and not editing */}
                            {role === "content-approver" &&
                              displayTopic.status !== "needs_edit" &&
                              !isEditingCurriculum &&
                              !isConfiguringPricing && (
                                <Button
                                  onClick={() => handleRequestEdit(displayTopic.id)}
                                  className="p-2 sm:p-3 bg-orange-200 hover:bg-orange-300 text-orange-600 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                                  size="sm"
                                  title="Yêu cầu chỉnh sửa chủ đề"
                                >
                                  <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                              )}

                            {/* Hide/Unhide Button - Only visible in editing mode */}
                            {(isEditingCurriculum || isConfiguringPricing) && (
                              <Button
                                onClick={() => handleToggleVisibilityInEdit(displayTopic.id)}
                                className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 ${
                                  displayTopic.isHidden
                                    ? "bg-green-200 hover:bg-green-300 text-green-600"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                                }`}
                                size="sm"
                                title={displayTopic.isHidden ? "Hiển thị chủ đề" : "Ẩn chủ đề"}
                              >
                                <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            )}
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
          {totalPages > 1 && !isEditingCurriculum && !isConfiguringPricing && (
            <div className="flex justify-center items-center gap-3">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                ←
              </Button>

              {(() => {
                const pages = []
                const showPages = 5
                let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
                const endPage = Math.min(totalPages, startPage + showPages - 1)

                if (endPage - startPage + 1 < showPages) {
                  startPage = Math.max(1, endPage - showPages + 1)
                }

                if (startPage > 1) {
                  pages.push(
                    <Button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      1
                    </Button>,
                  )
                  if (startPage > 2) {
                    pages.push(
                      <span key="ellipsis1" className="w-12 h-12 flex items-center justify-center text-gray-500">
                        ...
                      </span>,
                    )
                  }
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <Button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-12 h-12 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-200 ${
                        i === currentPage
                          ? "bg-blue-500 text-white"
                          : "bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {i}
                    </Button>,
                  )
                }

                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="ellipsis2" className="w-12 h-12 flex items-center justify-center text-gray-500">
                        ...
                      </span>,
                    )
                  }
                  pages.push(
                    <Button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {totalPages}
                    </Button>,
                  )
                }

                return pages
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

          {/* Editing Instructions */}
          {isEditingCurriculum && (
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Settings className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-bold text-blue-700">CHẾ ĐỘ CHỈNH SỬA LỘ TRÌNH HỌC</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full font-bold text-xs">
                        1
                      </span>
                      <span>Kéo thả để sắp xếp thứ tự</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <EyeOff className="w-4 h-4 text-gray-400" />
                      <span>Bấm để ẩn/bỏ ẩn chủ đề</span>
                    </div>
                  </div>
                </div>
              </div>
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
      {showHideConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowHideConfirmModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl border border-white/50 p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <AlertCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-orange-700 mb-2">XÁC NHẬN THAY ĐỔI</h3>
              <p className="text-gray-600">
                {(() => {
                  const topic = (
                    isEditingCurriculum ? tempTopics : isConfiguringPricing ? tempPricingTopics : topics
                  ).find((t) => t.id === selectedTopicId)
                  if (!topic) return "Bạn có chắc chắn muốn thực hiện thay đổi này?"
                  return (
                    <>
                      Bạn có chắc chắn muốn{" "}
                      <span className="font-bold text-orange-600">{topic.isHidden ? "hiển thị" : "ẩn"}</span> chủ đề{" "}
                      <span className="font-bold text-blue-600">"{topic.topicName}"</span>?
                    </>
                  )
                })()}
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

      {/* Save Pricing Confirmation Modal */}
      {showSavePricingConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowSavePricingConfirmModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl border border-white/50 p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-blue-700 mb-2">XÁC NHẬN LƯU CẤU HÌNH GIÁ</h3>
              <p className="text-gray-600">Bạn có chắc chắn muốn lưu các thay đổi về cấu hình giá?</p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setShowSavePricingConfirmModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-2xl transition-all duration-300"
              >
                Hủy
              </Button>
              <Button
                onClick={handleConfirmSavePricingChanges}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
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
