"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, BookOpen, FileText, ChevronRight, Plus } from "lucide-react"
import { TopicService } from "@/app/services/topic.service"
import { ApprovalNotice } from "@/components/approval-notice"
import AsyncSelect from "react-select/async"
import { VocabService } from "@/app/services/vocab.service"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useUserRole } from "@/hooks/use-user-role"
import authService from "@/app/services/auth.service"
import { FlashcardService } from "@/app/services/flashcard.service"

interface StatusOption {
  value: string
  label: string
  description?: string
}

interface Vocab {
  vocab: string
  meaning?: string
  vocabId?: number
  videoLink?: string
  description?: string
}

interface Subtopic {
  id?: number
  subTopicName: string
  sortOrder: number
  vocabs: Vocab[]
}

interface TopicDetail {
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
  subtopics?: Subtopic[]
}

interface Sentence { id: string; content: string }

export function TopicEditPageComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const topicId = searchParams.get("id")
  const { role, loading: roleLoading } = useUserRole()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"subtopics" | "sentences">("subtopics")
  const [topic, setTopic] = useState<TopicDetail | null>(null)
  const [sentences, setSentences] = useState<Sentence[]>([])

  // Form state
  const [formData, setFormData] = useState({
    topicName: "",
    isFree: true,
    sortOrder: 0,
    subtopics: [] as Subtopic[],
    status: "",
    creatorName: "",
  })

  // Kiểm tra quyền truy cập
  useEffect(() => {
    if (!roleLoading) {
      if (role !== 'content-creator' && role !== 'content-approver' && role !== 'general-manager') {
        router.push('/homepage')
        return
      }
    }
  }, [role, roleLoading, router])

  // Fetch status options
  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/topics/status-options")
        const data = await response.json()
        setStatusOptions(data)
      } catch (error) {
        setStatusOptions([
          { value: "active", label: "Hoạt động" },
          { value: "pending", label: "Đang kiểm duyệt" },
          { value: "rejected", label: "Bị từ chối" },
        ])
      }
    }
    fetchStatusOptions()
  }, [])

  // Fetch topic detail
  useEffect(() => {
    const fetchTopicDetail = async () => {
      if (!topicId) return
      try {
        setLoading(true)
        const response = await TopicService.getTopicDetail(topicId)
        const topicData = response.data
        setTopic(topicData)
        
        // Kiểm tra ownership - content creator chỉ có thể chỉnh sửa topic mình tạo
        if (role === 'content-creator') {
          const currentUserId = authService.getCurrentUserId()
          if (currentUserId && topicData.createdBy !== currentUserId) {
            alert("Bạn chỉ có thể chỉnh sửa chủ đề mình tạo!")
            router.push("/list-topics")
            return
          }
        }
        
        setFormData({
          topicName: topicData.topicName || "",
          isFree: topicData.isFree ?? true,
          sortOrder: topicData.sortOrder ?? 0,
          subtopics: (topicData.subtopics || []).map((sub: any) => ({
            ...sub,
            vocabs: (sub.vocabs || []).map((vocab: any) => ({
              vocab: vocab.vocab,
              meaning: vocab.meaning,
              vocabId: vocab.id,
              videoLink: vocab.videoLink,
              description: vocab.description,
            })),
          })),
          status: topicData.status || "",
          creatorName: topicData.creatorName || "",
        })
      } catch (error: any) {
        console.error("Error fetching topic detail:", error)
        alert("Không thể tải thông tin chủ đề. Vui lòng thử lại!")
        router.push("/list-topics")
      } finally {
        setLoading(false)
      }
    }

    if (role === 'content-creator' || role === 'content-approver' || role === 'general-manager') {
      fetchTopicDetail()
    }
  }, [topicId, role])

  // Fetch sentences (sentence-building) for topic
  useEffect(() => {
    const fetchSentences = async () => {
      if (!topicId) return
      try {
        const qs = await FlashcardService.getSentenceBuildingQuestionsForTopic(Number(topicId))
        const mapped: Sentence[] = (qs || []).map((q, idx) => ({
          id: String(q.id ?? idx),
          content: (q.correctSentence && q.correctSentence.length > 0) ? q.correctSentence.join(" ") : (q.correctAnswer || q.question || "")
        }))
        setSentences(mapped)
      } catch {}
    }
    fetchSentences()
  }, [topicId])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubtopicChange = (subIdx: number, field: string, value: any) => {
    setFormData((prev) => {
      const newSubtopics = [...prev.subtopics]
      newSubtopics[subIdx] = {
        ...newSubtopics[subIdx],
        [field]: value,
      }
      return { ...prev, subtopics: newSubtopics }
    })
  }

  const handleRemoveSubtopic = (subIdx: number) => {
    setFormData((prev) => {
      const newSubtopics = prev.subtopics.filter((_, idx) => idx !== subIdx)
      return { ...prev, subtopics: newSubtopics }
    })
  }

  const handleAddSubtopic = () => {
    setFormData((prev) => ({
      ...prev,
      subtopics: [...prev.subtopics, { subTopicName: "", sortOrder: 0, vocabs: [] }],
    }))
  }

  const handleVocabChange = (subIdx: number, vocabIdx: number, field: string, value: any) => {
    setFormData((prev) => {
      const newSubtopics = [...prev.subtopics]
      newSubtopics[subIdx].vocabs[vocabIdx] = {
        ...newSubtopics[subIdx].vocabs[vocabIdx],
        [field]: value,
      }
      return { ...prev, subtopics: newSubtopics }
    })
  }

  const handleRemoveVocab = (subIdx: number, vocabIdx: number) => {
    setFormData((prev) => {
      const newSubtopics = [...prev.subtopics]
      newSubtopics[subIdx].vocabs = newSubtopics[subIdx].vocabs.filter((_, idx) => idx !== vocabIdx)
      return { ...prev, subtopics: newSubtopics }
    })
  }

  const handleAddVocab = (subIdx: number) => {
    setFormData((prev) => ({
      ...prev,
      subtopics: prev.subtopics.map((sub, idx) =>
        idx === subIdx ? { ...sub, vocabs: [...sub.vocabs, { vocab: "", meaning: "", vocabId: undefined }] } : sub,
      ),
    }))
  }

  const handleSubmit = async () => {
    if (!formData.topicName.trim()) {
      alert("Vui lòng nhập tên chủ đề!")
      return
    }

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Đang tải...</p>
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
        <div className="absolute top-48 right-1/4 w-5 h-5 text-cyan-400 animate-bounce">��</div>
        <div className="absolute bottom-48 left-1/3 w-4 h-4 text-indigo-400 animate-pulse">💫</div>
        <div className="absolute bottom-36 right-1/3 w-6 h-6 text-blue-400 animate-bounce">✨</div>
      </div>

      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Glow effect behind form */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>

            <div className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-10 max-w-4xl mx-auto">
              {/* Form Header with icon */}
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

              {/* Sort Order Input */}
              <div className="mb-8">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <FileText className="w-4 h-4 text-blue-500" />
                    THỨ TỰ CHỦ ĐỀ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => handleInputChange("sortOrder", Number(e.target.value))}
                      placeholder="Nhập thứ tự chủ đề..."
                      className="w-full h-14 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md group-hover:border-blue-300"
                      min={0}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">* Số nhỏ hơn sẽ hiển thị trước</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-8">
                <div className="flex gap-2">
                  <Button
                    onClick={() => setActiveTab("subtopics")}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                      activeTab === "subtopics"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "bg-white/60 text-gray-600 hover:bg-white/80"
                    }`}
                  >
                    CHỦ ĐỀ CON
                  </Button>
                  <Button
                    onClick={() => setActiveTab("sentences")}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                      activeTab === "sentences"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "bg-white/60 text-gray-600 hover:bg-white/80"
                    }`}
                  >
                    CÂU ĐÃ TẠO
                  </Button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="mb-8">
                {activeTab === "subtopics" && (
                  <div className="group">
                    <div className="relative">
                      <div className="max-h-[500px] p-8 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm overflow-y-auto custom-scrollbar">
                        <div className="space-y-6">
                          {formData.subtopics.length === 0 ? (
                            <div className="text-gray-500 italic text-center py-4">Chưa có chủ đề con nào.</div>
                          ) : (
                            <Accordion type="single" collapsible className="w-full space-y-4">
                              {formData.subtopics.map((sub, subIdx) => (
                                <AccordionItem
                                  key={subIdx}
                                  value={`item-${subIdx}`}
                                  className="border border-blue-100 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-200 group"
                                >
                                  <AccordionTrigger className="flex items-center justify-between px-6 py-4 text-blue-700 font-bold text-base hover:no-underline">
                                    <div className="flex items-center gap-3 flex-1">
                                      <ChevronRight className="w-6 h-6 text-blue-600 accordion-chevron transition-transform duration-200 group-hover:translate-x-1" />
                                      <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-8">
                                          <Input
                                            type="text"
                                            value={sub.subTopicName}
                                            onChange={(e) => {
                                              e.stopPropagation()
                                              handleSubtopicChange(subIdx, "subTopicName", e.target.value)
                                            }}
                                            placeholder="Tên chủ đề con..."
                                            className="border-blue-200 rounded-xl h-10 text-sm"
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                        <div className="col-span-2">
                                          <Input
                                            type="number"
                                            value={sub.sortOrder}
                                            onChange={(e) => {
                                              e.stopPropagation()
                                              handleSubtopicChange(subIdx, "sortOrder", Number(e.target.value))
                                            }}
                                            placeholder="Thứ tự"
                                            className="border-blue-200 rounded-xl h-10 text-center text-sm"
                                            min={0}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                        <div className="col-span-2">
                                          <Button
                                            variant="destructive"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleRemoveSubtopic(subIdx)
                                            }}
                                            size="sm"
                                          >
                                            Xóa
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                    <span className="text-base text-gray-500 ml-4">
                                      {sub.vocabs?.length || 0} từ vựng
                                    </span>
                                  </AccordionTrigger>
                                  <AccordionContent className="p-5 border-t border-blue-100 bg-blue-50/70 rounded-b-2xl">
                                    {sub.vocabs && sub.vocabs.length > 0 ? (
                                      <div className="space-y-4">
                                        <div className="space-y-3">
                                          {sub.vocabs.map((vocab, vocabIdx) => (
                                            <div
                                              key={vocabIdx}
                                              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                              <div className="flex-1">
                                                <AsyncSelect
                                                  cacheOptions
                                                  defaultOptions
                                                  loadOptions={async (inputValue) => {
                                                    if (!inputValue || inputValue.trim().length < 1) return []
                                                    const res = await VocabService.getVocabList({
                                                      status: "active",
                                                      search: inputValue,
                                                      size: 20,
                                                    })
                                                    const list = res.data.vocabList || res.data || []
                                                    return list
                                                      .filter(
                                                        (v) =>
                                                          v.vocab &&
                                                          v.vocab.toLowerCase().includes(inputValue.toLowerCase()),
                                                      )
                                                      .map((v) => ({
                                                        value: v.id,
                                                        label: v.vocab + (v.meaning ? ` - ${v.meaning}` : ""),
                                                        vocab: v.vocab,
                                                        meaning: v.meaning,
                                                        id: v.id,
                                                      }))
                                                  }}
                                                  onChange={(option) => {
                                                    if (option) {
                                                      handleVocabChange(subIdx, vocabIdx, "vocab", option.vocab)
                                                      handleVocabChange(subIdx, vocabIdx, "meaning", option.meaning)
                                                      handleVocabChange(subIdx, vocabIdx, "vocabId", option.id)
                                                    } else {
                                                      handleVocabChange(subIdx, vocabIdx, "vocab", "")
                                                      handleVocabChange(subIdx, vocabIdx, "meaning", "")
                                                      handleVocabChange(subIdx, vocabIdx, "vocabId", undefined)
                                                    }
                                                  }}
                                                  isClearable
                                                  placeholder="Tìm từ vựng..."
                                                  value={
                                                    vocab.vocabId
                                                      ? {
                                                          value: vocab.vocabId,
                                                          label:
                                                            vocab.vocab + (vocab.meaning ? ` - ${vocab.meaning}` : ""),
                                                        }
                                                      : null
                                                  }
                                                  styles={{
                                                    menu: (base) => ({ ...base, zIndex: 9999 }),
                                                    control: (base) => ({ ...base, minHeight: "40px" }),
                                                  }}
                                                />
                                              </div>
                                              <Button
                                                variant="outline"
                                                onClick={() => handleRemoveVocab(subIdx, vocabIdx)}
                                                size="sm"
                                                className="text-red-600 hover:bg-red-50 border-red-200 px-3 py-2 rounded-md flex-shrink-0"
                                              >
                                                Xóa
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                        <Button
                                          variant="outline"
                                          onClick={() => handleAddVocab(subIdx)}
                                          className="mt-4 text-blue-600 hover:bg-blue-50 border-blue-200 px-4 py-2 rounded-xl w-full sm:w-auto"
                                        >
                                          <Plus className="w-4 h-4 mr-2" />
                                          Thêm từ vựng
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="text-center py-4">
                                        <div className="text-gray-400 italic mb-4">
                                          Chưa có từ vựng nào trong chủ đề con này.
                                        </div>
                                        <Button
                                          variant="outline"
                                          onClick={() => handleAddVocab(subIdx)}
                                          className="text-blue-600 hover:bg-blue-50 border-blue-200 px-4 py-2 rounded-xl"
                                        >
                                          <Plus className="w-4 h-4 mr-2" />
                                          Thêm từ vựng đầu tiên
                                        </Button>
                                      </div>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          )}

                          <div className="text-center pt-4">
                            <Button
                              onClick={handleAddSubtopic}
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              + Thêm chủ đề con
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "sentences" && (
                  <div className="relative">
                    <div className="max-h-[500px] p-8 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm overflow-y-auto custom-scrollbar">
                      <div className="space-y-6">
                        {sentences.length === 0 ? (
                          <div className="text-gray-500 italic text-center py-4">Chưa có câu nào được tạo.</div>
                        ) : (
                          <div className="space-y-4">
                            {sentences.map((sentence, idx) => (
                              <div
                                key={sentence.id}
                                className="flex items-center gap-4 p-5 border border-blue-100 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
                              >
                                <span className="font-bold text-blue-700 text-lg">{idx + 1}.</span>
                                <p className="flex-1 text-gray-800 text-base">{sentence.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-6 mt-10 justify-center">
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

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #06b6d4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #0891b2);
        }
        .accordion-chevron {
          transition: transform 0.2s ease-in-out;
        }
        [data-state="open"] .accordion-chevron {
          transform: rotate(90deg);
        }
      `}</style>
    </div>
  )
}

export default TopicEditPageComponent

