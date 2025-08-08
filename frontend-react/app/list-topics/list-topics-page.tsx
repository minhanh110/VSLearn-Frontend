"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Ban, Plus, Search } from "lucide-react"
import { VocabService } from "@/app/services/vocab.service"

interface VocabularyItem {
  id: number
  vocab: string
  topicName: string
  subTopicName: string
  description?: string
  videoLink?: string
  region?: string
  status: string
  createdAt: string
  createdBy: number
  updatedAt?: string
  updatedBy?: number
  deletedAt?: string
  deletedBy?: number
}

export function ListVocabPageComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [vocabularies, setVocabularies] = useState<VocabularyItem[]>([])
  const [loading, setLoading] = useState(true)

  // Dynamic regions state
  const [regions, setRegions] = useState<{ value: string; label: string }[]>([])
  // Dynamic topics state
  const [topics, setTopics] = useState<{ value: string; label: string; id: string | number }[]>([])

  // Fetch regions and topics on mount
  useEffect(() => {
    // Fetch regions
    fetch("/vocab/regions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRegions(data.map((r: any) => ({ value: r.value || r.id, label: r.label || r.name })))
        }
      })
      .catch(() => setRegions([]))

    // Fetch topics
    fetch("/vocab/topics")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTopics(data.map((t: any) => ({ value: t.id?.toString() || t.value, label: t.name || t.label, id: t.id })))
        }
      })
      .catch(() => setTopics([]))
  }, [])

  // Fetch vocabularies data
  useEffect(() => {
    const fetchVocabularies = async () => {
      try {
        setLoading(true)
        const response = await VocabService.getVocabList({
          page: currentPage,
          search: searchTerm,
          topic: selectedTopic,
          region: selectedRegion,
        })
        const vocabData = response.data.vocabList || response.data.content || response.data || []
        setVocabularies(Array.isArray(vocabData) ? vocabData : [])
      } catch (error: any) {
        console.error("Error fetching vocabularies:", error)
        alert("Không thể tải danh sách từ vựng. Vui lòng thử lại!")
        setVocabularies([])
      } finally {
        setLoading(false)
      }
    }

    fetchVocabularies()
  }, [currentPage, searchTerm, selectedTopic, selectedRegion])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300"
      case "pending":
        return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border-orange-300"
      case "rejected":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-300"
      case "inactive":
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300"
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "HOẠT ĐỘNG"
      case "pending":
        return "ĐANG KIỂM DUYỆT"
      case "rejected":
        return "BỊ TỪ CHỐI"
      case "inactive":
        return "VÔ HIỆU HÓA"
      default:
        return "KHÔNG XÁC ĐỊNH"
    }
  }

  const handleViewVocab = (id: number) => {
    router.push(`/vocab-detail?id=${id.toString()}`)
  }

  const handleDisableVocab = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn vô hiệu hóa từ vựng này?")) {
      try {
        await VocabService.deleteVocab(id)
        alert("Vô hiệu hóa từ vựng thành công!")
        // Refresh the list
        const updatedVocabularies = vocabularies.filter((vocab) => vocab.id !== id)
        setVocabularies(updatedVocabularies)
      } catch (error: any) {
        alert(error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!")
      }
    }
  }

  const handleAddVocab = () => {
    router.push("/add-vocabulary")
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
              DANH SÁCH TỪ VỰNG
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
                      {topics.map((topic) => (
                        <SelectItem key={topic.value} value={topic.label} className="rounded-lg">
                          {topic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Region Filter */}
                <div className="w-full lg:w-64">
                  <label className="block text-sm font-bold text-gray-700 mb-3">KHU VỰC</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="h-14 border-2 border-blue-200/60 rounded-2xl bg-white/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md">
                      <SelectValue placeholder="Chọn Khu Vực" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-blue-200 shadow-xl">
                      {regions.map((region) => (
                        <SelectItem key={region.value} value={region.value} className="rounded-lg">
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Add Button */}
                <div className="w-full lg:w-auto">
                  <Button
                    onClick={handleAddVocab}
                    className="w-full lg:w-auto flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    THÊM TỪ VỰNG
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Vocabulary Table */}
          <div className="relative overflow-x-auto mb-8">
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
                ) : vocabularies.length === 0 ? (
                  <div className="px-4 sm:px-8 py-8 text-center">
                    <p className="text-gray-500 text-lg">Không tìm thấy từ vựng nào.</p>
                  </div>
                ) : (
                  vocabularies.map((vocab, index) => (
                    <div
                      key={vocab.id}
                      className="px-4 sm:px-8 py-4 sm:py-6 hover:bg-blue-50/30 transition-colors group"
                    >
                      <div className="grid grid-cols-6 gap-2 sm:gap-4 items-center text-xs sm:text-sm">
                        {/* Vocabulary Column */}
                        <div>
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-900 truncate">{vocab.vocab}</span>
                            {vocab.description && (
                              <span className="text-xs text-gray-500 italic truncate">{vocab.description}</span>
                            )}
                          </div>
                        </div>

                        {/* Topic Column */}
                        <div>
                          <span className="text-gray-700 font-medium truncate block">
                            {vocab.topicName || "Chưa phân loại"}
                          </span>
                        </div>

                        {/* Region Column */}
                        <div>
                          <span className="text-gray-700 font-medium truncate block">
                            {vocab.region || "Toàn quốc"}
                          </span>
                        </div>

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
                        <div>
                          <span className="text-gray-700 font-medium">
                            {new Date(vocab.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>

                        {/* Actions Column */}
                        <div className="flex gap-1 sm:gap-3">
                          <Button
                            onClick={() => handleViewVocab(vocab.id)}
                            className="group/btn relative p-2 sm:p-3 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-600 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 overflow-hidden"
                            size="sm"
                            title="Xem chi tiết"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                          </Button>
                          <Button
                            onClick={() => handleDisableVocab(vocab.id)}
                            className="group/btn relative p-2 sm:p-3 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-600 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 overflow-hidden"
                            size="sm"
                            title="Vô hiệu hóa"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <Ban className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
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

export default ListVocabPageComponent

