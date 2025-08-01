import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, CheckCircle, XCircle, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { VocabService } from "@/app/services/vocab.service";
import { useUserRole } from "@/hooks/use-user-role"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { userManagementService, UserManagementData } from "@/app/services/user-management.service"

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

export function ApproverVocabulariesPageComponent() {
  console.log("Component ApproverVocabulariesPageComponent mounted");
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [vocabularies, setVocabularies] = useState<VocabularyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { role, loading: roleLoading } = useUserRole();
  const [pendingAction, setPendingAction] = useState<null | { id: number; type: "approve" | "reject" }>(null)
  const [creators, setCreators] = useState<UserManagementData[]>([])
  const [selectedCreator, setSelectedCreator] = useState<string>("all")

  useEffect(() => {
    console.log("useEffect called, role:", role);
    if (role === "content-approver") {
      fetchVocabularies();
      fetchCreators();
    }
  }, [role, searchTerm, currentPage, selectedCreator]);

  const fetchVocabularies = async () => {
    try {
      setLoading(true);
      const response = await VocabService.getVocabList({
        page: currentPage - 1,
        size: 10,
        search: searchTerm,
        status: "pending",
      });
      const vocabData = response.data.vocabList || response.data.content || response.data || [];
      setVocabularies(Array.isArray(vocabData) ? vocabData : []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error: any) {
      alert("Không thể tải danh sách từ vựng chờ duyệt. Vui lòng thử lại!");
      setVocabularies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreators = async () => {
    try {
      const res = await userManagementService.getCreatorsList(0, 1000)
      console.log("Creators API result:", res)
      setCreators(res.users || [])
    } catch (e) {
      console.log("Creators API error:", e)
      setCreators([])
    }
  }

  const handleApprove = (id: number) => {
    setPendingAction({ id, type: "approve" })
  }

  const handleReject = (id: number) => {
    setPendingAction({ id, type: "reject" })
  }

  const confirmAction = async () => {
    if (!pendingAction) return;
    try {
      if (pendingAction.type === "approve") {
        await VocabService.updateVocabStatus(pendingAction.id, "active");
        alert("Duyệt từ vựng thành công!");
      } else {
        await VocabService.updateVocabStatus(pendingAction.id, "rejected");
        alert("Từ chối từ vựng thành công!");
      }
      fetchVocabularies();
    } catch (error: any) {
      alert("Có lỗi xảy ra khi thực hiện thao tác!");
    } finally {
      setPendingAction(null);
    }
  }

  const handleViewVocab = (id: number) => {
    router.push(`/vocab-detail?id=${id}`)
  }

  // Filter vocabularies theo người tạo nếu có chọn
  const filteredVocabularies = selectedCreator && selectedCreator !== "all"
    ? vocabularies.filter(v => String(v.createdBy) === selectedCreator)
    : vocabularies

  if (roleLoading) {
    return <div className="min-h-screen flex items-center justify-center text-blue-700 font-medium">Đang kiểm tra quyền truy cập...</div>;
  }
  if (role !== "content-approver") {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">Bạn không có quyền truy cập trang này.</div>;
  }

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

      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 leading-relaxed">
              DUYỆT TỪ VỰNG
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

                {/* Creator Filter */}
                <div className="w-full lg:w-72">
                  <label className="block text-sm font-bold text-gray-700 mb-3">NGƯỜI TẠO</label>
                  <Select value={selectedCreator} onValueChange={setSelectedCreator}>
                    <SelectTrigger className="h-14 border-2 border-blue-200/60 rounded-2xl bg-white/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md">
                      <SelectValue placeholder="Chọn người tạo" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-blue-200 shadow-xl">
                      <SelectItem value="all" className="rounded-lg">Tất cả</SelectItem>
                      {creators.map(c => (
                        <SelectItem key={c.id} value={String(c.id)} className="rounded-lg">
                          {c.firstName} {c.lastName} ({c.userEmail})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <div>NGƯỜI TẠO</div>
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
                ) : filteredVocabularies.length === 0 ? (
                  <div className="px-4 sm:px-8 py-8 text-center">
                    <p className="text-gray-500 text-lg">Không tìm thấy từ vựng nào chờ duyệt.</p>
                  </div>
                ) : (
                  filteredVocabularies.map((vocab) => (
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
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-700 font-medium truncate block">
                              {vocab.topicName || "Chưa phân loại"}
                            </span>
                            {vocab.subTopicName && (
                              <span className="text-xs text-gray-500 truncate">
                                {vocab.subTopicName}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Region Column */}
                        <div>
                          <span className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-700 rounded-xl text-xs font-bold shadow-sm">
                            {vocab.region || "Toàn quốc"}
                          </span>
                        </div>

                        {/* Creator Column */}
                        <div>
                          <span className="text-gray-700 font-medium">
                            {creators.find(c => c.id === vocab.createdBy)?.firstName || "N/A"} {creators.find(c => c.id === vocab.createdBy)?.lastName || ""}
                          </span>
                        </div>

                        {/* Created Date Column */}
                        <div>
                          <span className="text-gray-700 font-medium">
                            {new Date(vocab.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>

                        {/* Actions Column */}
                        <div className="flex gap-1 sm:gap-2">
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
                            onClick={() => handleApprove(vocab.id)}
                            className="group/btn relative p-2 sm:p-3 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-600 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 overflow-hidden"
                            size="sm"
                            title="Duyệt"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                          </Button>
                          <Button
                            onClick={() => handleReject(vocab.id)}
                            className="group/btn relative p-2 sm:p-3 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-600 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 overflow-hidden"
                            size="sm"
                            title="Từ chối"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
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

            {/* Dynamic page numbers */}
            {(() => {
              const pages = [];
              const showPages = 5; // Number of page buttons to show
              let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
              let endPage = Math.min(totalPages, startPage + showPages - 1);
              
              // Adjust start page if we're near the end
              if (endPage - startPage + 1 < showPages) {
                startPage = Math.max(1, endPage - showPages + 1);
              }

              // Add first page and ellipsis if needed
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

              // Add page numbers
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

              // Add ellipsis and last page if needed
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
        </div>
      </div>

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* AlertDialog for confirm approve/reject */}
      <AlertDialog open={!!pendingAction} onOpenChange={open => !open && setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.type === "approve"
                ? "Xác nhận duyệt từ vựng"
                : "Xác nhận từ chối từ vựng"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.type === "approve"
                ? "Bạn có chắc chắn muốn DUYỆT từ vựng này?"
                : "Bạn có chắc chắn muốn TỪ CHỐI từ vựng này?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              {pendingAction?.type === "approve" ? "Duyệt" : "Từ chối"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}