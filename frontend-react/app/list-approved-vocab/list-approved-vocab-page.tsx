"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Trash2, Search, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface ApprovedVocab {
  id: number
  vocab: string
  meaning?: string
  topicName: string
  subTopicName: string
  region?: string
  status: "active"
  description?: string
  videoLink?: string
  createdAt: string
  createdBy: number
  updatedAt?: string
  updatedBy?: number
}

export function ListApprovedVocabComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [approvedVocabs, setApprovedVocabs] = useState<ApprovedVocab[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedVocabId, setSelectedVocabId] = useState<number | null>(null)

  // Mock data for approved vocabularies
  const mockApprovedVocabs: ApprovedVocab[] = [
    {
      id: 1,
      vocab: "Xin chào",
      meaning: "Lời chào hỏi thân thiện",
      topicName: "Chào hỏi cơ bản",
      subTopicName: "Chào hỏi hàng ngày",
      region: "Miền Bắc",
      status: "active",
      createdAt: "2024-01-15",
      createdBy: 1,
    },
    {
      id: 2,
      vocab: "Cảm ơn",
      meaning: "Lời cảm ơn",
      topicName: "Chào hỏi cơ bản",
      subTopicName: "Lời cảm ơn",
      region: "Toàn quốc",
      status: "active",
      createdAt: "2024-01-20",
      createdBy: 2,
    },
    {
      id: 3,
      vocab: "Bố",
      meaning: "Người cha",
      topicName: "Gia đình",
      subTopicName: "Thành viên gia đình",
      region: "Toàn quốc",
      status: "active",
      createdAt: "2024-01-25",
      createdBy: 1,
    },
    {
      id: 4,
      vocab: "Mẹ",
      meaning: "Người mẹ",
      topicName: "Gia đình",
      subTopicName: "Thành viên gia đình",
      region: "Toàn quốc",
      status: "active",
      createdAt: "2024-02-01",
      createdBy: 3,
    },
    {
      id: 5,
      vocab: "Đỏ",
      meaning: "Màu đỏ",
      topicName: "Màu sắc",
      subTopicName: "Màu cơ bản",
      region: "Toàn quốc",
      status: "active",
      createdAt: "2024-02-05",
      createdBy: 2,
    },
    {
      id: 6,
      vocab: "Xanh",
      meaning: "Màu xanh",
      topicName: "Màu sắc",
      subTopicName: "Màu cơ bản",
      region: "Miền Nam",
      status: "active",
      createdAt: "2024-02-10",
      createdBy: 1,
    },
    {
      id: 7,
      vocab: "Một",
      meaning: "Số 1",
      topicName: "Số đếm",
      subTopicName: "Số từ 1-10",
      region: "Toàn quốc",
      status: "active",
      createdAt: "2024-02-15",
      createdBy: 3,
    },
    {
      id: 8,
      vocab: "Hai",
      meaning: "Số 2",
      topicName: "Số đếm",
      subTopicName: "Số từ 1-10",
      region: "Toàn quốc",
      status: "active",
      createdAt: "2024-02-20",
      createdBy: 2,
    },
  ]

  // Fetch approved vocabularies
  useEffect(() => {
    const fetchApprovedVocabs = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Filter vocabularies based on search term
        const filteredVocabs = mockApprovedVocabs.filter(
          (vocab) =>
            vocab.vocab.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vocab.meaning?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vocab.topicName.toLowerCase().includes(searchTerm.toLowerCase()),
        )

        setApprovedVocabs(filteredVocabs)
      } catch (error: any) {
        console.error("Error fetching approved vocabularies:", error)
        alert("Không thể tải danh sách từ vựng đã phê duyệt. Vui lòng thử lại!")
        setApprovedVocabs([])
      } finally {
        setLoading(false)
      }
    }

    fetchApprovedVocabs()
  }, [searchTerm])

  const handleViewDetails = (id: number) => {
    router.push(`/vocab-details?id=${id}`)
  }

  const handleShowDeleteModal = (id: number) => {
    setSelectedVocabId(id)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedVocabId) return

    try {
      // Here you would make API call to delete vocab
      console.log(`Deleting vocab with id: ${selectedVocabId}`)

      // Remove from local state
      setApprovedVocabs(approvedVocabs.filter((vocab) => vocab.id !== selectedVocabId))
      alert("Xóa từ vựng thành công!")
    } catch (error: any) {
      alert("Có lỗi xảy ra khi xóa từ vựng. Vui lòng thử lại!")
    } finally {
      setShowDeleteModal(false)
      setSelectedVocabId(null)
    }
  }

  const totalPages = Math.ceil(approvedVocabs.length / 10)
  const startIndex = (currentPage - 1) * 10
  const endIndex = startIndex + 10
  const currentVocabs = approvedVocabs.slice(startIndex, endIndex)

  const selectedVocabForDelete = approvedVocabs.find((v) => v.id === selectedVocabId)

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
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent leading-relaxed">
                TỪ VỰNG ĐÃ PHÊ DUYỆT
              </h1>
            </div>
            <p className="text-gray-600 text-lg mb-4">Danh sách từ vựng đang hoạt động và sẵn sàng cho học viên</p>
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
                  <div className="text-left">TỪ VỰNG</div>
                  <div className="text-center">CHỦ ĐỀ</div>
                  <div className="text-center">KHU VỰC</div>
                  <div className="text-center">TRẠNG THÁI</div>
                  <div className="text-center">NGÀY TẠO</div>
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
                ) : currentVocabs.length === 0 ? (
                  <div className="px-4 sm:px-8 py-8 text-center">
                    <p className="text-gray-600">Không có từ vựng nào được phê duyệt.</p>
                  </div>
                ) : (
                  currentVocabs.map((vocab, index) => (
                    <div
                      key={vocab.id}
                      className="px-4 sm:px-8 py-4 sm:py-6 hover:bg-blue-50/30 transition-colors group"
                    >
                      <div className="grid grid-cols-6 gap-2 sm:gap-4 items-center text-xs sm:text-sm">
                        {/* Vocabulary Column */}
                        <div className="text-left">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-900 truncate">{vocab.vocab}</span>
                            {vocab.meaning && (
                              <span className="text-xs text-gray-500 italic truncate">{vocab.meaning}</span>
                            )}
                          </div>
                        </div>

                        {/* Topic Column */}
                        <div className="text-center">
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
                        <div className="text-center">
                          <div className="text-gray-700 font-medium truncate">{vocab.region || "Toàn quốc"}</div>
                        </div>

                        {/* Status Column */}
                        <div className="text-center">
                          <span className="px-2 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-bold border-2 shadow-sm bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300">
                            HOẠT ĐỘNG
                          </span>
                        </div>

                        {/* Created Date Column */}
                        <div className="text-center">
                          <div className="text-gray-700 font-medium">
                            {new Date(vocab.createdAt).toLocaleDateString("vi-VN")}
                          </div>
                        </div>

                        {/* Actions Column */}
                        <div className="flex gap-1 sm:gap-3 justify-center">
                          <Button
                            onClick={() => handleViewDetails(vocab.id)}
                            className="group/btn relative flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                            title="Xem chi tiết từ vựng"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                          </Button>
                          <Button
                            onClick={() => handleShowDeleteModal(vocab.id)}
                            className="group/btn relative flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                            title="Xóa từ vựng"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
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
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                ←
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <Button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-12 h-12 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-200 ${
                      pageNum === currentPage
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        : "bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {pageNum}
                  </Button>
                )
              })}

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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedVocabForDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-xl border border-white/50 p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <Trash2 className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-700 mb-2">XÁC NHẬN XÓA</h3>
              <p className="text-gray-600">
                Bạn có chắc chắn muốn xóa từ vựng{" "}
                <span className="font-bold text-blue-600">"{selectedVocabForDelete.vocab}"</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">Hành động này không thể hoàn tác.</p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-2xl transition-all duration-300"
              >
                Hủy
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Xóa
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

export default ListApprovedVocabComponent