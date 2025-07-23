"use client";

import { useEffect, useState } from "react";
import { VocabService } from "@/app/services/vocab.service";
import { TopicService } from "@/app/services/topic.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, XCircle, Eye, BookOpen, FileText } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useRouter } from "next/navigation";

function StatusBadge({ status }: { status: string }) {
  let color = "bg-gray-200 text-gray-700";
  if (status === "pending") color = "bg-orange-100 text-orange-700 border-orange-300";
  if (status === "approved") color = "bg-green-100 text-green-700 border-green-300";
  if (status === "rejected") color = "bg-red-100 text-red-700 border-red-300";
  return (
    <span className={`px-3 py-1 rounded-xl text-xs font-bold border-2 shadow-sm ${color}`}>{status.toUpperCase()}</span>
  );
}

export default function AdminApprovalPage() {
  const { role, loading: roleLoading } = useUserRole();
  const [pendingVocabs, setPendingVocabs] = useState<any[]>([]);
  const [pendingTopics, setPendingTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"vocabs" | "topics">("vocabs");
  const router = useRouter();

  useEffect(() => {
    if (role === "general-manager") {
      fetchPendingData();
    }
  }, [role]);

  const fetchPendingData = async () => {
    setLoading(true);
    try {
      // Fetch pending vocabs
      const vocabResponse = await VocabService.getVocabList({
        page: 0,
        search: "",
        topic: undefined,
        region: undefined,
        letter: undefined,
        status: "pending"
      });
      setPendingVocabs(vocabResponse.data.vocabList || []);

      // Fetch pending topics
      const topicResponse = await TopicService.getTopicList({
        page: 0,
        search: "",
        status: "pending"
      });
      setPendingTopics(topicResponse.data.topicList || []);
    } catch (e) {
      console.error("Error fetching pending data:", e);
      setPendingVocabs([]);
      setPendingTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVocab = async (vocabId: number) => {
    try {
      await VocabService.updateVocabStatus(vocabId, "active");
      alert("Duyệt từ vựng thành công!");
      fetchPendingData();
    } catch (error) {
      alert("Có lỗi xảy ra khi duyệt từ vựng!");
    }
  };

  const handleRejectVocab = async (vocabId: number) => {
    try {
      await VocabService.updateVocabStatus(vocabId, "rejected");
      alert("Từ chối từ vựng thành công!");
      fetchPendingData();
    } catch (error) {
      alert("Có lỗi xảy ra khi từ chối từ vựng!");
    }
  };

  const handleApproveTopic = async (topicId: number) => {
    try {
      await TopicService.updateTopicStatus(topicId, "active");
      alert("Duyệt chủ đề thành công!");
      fetchPendingData();
    } catch (error) {
      alert("Có lỗi xảy ra khi duyệt chủ đề!");
    }
  };

  const handleRejectTopic = async (topicId: number) => {
    try {
      await TopicService.updateTopicStatus(topicId, "rejected");
      alert("Từ chối chủ đề thành công!");
      fetchPendingData();
    } catch (error) {
      alert("Có lỗi xảy ra khi từ chối chủ đề!");
    }
  };

  const handleViewVocab = (vocabId: number) => {
    router.push(`/vocab-detail?id=${vocabId}`);
  };

  const handleViewTopic = (topicId: number) => {
    router.push(`/topic-details?id=${topicId}`);
  };

  // Filter by search
  const filteredVocabs = pendingVocabs.filter((vocab) =>
    vocab.vocab?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTopics = pendingTopics.filter((topic) =>
    topic.topicName?.toLowerCase().includes(search.toLowerCase())
  );

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-700 font-medium">Đang kiểm tra quyền truy cập...</div>
    );
  }

  if (role !== "general-manager") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-lg px-8 py-12 text-center">
          <div className="text-3xl mb-4 text-blue-700 font-bold">🚫 Không có quyền truy cập</div>
          <div className="text-gray-600 text-lg">Chỉ tài khoản <b>Quản lý</b> mới được truy cập trang này.<br/>Vui lòng liên hệ quản trị viên nếu bạn cần quyền này.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-200/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-40 left-16 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-300/25 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-32 left-1/4 w-6 h-6 text-blue-400 animate-pulse">✨</div>
        <div className="absolute top-48 right-1/4 w-5 h-5 text-cyan-400 animate-bounce">⭐</div>
        <div className="absolute bottom-48 left-1/3 w-4 h-4 text-indigo-400 animate-pulse">💫</div>
        <div className="absolute bottom-36 right-1/3 w-6 h-6 text-blue-400 animate-bounce">✨</div>
      </div>
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-6xl mx-auto py-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-6 leading-relaxed text-center">
            Quản lý duyệt nội dung
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-8"></div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 rounded-2xl p-1 shadow-lg">
              <Button
                onClick={() => setActiveTab("vocabs")}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === "vocabs"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "bg-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Từ vựng ({pendingVocabs.length})
              </Button>
              <Button
                onClick={() => setActiveTab("topics")}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === "topics"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "bg-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Chủ đề ({pendingTopics.length})
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-8 justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={`Tìm kiếm ${activeTab === "vocabs" ? "từ vựng" : "chủ đề"}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-12 h-14 border-2 border-blue-200/60 rounded-2xl bg-white/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-blue-700 font-medium">Đang tải...</p>
            </div>
          ) : (
            <div className="bg-white/80 rounded-3xl shadow-xl border border-white/50 p-6">
              {activeTab === "vocabs" ? (
                filteredVocabs.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">Không có từ vựng chờ duyệt.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                          <th className="py-2 px-3 text-left">ID</th>
                          <th className="py-2 px-3 text-left">Từ vựng</th>
                          <th className="py-2 px-3 text-left">Chủ đề</th>
                          <th className="py-2 px-3 text-left">Ngày tạo</th>
                          <th className="py-2 px-3 text-left">Trạng thái</th>
                          <th className="py-2 px-3 text-left">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVocabs.map((vocab) => (
                          <tr key={vocab.id} className="hover:bg-blue-50/50 transition-colors">
                            <td className="py-2 px-3 font-bold">{vocab.id}</td>
                            <td className="py-2 px-3">{vocab.vocab}</td>
                            <td className="py-2 px-3">{vocab.topicName}</td>
                            <td className="py-2 px-3">{vocab.createdAt ? new Date(vocab.createdAt).toLocaleDateString() : ""}</td>
                            <td className="py-2 px-3"><StatusBadge status={vocab.status} /></td>
                            <td className="py-2 px-3">
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleViewVocab(vocab.id)} 
                                  size="sm" 
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="w-4 h-4" />
                                  Xem
                                </Button>
                                <Button 
                                  onClick={() => handleApproveVocab(vocab.id)} 
                                  size="sm" 
                                  variant="default"
                                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Duyệt
                                </Button>
                                <Button 
                                  onClick={() => handleRejectVocab(vocab.id)} 
                                  size="sm" 
                                  variant="destructive"
                                  className="flex items-center gap-1"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Từ chối
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                filteredTopics.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">Không có chủ đề chờ duyệt.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                          <th className="py-2 px-3 text-left">ID</th>
                          <th className="py-2 px-3 text-left">Tên chủ đề</th>
                          <th className="py-2 px-3 text-left">Ngày tạo</th>
                          <th className="py-2 px-3 text-left">Trạng thái</th>
                          <th className="py-2 px-3 text-left">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTopics.map((topic) => (
                          <tr key={topic.id} className="hover:bg-blue-50/50 transition-colors">
                            <td className="py-2 px-3 font-bold">{topic.id}</td>
                            <td className="py-2 px-3">{topic.topicName}</td>
                            <td className="py-2 px-3">{topic.createdAt ? new Date(topic.createdAt).toLocaleDateString() : ""}</td>
                            <td className="py-2 px-3"><StatusBadge status={topic.status} /></td>
                            <td className="py-2 px-3">
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleViewTopic(topic.id)} 
                                  size="sm" 
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="w-4 h-4" />
                                  Xem
                                </Button>
                                <Button 
                                  onClick={() => handleApproveTopic(topic.id)} 
                                  size="sm" 
                                  variant="default"
                                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Duyệt
                                </Button>
                                <Button 
                                  onClick={() => handleRejectTopic(topic.id)} 
                                  size="sm" 
                                  variant="destructive"
                                  className="flex items-center gap-1"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Từ chối
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 