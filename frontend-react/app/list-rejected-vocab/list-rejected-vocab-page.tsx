"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUserRole } from "@/hooks/use-user-role"
import { VocabService } from "@/app/services/vocab.service"

interface RejectedVocab {
  id: number
  vocab: string
  meaning?: string
  topicName: string
  subTopicName: string
  region?: string
  status: string
  description?: string
  videoLink?: string
  createdAt: string
  createdBy: number
  updatedAt?: string
  updatedBy?: number
  deletedAt?: string
  deletedBy?: number
}

export function ListRejectedVocabPageComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rejectedVocabs, setRejectedVocabs] = useState<RejectedVocab[]>([])
  const [loading, setLoading] = useState(true)

  const { role, loading: roleLoading } = useUserRole()

  // Fetch rejected vocabularies
  useEffect(() => {
    const fetchRejectedVocabs = async () => {
      try {
        setLoading(true)
        const response = await VocabService.getVocabList({
          page: currentPage - 1,
          search: searchTerm,
          status: "rejected",
        })
        const vocabs = response.data.vocabList || response.data.content || response.data || []
        setRejectedVocabs(Array.isArray(vocabs) ? vocabs.filter((vocab: any) => vocab.status === "rejected") : [])
      } catch (error: any) {
        console.error("Error fetching rejected vocabularies:", error)
        alert("Không thể tải danh sách từ vựng bị từ chối. Vui lòng thử lại!")
        setRejectedVocabs([])
      } finally {
        setLoading(false)
      }
    }

    fetchRejectedVocabs()
  }, [currentPage, searchTerm])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "rejected":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-300"
      case "active":
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
        return "BỊ TỪ CHỐI"
      case "active":
        return "HOẠT ĐỘNG"
      case "pending":
        return "ĐANG XỬ LÝ"
      default:
        return "KHÔNG XÁC ĐỊNH"
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/vocab-edit?id=${id}`)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa từ vựng này?")) {
      try {
        await VocabService.deleteVocab(id)
        alert("Xóa từ vựng thành công!")
        // Refresh the list
        const updatedVocabs = rejectedVocabs.filter((vocab) => vocab.id !== id)
        setRejectedVocabs(updatedVocabs)
      } catch (error: any) {
        alert(error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!")
      }
    }
  }

  const totalPages = 5

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-700 font-medium">
        Đang kiểm tra quyền truy cập...
      </div>
    )
  }

  if (role !== "content-creator" && role !== "general-manager") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-lg px-8 py-12 text-center">
          <div className="text-3xl mb-4 text-blue-700 font-bold">🚫 Không có quyền truy cập</div>
          <div className="text-gray-600 text-lg">
            Chỉ tài khoản <b>Người tạo nội dung</b> hoặc <b>Quản lý</b> mới được xem danh sách từ vựng bị từ chối.
            <br />
            Vui lòng liên hệ quản trị viên nếu bạn cần quyền này.
          </div>
        </div>
      </div>
    )
  }

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
              DANH SÁCH TỪ VỰNG BỊ TỪ CHỐI
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
                    placeholder="Tìm kiếm từ vựng..."
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
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden min-w-[900px]">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 px-4 sm:px-8 py-4 sm:py-6">
                <div className="grid grid-cols-6 gap-2 sm:gap-4 font-bold text-blue-700 text-xs sm:text-sm">
                  <div>TỪ VỰNG</div>
                  <div>CHỦ ĐỀ</div>
                  <div>KHU VỰC</div>
                  <div>TRẠNG THÁI</div>
                  <div>NGÀY TẠO</div>
                  <div>HÀNH ĐỘNG</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-blue-100/50">
                {loading ? (
                  <div className="px-4 sm:px-8 py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-700 font-medium">Đang tải...</p>
                  </div>
                ) : rejectedVocabs.length === 0 ? (
                  <div className="px-4 sm:px-8 py-8 text-center">
                    <p className="text-gray-600">Không có từ vựng nào bị từ chối.</p>
                  </div>
                ) : (
                  rejectedVocabs.map((vocab, index) => (
                    <div key={index} className="px-4 sm:px-8 py-4 sm:py-6 hover:bg-blue-50/30 transition-colors group">
                      <div className="grid grid-cols-6 gap-2 sm:gap-4 items-center text-xs sm:text-sm">
                        {/* Vocabulary Column */}
                        <div>
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-900 truncate">{vocab.vocab}</span>
                            {vocab.meaning && (
                              <span className="text-xs text-gray-500 italic truncate">{vocab.meaning}</span>
                            )}
                          </div>
                        </div>

                        {/* Topic Column */}
                        <div>
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-700 font-medium truncate">
                              {vocab.topicName || "Chưa phân loại"}
                            </span>
                            {vocab.subTopicName && (
                              <span className="text-xs text-gray-500 truncate">{vocab.subTopicName}</span>
                            )}
                          </div>
                        </div>

                        {/* Region Column */}
                        <div className="text-gray-700 font-medium truncate">{vocab.region || "Toàn quốc"}</div>

                        {/* Status Column */}
                        <div>
                          <span
                            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-bold border-2 shadow-sm ${getStatusColor(
                              vocab.status,
                            )}`}
                          >
                            {getStatusText(vocab.status)}
                          </span>
                        </div>

                        {/* Created Date Column */}
                        <div className="text-gray-700 font-medium">
                          {new Date(vocab.createdAt).toLocaleDateString("vi-VN")}
                        </div>

                        {/* Actions Column */}
                        <div className="flex gap-1 sm:gap-3">
                          <Button
                            onClick={() => handleEdit(vocab.id)}
                            className="group/btn relative flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                            <span className="relative z-10 text-xs sm:text-sm">SỬA</span>
                          </Button>
                          <Button
                            onClick={() => handleDelete(vocab.id)}
                            className="group/btn relative flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                            <span className="relative z-10 text-xs sm:text-sm">XÓA</span>
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
