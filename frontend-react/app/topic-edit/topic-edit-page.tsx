"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, BookOpen, FileText } from "lucide-react"
import { TopicService } from "@/app/services/topic.service"
import { ApprovalNotice } from "@/components/approval-notice"
import { StatusDisplay } from "@/components/status-display"
import AsyncSelect from 'react-select/async';
import { VocabService } from "@/app/services/vocab.service";

interface StatusOption {
  value: string
  label: string
  description?: string
}

export function TopicEditPageComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const topicId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    topicName: "",
    isFree: true,
    sortOrder: 0,
    subtopics: [] as any[], // Thay đổi formData: subtopics là mảng object { subTopicName, sortOrder, vocabs: [{ vocab, vocabId, meaning }] }
    status: "", // Chỉ để hiển thị trạng thái hiện tại
  })

  // Fetch status options
  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/topics/status-options");
        const data = await response.json();
        setStatusOptions(data);
      } catch (error) {
        setStatusOptions([
          { value: "active", label: "Hoạt động" },
          { value: "pending", label: "Đang kiểm duyệt" },
          { value: "rejected", label: "Bị từ chối" },
        ]);
      }
    };
    fetchStatusOptions();
  }, [])

  // Fetch topic detail
  useEffect(() => {
    const fetchTopicDetail = async () => {
      if (!topicId) return;
      try {
        setLoading(true)
        const response = await TopicService.getTopicDetail(topicId)
        const topic = response.data
        setFormData({
          topicName: topic.topicName || "",
          isFree: topic.isFree ?? true,
          sortOrder: topic.sortOrder ?? 0,
          subtopics: (topic.subtopics || []).map((sub: any) => ({
            ...sub,
            vocabs: (sub.vocabs || []).map((vocab: any) => ({
              vocab: vocab.vocab,
              meaning: vocab.meaning,
              vocabId: vocab.id,
            }))
          })),
          status: topic.status || "",
        })
      } catch (error) {
        alert("Không thể tải chi tiết chủ đề. Vui lòng thử lại!")
      } finally {
        setLoading(false)
      }
    }
    fetchTopicDetail()
  }, [topicId])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Thêm các hàm quản lý subtopic/vocab giống trang add topic
  const handleSubtopicChange = (subIdx: number, field: string, value: any) => {
    setFormData(prev => {
      const newSubtopics = [...prev.subtopics];
      newSubtopics[subIdx] = {
        ...newSubtopics[subIdx],
        [field]: value,
      };
      return { ...prev, subtopics: newSubtopics };
    });
  };
  const handleRemoveSubtopic = (subIdx: number) => {
    setFormData(prev => {
      const newSubtopics = prev.subtopics.filter((_, idx) => idx !== subIdx);
      return { ...prev, subtopics: newSubtopics };
    });
  };
  const handleAddSubtopic = () => {
    setFormData(prev => ({
      ...prev,
      subtopics: [...prev.subtopics, { subTopicName: "", sortOrder: 0, vocabs: [] }],
    }));
  };
  const handleVocabChange = (subIdx: number, vocabIdx: number, field: string, value: any) => {
    setFormData(prev => {
      const newSubtopics = [...prev.subtopics];
      newSubtopics[subIdx].vocabs[vocabIdx] = {
        ...newSubtopics[subIdx].vocabs[vocabIdx],
        [field]: value,
      };
      return { ...prev, subtopics: newSubtopics };
    });
  };
  const handleRemoveVocab = (subIdx: number, vocabIdx: number) => {
    setFormData(prev => {
      const newSubtopics = [...prev.subtopics];
      newSubtopics[subIdx].vocabs = newSubtopics[subIdx].vocabs.filter((_, idx) => idx !== vocabIdx);
      return { ...prev, subtopics: newSubtopics };
    });
  };
  const handleAddVocab = (subIdx: number) => {
    setFormData(prev => ({
      ...prev,
      subtopics: prev.subtopics.map((sub, idx) =>
        idx === subIdx ? { ...sub, vocabs: [...sub.vocabs, { vocab: "", meaning: "", vocabId: undefined }] } : sub
      ),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.topicName.trim()) {
      alert("Vui lòng nhập tên chủ đề!")
      return
    }
    // Content Creator không cần chọn status, sẽ tự động chuyển về pending
    setIsSubmitting(true)
    try {
      await TopicService.updateTopic(topicId!, {
        topicName: formData.topicName,
        isFree: formData.isFree,
        sortOrder: formData.sortOrder,
        subtopics: formData.subtopics,
      })
      alert("Cập nhật chủ đề thành công! Chủ đề đã được gửi để duyệt lại và sẽ hiển thị sau khi được phê duyệt.")
      router.push("/list-topics")
    } catch (error: any) {
      alert(error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 relative overflow-hidden">
      {/* Background */}
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
      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      {/* Main Content */}
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-10 max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-3 leading-relaxed">
                  CHỈNH SỬA CHỦ ĐỀ
                </h2>
                <p className="text-gray-600 text-sm font-medium mb-2">CẬP NHẬT THÔNG TIN CHỦ ĐỀ</p>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-3"></div>
              </div>

              {/* Approval Notice */}
              <ApprovalNotice type="edit" contentType="topic" />
              {/* Topic Name Input */}
              <div className="mb-8">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <FileText className="w-4 h-4 text-blue-500" />
                    TÊN CHỦ ĐỀ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={formData.topicName}
                      onChange={(e) => handleInputChange("topicName", e.target.value)}
                      placeholder="Nhập tên chủ đề..."
                      className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-blue-300"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
              {/* Status Display (Read-only for Content Creator) */}
              <div className="mb-8">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <FileText className="w-4 h-4 text-blue-500" />
                    TRẠNG THÁI HIỆN TẠI
                  </label>
                  <div className="relative">
                    <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-2xl bg-gray-50 flex items-center justify-center">
                      {formData.status ? (
                        <StatusDisplay status={formData.status} />
                      ) : (
                        <span className="text-gray-500">Chưa có trạng thái</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      * Trạng thái sẽ tự động chuyển về "Đang kiểm duyệt" sau khi cập nhật
                    </div>
                  </div>
                </div>
              </div>
              {/* Subtopics and Vocabs */}
              <div className="mb-8">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <FileText className="w-4 h-4 text-blue-500" />
                    CHỦ ĐỀ PHỤ
                  </label>
                  {formData.subtopics.map((sub, subIdx) => (
                    <div key={subIdx} className="bg-white/80 p-4 rounded-2xl shadow-sm border border-blue-100/50 mb-4">
                      <div className="grid grid-cols-12 gap-4 mb-2 items-end">
                        <div className="col-span-7 flex flex-col">
                          <span className="text-xs text-gray-400 mb-1">Tên chủ đề phụ</span>
                          <Input
                            type="text"
                            value={sub.subTopicName}
                            onChange={e => handleSubtopicChange(subIdx, "subTopicName", e.target.value)}
                            placeholder="Tên chủ đề phụ..."
                            className="border-blue-200 rounded-xl h-12"
                          />
                        </div>
                        <div className="col-span-3 flex flex-col">
                          <span className="text-xs text-gray-400 mb-1">Thứ tự hiển thị chủ đề phụ, số nhỏ sẽ lên trên</span>
                          <Input
                            type="number"
                            value={sub.sortOrder}
                            onChange={e => handleSubtopicChange(subIdx, "sortOrder", Number(e.target.value))}
                            placeholder="Thứ tự"
                            className="w-full border-blue-200 rounded-xl h-12 text-center"
                            min={0}
                          />
                        </div>
                        <div className="col-span-2 flex items-end justify-end">
                          <Button variant="destructive" onClick={() => handleRemoveSubtopic(subIdx)} size="sm">Xóa</Button>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="font-semibold text-blue-700 mb-2">Từ vựng</div>
                        {sub.vocabs && sub.vocabs.length > 0 && sub.vocabs.map((vocab, vocabIdx) => (
                          <div key={vocabIdx} className="flex items-center gap-3 mb-2">
                            <div className="flex-1">
                              <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={async (inputValue) => {
                                  console.log("loadOptions called with:", inputValue);
                                  if (!inputValue || inputValue.trim().length < 1) return [];
                                  const res = await VocabService.getVocabList({ status: "active", search: inputValue, size: 20 });
                                  const list = res.data.vocabList || res.data || [];
                                  console.log("API vocab list response:", list);
                                  return list
                                    .filter(v => v.vocab && v.vocab.toLowerCase().includes(inputValue.toLowerCase()))
                                    .map(v => ({
                                      value: v.id,
                                      label: v.vocab + (v.meaning ? ` - ${v.meaning}` : ""),
                                      vocab: v.vocab,
                                      meaning: v.meaning,
                                      id: v.id,
                                    }));
                                }}
                                onChange={option => {
                                  if (option) {
                                    handleVocabChange(subIdx, vocabIdx, "vocab", option.vocab);
                                    handleVocabChange(subIdx, vocabIdx, "meaning", option.meaning);
                                    handleVocabChange(subIdx, vocabIdx, "vocabId", option.id);
                                  } else {
                                    handleVocabChange(subIdx, vocabIdx, "vocab", "");
                                    handleVocabChange(subIdx, vocabIdx, "meaning", "");
                                    handleVocabChange(subIdx, vocabIdx, "vocabId", undefined);
                                  }
                                }}
                                isClearable
                                placeholder="Tìm và chọn từ vựng đã duyệt..."
                                value={vocab.vocabId ? { value: vocab.vocabId, label: vocab.vocab + (vocab.meaning ? ` - ${vocab.meaning}` : "") } : null}
                                styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
                              />
                            </div>
                            {vocab.meaning && (
                              <div className="flex-1 text-gray-700 italic text-sm pl-2">{vocab.meaning}</div>
                            )}
                            <Button variant="destructive" onClick={() => handleRemoveVocab(subIdx, vocabIdx)} size="sm">Xóa</Button>
                          </div>
                        ))}
                        <Button onClick={() => handleAddVocab(subIdx)} size="sm" className="mt-2">+ Thêm từ vựng</Button>
                      </div>
                    </div>
                  ))}
                  <Button onClick={handleAddSubtopic} className="mt-4">+ Thêm chủ đề phụ</Button>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-6 justify-center">
                <Button
                  onClick={handleGoBack}
                  disabled={isSubmitting}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ArrowLeft className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">QUAY LẠI</span>
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                      <span className="relative z-10">ĐANG LƯU...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">LƯU THAY ĐỔI</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default TopicEditPageComponent 