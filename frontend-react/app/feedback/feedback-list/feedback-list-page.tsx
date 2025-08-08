"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface FeedbackItem {
  id: string
  studentName: string
  studentEmail: string
  topic: string
  score: number
  createdDate: string
  starRating: number
}

export function FeedbackListPageComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [selectedStarRating, setSelectedStarRating] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Sample feedback data
  const [feedbackData] = useState<FeedbackItem[]>([
    {
      id: "fb1",
      studentName: "Nguyễn Văn An",
      studentEmail: "an.nguyen@email.com",
      topic: "BẢNG CHỮ CÁI",
      score: 100,
      createdDate: "13/05/2022",
      starRating: 5,
    },
    {
      id: "fb2",
      studentName: "Trần Thị Bình",
      studentEmail: "binh.tran@email.com",
      topic: "CON NGƯỜI",
      score: 60,
      createdDate: "13/05/2022",
      starRating: 3,
    },
    {
      id: "fb3",
      studentName: "Lê Minh Cường",
      studentEmail: "cuong.le@email.com",
      topic: "GIA ĐÌNH",
      score: 36,
      createdDate: "13/05/2022",
      starRating: 2,
    },
    {
      id: "fb4",
      studentName: "Phạm Thị Dung",
      studentEmail: "dung.pham@email.com",
      topic: "TỰ NHIÊN",
      score: 80,
      createdDate: "13/05/2022",
      starRating: 4,
    },
    {
      id: "fb5",
      studentName: "Hoàng Văn Em",
      studentEmail: "em.hoang@email.com",
      topic: "ĐỘNG VẬT",
      score: 21,
      createdDate: "13/05/2022",
      starRating: 1,
    },
    {
      id: "fb6",
      studentName: "Võ Thị Phương",
      studentEmail: "phuong.vo@email.com",
      topic: "GIAO THÔNG",
      score: 95,
      createdDate: "13/05/2022",
      starRating: 5,
    },
  ])

  const topicOptions = [
    { value: "all", label: "Tất cả chủ đề" },
    { value: "BẢNG CHỮ CÁI", label: "Bảng chữ cái" },
    { value: "CON NGƯỜI", label: "Con người" },
    { value: "GIA ĐÌNH", label: "Gia đình" },
    { value: "TỰ NHIÊN", label: "Tự nhiên" },
    { value: "ĐỘNG VẬT", label: "Động vật" },
    { value: "GIAO THÔNG", label: "Giao thông" },
  ]

  const starOptions = [
    { value: "all", label: "Tất cả số sao" },
    { value: "5", label: "5 sao" },
    { value: "4", label: "4 sao" },
    { value: "3", label: "3 sao" },
    { value: "2", label: "2 sao" },
    { value: "1", label: "1 sao" },
  ]

  // Filter feedback based on search term, topic, and star rating
  const filteredFeedback = feedbackData.filter((feedback) => {
    const matchesSearch =
      feedback.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = selectedTopic === "" || selectedTopic === "all" || feedback.topic === selectedTopic
    const matchesStarRating =
      selectedStarRating === "" || selectedStarRating === "all" || feedback.starRating.toString() === selectedStarRating
    return matchesSearch && matchesTopic && matchesStarRating
  })

  const handleViewDetails = (id: string) => {
    router.push(`/feedback-details?id=${id}`)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`w-4 h-4 ${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const totalPages = 5

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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 leading-relaxed">
              DANH SÁCH PHẢN HỒI
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
          </div>

          {/* Search and Filter Section */}
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

                {/* Topic Filter */}
                <div className="w-full lg:w-64">
                  <label className="block text-sm font-bold text-gray-700 mb-3">CHỦ ĐỀ</label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="h-14 border-2 border-blue-200/60 rounded-2xl bg-white/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md">
                      <SelectValue placeholder="Chọn Chủ Đề" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-blue-200 shadow-xl">
                      {topicOptions.map((topic) => (
                        <SelectItem key={topic.value} value={topic.value} className="rounded-lg">
                          {topic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Star Rating Filter */}
                <div className="w-full lg:w-64">
                  <label className="block text-sm font-bold text-gray-700 mb-3">SỐ SAO</label>
                  <Select value={selectedStarRating} onValueChange={setSelectedStarRating}>
                    <SelectTrigger className="h-14 border-2 border-blue-200/60 rounded-2xl bg-white/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md">
                      <SelectValue placeholder="Chọn Số Sao" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-blue-200 shadow-xl">
                      {starOptions.map((star) => (
                        <SelectItem key={star.value} value={star.value} className="rounded-lg">
                          {star.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Results Info */}
          {(searchTerm ||
            (selectedTopic && selectedTopic !== "all") ||
            (selectedStarRating && selectedStarRating !== "all")) && (
            <div className="mb-4 text-center">
              <p className="text-gray-600 bg-white/60 backdrop-blur-sm rounded-full px-6 py-2 inline-block shadow-sm">
                Hiển thị {filteredFeedback.length} kết quả
                {selectedTopic && selectedTopic !== "all" && (
                  <span className="ml-2 text-blue-600 font-semibold">
                    • {topicOptions.find((t) => t.value === selectedTopic)?.label}
                  </span>
                )}
                {selectedStarRating && selectedStarRating !== "all" && (
                  <span className="ml-2 text-yellow-600 font-semibold">• {selectedStarRating} sao</span>
                )}
              </p>
            </div>
          )}

          {/* Feedback Table */}
          <div className="relative overflow-x-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden min-w-[1000px]">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 px-4 sm:px-8 py-4 sm:py-6">
                <div className="grid grid-cols-7 gap-2 sm:gap-4 font-bold text-blue-700 text-xs sm:text-sm">
                  <div>TÊN NGƯỜI HỌC</div>
                  <div>EMAIL NGƯỜI HỌC</div>
                  <div>CHỦ ĐỀ</div>
                  <div>SỐ ĐIỂM</div>
                  <div>NGÀY TẠO</div>
                  <div>SỐ SAO</div>
                  <div>HÀNH ĐỘNG</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-blue-100/50">
                {filteredFeedback.length === 0 ? (
                  <div className="px-4 sm:px-8 py-12 text-center">
                    <div className="text-gray-500 text-lg">
                      {searchTerm || selectedTopic || selectedStarRating
                        ? "Không tìm thấy phản hồi nào phù hợp"
                        : "Không có phản hồi nào"}
                    </div>
                  </div>
                ) : (
                  filteredFeedback.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="px-4 sm:px-8 py-4 sm:py-6 transition-all duration-200 hover:bg-blue-50/30"
                    >
                      <div className="grid grid-cols-7 gap-2 sm:gap-4 items-center text-xs sm:text-sm">
                        <div className="font-bold text-gray-900 truncate">{feedback.studentName}</div>
                        <div className="text-gray-700 font-medium truncate">{feedback.studentEmail}</div>
                        <div className="text-gray-700 font-medium">{feedback.topic}</div>
                        <div className="text-gray-700 font-bold">{feedback.score}</div>
                        <div className="text-gray-700 font-medium">{feedback.createdDate}</div>
                        <div className="flex gap-1">{renderStars(feedback.starRating)}</div>
                        <div>
                          <Button
                            onClick={() => handleViewDetails(feedback.id)}
                            className="group/btn relative px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 overflow-hidden text-xs font-bold"
                            size="sm"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <Eye className="w-3 h-3 mr-1 relative z-10" />
                            <span className="relative z-10">XEM CHI TIẾT</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              ←
            </Button>
            {[1, 2, 3, "...", 5].map((page, index) => (
              <Button
                key={index}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                className={`w-12 h-12 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-200 ${
                  page === currentPage
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800"
                } ${typeof page !== "number" ? "cursor-default hover:bg-white/80" : ""}`}
                disabled={typeof page !== "number"}
              >
                {page}
              </Button>
            ))}
            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              →
            </Button>
          </div>
        </div>
      </div>
      

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default FeedbackListPageComponent
