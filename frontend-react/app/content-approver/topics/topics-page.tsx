import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, CheckCircle, XCircle, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { TopicService } from "@/app/services/topic.service";
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

interface TopicItem {
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
}

export function ApproverTopicsPageComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [topics, setTopics] = useState<TopicItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { role, loading: roleLoading } = useUserRole();
  const [pendingAction, setPendingAction] = useState<null | { id: number; type: "approve" | "reject" }>(null)
  const [creators, setCreators] = useState<UserManagementData[]>([])
  const [selectedCreator, setSelectedCreator] = useState<string>("all")

  useEffect(() => {
    if (role === "content-approver") {
      fetchTopics();
      fetchCreators();
    }
  }, [role, searchTerm, currentPage, selectedCreator]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage - 1,
        size: 10,
        search: searchTerm,
        status: "pending",
      };
      if (selectedCreator && selectedCreator !== "all") {
        params.createdBy = selectedCreator;
      }
      const response = await TopicService.getTopicList(params);
      setTopics(response.data.topicList || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error: any) {
      alert("Không thể tải danh sách chủ đề chờ duyệt. Vui lòng thử lại!");
      setTopics([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreators = async () => {
    try {
      // Lấy tối đa 1000 creator, có thể điều chỉnh nếu cần
      const res = await userManagementService.getCreatorsList(0, 1000)
      setCreators(res.users || [])
    } catch (e) {
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
        await TopicService.updateTopicStatus(pendingAction.id, "active");
        alert("Duyệt chủ đề thành công!");
      } else {
        await TopicService.updateTopicStatus(pendingAction.id, "rejected");
        alert("Từ chối chủ đề thành công!");
      }
      fetchTopics();
    } catch (error: any) {
      alert("Có lỗi xảy ra khi thực hiện thao tác!");
    } finally {
      setPendingAction(null);
    }
  }

  const handleViewTopic = (id: number) => {
    router.push(`/topic-details?id=${id}`)
  }

  // Filter topics theo người tạo nếu có chọn
  const filteredTopics = selectedCreator && selectedCreator !== "all"
    ? topics.filter(t => String(t.createdBy) === selectedCreator)
    : topics

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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 leading-relaxed">
              DUYỆT CHỦ ĐỀ
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
          <div className="relative overflow-x-auto mb-8">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden min-w-[800px]">
              <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 px-4 sm:px-8 py-4 sm:py-6">
                <div className="grid grid-cols-6 gap-2 sm:gap-4 font-bold text-blue-700 text-xs sm:text-sm">
                  <div>ID CHỦ ĐỀ</div>
                  <div>TÊN CHỦ ĐỀ</div>
                  <div>NGÀY TẠO</div>
                  <div>CHỦ ĐỀ PHỤ</div>
                  <div>TRẠNG THÁI</div>
                  <div>HÀNH ĐỘNG</div>
                </div>
              </div>
              <div className="divide-y divide-blue-100/50">
                {loading ? (
                  <div className="px-4 sm:px-8 py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-700 font-medium">Đang tải...</p>
                  </div>
                ) : (
                  filteredTopics.map((topic, index) => (
                    <div key={index} className="px-4 sm:px-8 py-4 sm:py-6 hover:bg-blue-50/30 transition-colors group">
                      <div className="grid grid-cols-6 gap-2 sm:gap-4 items-center text-xs sm:text-sm">
                        <div className="font-bold text-gray-900 truncate">{topic.id}</div>
                        <div className="text-gray-700 font-medium truncate">{topic.topicName}</div>
                        <div className="text-gray-700 font-medium">{topic.createdAt}</div>
                        <div className="text-gray-700 font-medium">{topic.sortOrder}</div>
                        <div>
                          <span className="px-2 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-bold border-2 shadow-sm bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border-orange-300">
                            ĐANG KIỂM DUYỆT
                          </span>
                        </div>
                        <div className="flex gap-1 sm:gap-3">
                          <Button onClick={() => handleViewTopic(topic.id)} className="group/btn relative p-2 sm:p-3 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-600 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 overflow-hidden" size="sm">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                          </Button>
                          <Button onClick={() => handleApprove(topic.id)} className="group/btn relative p-2 sm:p-3 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-600 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 overflow-hidden" size="sm">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleReject(topic.id)} className="group/btn relative p-2 sm:p-3 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-600 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 overflow-hidden" size="sm">
                            <XCircle className="w-4 h-4" />
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
                ? "Xác nhận duyệt chủ đề"
                : "Xác nhận từ chối chủ đề"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.type === "approve"
                ? "Bạn có chắc chắn muốn DUYỆT chủ đề này?"
                : "Bạn có chắc chắn muốn TỪ CHỐI chủ đề này?"}
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