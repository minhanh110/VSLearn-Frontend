"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Search } from "lucide-react"
import { useRouter } from "next/navigation"

interface RejectedVocab {
  id: string
  topicName: string
  creator: string
  createdDate: string
  issue: string
  status: "rejected" | "approved" | "pending"
}

export function ListRejectedVocabPageComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Sample rejected vocabulary data
  const rejectedVocabs: RejectedVocab[] = [
    {
      id: "#20462",
      topicName: "Công việc",
      creator: "Nguyễn Văn A",
      createdDate: "13/06/2022",
      issue: "Trong hạp nội dung",
      status: "rejected",
    },
    {
      id: "#20462",
      topicName: "Y học cơ bản",
      creator: "Lê Thị B",
      createdDate: "13/06/2022",
      issue: "Thiếu tài liệu tham khảo",
      status: "rejected",
    },
    {
      id: "#20462",
      topicName: "Toán học",
      creator: "Hoàng Minh C",
      createdDate: "13/06/2022",
      issue: "Thiếu bài học",
      status: "approved",
    },
    {
      id: "#20462",
      topicName: "Công nghệ thông tin",
      creator: "Cao Văn D",
      createdDate: "13/05/2022",
      issue: "Thiếu Chủ Đề Phụ",
      status: "approved",
    },
    {
      id: "#20462",
      topicName: "Lịch Sử",
      creator: "Trần Hoàng E",
      createdDate: "13/05/2022",
      issue: "Thiếu tài liệu tham khảo",
      status: "pending",
    },
    {
      id: "#20462",
      topicName: "Quản áo",
      creator: "Đỗ Đức F",
      createdDate: "13/05/2022",
      issue: "Thiếu Chủ Đề Phụ",
      status: "pending",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "rejected":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-300"
      case "approved":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300"
      case "pending":
        return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border-orange-300"
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "rejected":
        return "TỪ CHỐI"
      case "approved":
        return "ĐÃ ĐƯỢC DUYỆT"
      case "pending":
        return "ĐANG XỬ LÝ"
      default:
        return "KHÔNG XÁC ĐỊNH"
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/vocab-edit?id=${id}`)
  }

  const handleDelete = (id: string) => {
    // Handle delete vocabulary
    console.log("Delete vocabulary:", id)
  }

  const totalPages = 5

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating circles */}
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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-2">
              DANH SÁCH CHỦ ĐỀ BỊ TỪ CHỐI
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <div className="max-w-md mx-auto sm:mx-0">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 z-10" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm chủ đề..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 h-14 border-3 border-blue-300/60 rounded-2xl bg-white/90 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-gray-700 placeholder:text-gray-400 w-full"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="relative overflow-x-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden min-w-[800px]">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 px-4 sm:px-8 py-4 sm:py-6">
                <div className="grid grid-cols-6 gap-2 sm:gap-4 font-bold text-blue-700 text-xs sm:text-sm">
                  <div>TÊN CHỦ ĐỀ</div>
                  <div>NGƯỜI TẠO</div>
                  <div>NGÀY TẠO</div>
                  <div>VẤN ĐỀ CHÍNH</div>
                  <div>TRẠNG THÁI</div>
                  <div>HÀNH ĐỘNG</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-blue-100/50">
                {rejectedVocabs.map((vocab, index) => (
                  <div key={index} className="px-4 sm:px-8 py-4 sm:py-6 hover:bg-blue-50/30 transition-colors group">
                    <div className="grid grid-cols-6 gap-2 sm:gap-4 items-center text-xs sm:text-sm">
                      <div className="font-bold text-gray-900 truncate">{vocab.topicName}</div>
                      <div className="text-gray-700 font-medium truncate">{vocab.creator}</div>
                      <div className="text-gray-700 font-medium">{vocab.createdDate}</div>
                      <div className="text-gray-700 font-medium truncate">{vocab.issue}</div>
                      <div>
                        <span
                          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-bold border-2 shadow-sm ${getStatusColor(
                            vocab.status,
                          )}`}
                        >
                          {getStatusText(vocab.status)}
                        </span>
                      </div>
                      <div className="flex gap-1 sm:gap-3">
                        <Button
                          onClick={() => handleEdit(vocab.id)}
                          className="group/btn relative p-2 sm:p-3 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-600 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 overflow-hidden"
                          size="sm"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(vocab.id)}
                          className="group/btn relative p-2 sm:p-3 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-600 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 overflow-hidden"
                          size="sm"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-8">
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

export default ListRejectedVocabPageComponent
