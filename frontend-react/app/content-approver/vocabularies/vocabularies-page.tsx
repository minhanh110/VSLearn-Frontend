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
  }, [role, searchTerm, currentPage]);

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
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-2">
              DUYỆT TỪ VỰNG
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
          </div>
          <div className="relative mb-8">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
              <div className="flex flex-col lg:flex-row gap-6 items-end">
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
          {/* Filter by creator */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
            <label className="font-semibold text-gray-700">Người tạo:</label>
            <div className="w-72">
              <Select value={selectedCreator} onValueChange={setSelectedCreator}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn người tạo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {creators.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.firstName} {c.lastName} ({c.userEmail})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-6 mb-8">
            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : filteredVocabularies.length === 0 ? (
              <p>Không tìm thấy từ vựng nào chờ duyệt.</p>
            ) : (
              filteredVocabularies.map((vocab) => (
                <div key={vocab.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg">
                          <span className="text-3xl font-bold text-white">{vocab.vocab}</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-2xl text-sm font-bold shadow-sm">
                            {vocab.topicName}
                          </span>
                          <span className="px-6 py-3 bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-700 rounded-2xl text-sm font-bold shadow-sm">
                            {vocab.region || "Toàn Quốc"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={() => handleViewVocab(vocab.id)} className="group/btn relative flex items-center gap-3 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          <Eye className="w-5 h-5 relative z-10" />
                          <span className="relative z-10">XEM</span>
                        </Button>
                        <Button onClick={() => handleApprove(vocab.id)} className="group/btn relative flex items-center gap-3 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          <CheckCircle className="w-5 h-5 relative z-10" />
                          <span className="relative z-10">DUYỆT</span>
                        </Button>
                        <Button onClick={() => handleReject(vocab.id)} className="group/btn relative flex items-center gap-3 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          <XCircle className="w-5 h-5 relative z-10" />
                          <span className="relative z-10">TỪ CHỐI</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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
            <span className="font-semibold text-blue-700">{currentPage} / {totalPages}</span>
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