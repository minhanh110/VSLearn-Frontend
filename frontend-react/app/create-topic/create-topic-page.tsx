"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Plus, ArrowLeft, BookOpen, FileText, Minus } from "lucide-react"
import { TopicService } from "@/app/services/topic.service"
import { ApprovalNotice } from "@/components/approval-notice"
import { VocabService } from "@/app/services/vocab.service"
import AsyncSelect from "react-select/async"

interface Vocab {
  id: string
  vocab: string
  meaning: string
  vocabId?: string
}

interface Subtopic {
  subTopicName: string
  sortOrder: number
  vocabs: Vocab[]
}

interface FormData {
  topicName: string
  sortOrder: number
  isFree: boolean
  subtopics: Subtopic[]
}

export function CreateTopicPageComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<"subtopics" | "create-sentence">("subtopics")

  // Form state with proper typing
  const [formData, setFormData] = useState<FormData>({
    topicName: "",
    sortOrder: 0,
    isFree: true,
    subtopics: [],
  })

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddSubtopic = () => {
    setFormData((prev) => ({
      ...prev,
      subtopics: [...prev.subtopics, { subTopicName: "", sortOrder: 0, vocabs: [] }],
    }))
  }

  const handleRemoveSubtopic = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      subtopics: prev.subtopics.filter((_, i) => i !== idx),
    }))
  }

  const handleSubtopicChange = (idx: number, field: keyof Subtopic, value: any) => {
    setFormData((prev) => {
      const subtopics = [...prev.subtopics]
      subtopics[idx] = { ...subtopics[idx], [field]: value }
      return { ...prev, subtopics }
    })
  }

  const handleAddVocab = (subIdx: number) => {
    setFormData((prev) => {
      const subtopics = [...prev.subtopics]
      subtopics[subIdx].vocabs = [
        ...(subtopics[subIdx].vocabs || []),
        { id: crypto.randomUUID(), vocab: "", meaning: "", vocabId: undefined },
      ]
      return { ...prev, subtopics }
    })
  }

  const handleRemoveVocab = (subIdx: number, vocabIdToRemove: string) => {
    setFormData((prev) => {
      const subtopics = [...prev.subtopics]
      subtopics[subIdx].vocabs = subtopics[subIdx].vocabs.filter((vocab) => vocab.id !== vocabIdToRemove)
      return { ...prev, subtopics }
    })
  }

  const handleVocabChange = (subIdx: number, vocabIdx: number, field: keyof Vocab, value: any) => {
    setFormData((prev) => {
      const subtopics = [...prev.subtopics]
      const vocabs = [...(subtopics[subIdx].vocabs || [])]
      vocabs[vocabIdx] = { ...vocabs[vocabIdx], [field]: value }
      subtopics[subIdx].vocabs = vocabs
      return { ...prev, subtopics }
    })
  }

  const handleSortOrderChange = (subIdx: number, increment: boolean) => {
    const currentValue = formData.subtopics[subIdx].sortOrder
    const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1)
    handleSubtopicChange(subIdx, "sortOrder", newValue)
  }

  const loadVocabOptions = async (inputValue: string) => {
    if (!inputValue || inputValue.trim().length < 1) return []

    try {
      const res = await VocabService.getVocabList({
        status: "active",
        search: inputValue,
        size: 20,
      })
      const list = res.data.vocabList || res.data || []

      return list
        .filter((v: any) => v.meaning && v.meaning.toLowerCase().includes(inputValue.toLowerCase()))
        .map((v: any) => ({
          value: v.id,
          label: v.meaning, // Show meaning as label
          vocab: v.vocab,
          meaning: v.meaning,
          id: v.id,
        }))
    } catch (error) {
      console.error("Error loading vocab options:", error)
      return []
    }
  }

  const handleSubmit = async () => {
    if (!formData.topicName.trim()) {
      alert("Vui lòng nhập tên chủ đề!")
      return
    }

    // Validate subtopics
    const hasEmptySubtopics = formData.subtopics.some((sub) => !sub.subTopicName.trim())
    if (hasEmptySubtopics) {
      alert("Vui lòng nhập tên cho tất cả chủ đề con!")
      return
    }

    setIsSubmitting(true)
    try {
      await TopicService.createTopic(formData)
      alert("Thêm chủ đề thành công! Chủ đề đã được gửi để duyệt và sẽ hiển thị sau khi được phê duyệt.")
      setFormData({ topicName: "", isFree: true, sortOrder: 0, subtopics: [] }) // Reset sentences
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
        <div className="max-w-5xl mx-auto">
          {/* Form Container with enhanced design */}
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
                  THÊM CHỦ ĐỀ
                </h2>
                <p className="text-gray-600 text-sm font-medium mb-2">CHI TIẾT CHỦ ĐỀ</p>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-3"></div>
              </div>

              {/* Approval Notice */}
              <ApprovalNotice type="create" contentType="topic" />

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
                    onClick={() => setActiveTab("create-sentence")}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                      activeTab === "create-sentence"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "bg-white/60 text-gray-600 hover:bg-white/80"
                    }`}
                  >
                    TẠO CÂU
                  </Button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="mb-8">
                {activeTab === "subtopics" && (
                  <div className="relative">
                    <div className="max-h-[500px] p-8 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm overflow-y-auto">
                      <div className="space-y-6">
                        {formData.subtopics.map((sub, subIdx) => (
                          <div
                            key={subIdx}
                            className="bg-white rounded-2xl p-6 shadow-md border border-blue-100 hover:shadow-lg transition-shadow duration-200"
                          >
                            {/* Subtopic Header */}
                            <div className="grid grid-cols-12 gap-4 mb-6 items-center">
                              <div className="col-span-7">
                                <label className="text-sm font-bold text-gray-700 mb-2 block">
                                  Tên chủ đề con <span className="text-red-500">*</span>
                                </label>
                                <Input
                                  type="text"
                                  value={sub.subTopicName}
                                  onChange={(e) => handleSubtopicChange(subIdx, "subTopicName", e.target.value)}
                                  placeholder="Nhập tên chủ đề con..."
                                  className="border-blue-200 rounded-xl h-12 focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50"
                                />
                              </div>
                              <div className="col-span-3">
                                <label className="text-sm font-bold text-gray-700 mb-2 block">Thứ tự hiển thị</label>
                                <div className="flex items-center border border-blue-200 rounded-xl h-12 overflow-hidden bg-white">
                                  <Input
                                    type="number"
                                    value={sub.sortOrder}
                                    onChange={(e) => handleSubtopicChange(subIdx, "sortOrder", Number(e.target.value))}
                                    className="flex-1 h-full text-center border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    min={0}
                                  />
                                  <div className="flex flex-col h-full border-l border-blue-200">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleSortOrderChange(subIdx, true)}
                                      className="h-6 w-8 p-0 text-blue-600 hover:bg-blue-50 rounded-none"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleSortOrderChange(subIdx, false)}
                                      className="h-6 w-8 p-0 text-red-600 hover:bg-red-50 rounded-none"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-2 flex justify-end">
                                <Button
                                  variant="destructive"
                                  onClick={() => handleRemoveSubtopic(subIdx)}
                                  size="sm"
                                  className="px-4 py-2 rounded-xl"
                                >
                                  Xóa
                                </Button>
                              </div>
                            </div>

                            {/* Vocab Section */}
                            <div className="border-t border-blue-100 pt-4">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-blue-700">Từ vựng</h4>
                                <span className="text-sm text-gray-500">{sub.vocabs?.length || 0} từ vựng</span>
                              </div>

                              <div className="space-y-3">
                                {sub.vocabs?.map((vocab, vocabIdx) => (
                                  <div
                                    key={vocab.id}
                                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200"
                                  >
                                    <div className="flex-1">
                                      <AsyncSelect
                                        cacheOptions
                                        defaultOptions={false}
                                        loadOptions={loadVocabOptions}
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
                                        placeholder="Tìm kiếm từ vựng đã được duyệt..."
                                        value={
                                          vocab.vocabId && vocab.meaning
                                            ? {
                                                value: vocab.vocabId,
                                                label: vocab.meaning,
                                              }
                                            : null
                                        }
                                        styles={{
                                          menu: (base) => ({ ...base, zIndex: 9999 }),
                                          control: (base) => ({ ...base, minHeight: "40px" }),
                                        }}
                                        noOptionsMessage={() => "Không tìm thấy từ vựng"}
                                      />
                                    </div>
                                    <Button
                                      variant="outline"
                                      onClick={() => handleRemoveVocab(subIdx, vocab.id)}
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
                          </div>
                        ))}
                      </div>

                      {/* Add Subtopic Button */}
                      <div className="flex justify-center mt-8">
                        <Button
                          onClick={handleAddSubtopic}
                          className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <Plus className="w-5 h-5 relative z-10" />
                          <span className="relative z-10">THÊM CHỦ ĐỀ CON</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "create-sentence" && (
                  <div className="relative">
                    <div className="max-h-[500px] p-8 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm overflow-y-auto flex flex-col items-center justify-center">
                      <div className="text-center">
                        <Button
                          onClick={() => router.push("/create-sentences")}
                          className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <Plus className="w-5 h-5 relative z-10" />
                          <span className="relative z-10">THÊM CÂU</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
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
                  disabled={isSubmitting || !formData.topicName.trim()}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                      <span className="relative z-10">ĐANG THÊM...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">THÊM CHỦ ĐỀ</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Required fields note */}
              <div className="text-center mt-6">
                <p className="text-xs text-gray-500 font-medium">
                  <span className="text-red-500">*</span> Các trường bắt buộc
                </p>
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

export default CreateTopicPageComponent
