"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight, Check, X, BookOpen } from "lucide-react" // Added FileText icon
import { useRouter, useSearchParams } from "next/navigation"
import { TopicService } from "@/app/services/topic.service"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface TopicDetail {
  id: number
  topicName: string
  isFree: boolean
  status: string
  sortOrder: number
  createdAt: string
  createdBy: number
  creatorName?: string
  updatedAt?: string
  updatedBy?: number
  deletedAt?: string
  deletedBy?: number
  subtopics?: Subtopic[]
}

interface Vocab {
  vocab: string
  meaning?: string
  videoLink?: string
  description?: string
}
interface Subtopic {
  id: number
  subTopicName: string
  sortOrder: number
  vocabs: Vocab[]
}

interface Sentence {
  id: string
  content: string
}

export function TopicDetailsPageComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const topicId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [topic, setTopic] = useState<TopicDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [subtopics, setSubtopics] = useState<Subtopic[]>([])
  const [activeTab, setActiveTab] = useState<"subtopics" | "sentences">("subtopics")

  // Mock sentences data for demonstration
  const [sentences, setSentences] = useState<Sentence[]>([
    { id: "s1", content: "Tôi là học sinh." },
    { id: "s2", content: "Cô ấy rất đẹp." },
    { id: "s3", content: "Chúng tôi đang học tiếng Anh." },
    { id: "s4", content: "Bạn có thích đọc sách không?" },
    { id: "s5", content: "Hà Nội là thủ đô của Việt Nam." },
    { id: "s6", content: "Màu xanh là màu yêu thích của tôi." },
    { id: "s7", content: "Hôm nay trời rất đẹp." },
    { id: "s8", content: "Tôi muốn đi du lịch vòng quanh thế giới." },
    { id: "s9", content: "Anh ấy là một bác sĩ giỏi." },
    { id: "s10", content: "Chúng ta hãy cùng nhau học tập." },
    { id: "s11", content: "Bữa tối nay có gì ngon?" },
    { id: "s12", content: "Tôi thích nghe nhạc." },
    { id: "s13", content: "Bạn có thể giúp tôi không?" },
    { id: "s14", content: "Đây là một cuốn sách thú vị." },
    { id: "s15", content: "Thời tiết hôm nay thật tuyệt vời." },
  ])

  useEffect(() => {
    if (!topicId) return

    const fetchTopicDetail = async () => {
      try {
        setLoading(true)
        const response = await TopicService.getTopicDetail(topicId)
        setTopic({ ...response.data, creatorName: "NGUYEN VAN A" })
        setSubtopics(response.data.subtopics || [])
      } catch (error: any) {
        console.error("Error fetching topic detail:", error)
        alert("Không thể tải thông tin chủ đề. Vui lòng thử lại!")
      } finally {
        setLoading(false)
      }
    }

    fetchTopicDetail()
  }, [topicId])

  const handleGoBack = () => {
    router.back()
  }

  const handleEdit = () => {
    router.push(`/topic-edit?id=${topicId}`)
  }

  const handleApprove = async () => {
    if (!topicId) return

    if (confirm("Bạn có chắc chắn muốn PHÊ DUYỆT chủ đề này?")) {
      try {
        console.log(`Approving topic with ID: ${topicId}`)
        alert("Phê duyệt chủ đề thành công!")
        router.push("/list-topics")
      } catch (error: any) {
        alert(error?.response?.data?.message || "Có lỗi xảy ra khi phê duyệt. Vui lòng thử lại!")
      }
    }
  }

  const handleReject = async () => {
    if (!topicId) return

    if (confirm("Bạn có chắc chắn muốn TỪ CHỐI chủ đề này?")) {
      try {
        console.log(`Rejecting topic with ID: ${topicId}`)
        alert("Từ chối chủ đề thành công!")
        router.push("/list-topics")
      } catch (error: any) {
        alert(error?.response?.data?.message || "Có lỗi xảy ra khi từ chối. Vui lòng thử lại!")
      }
    }
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

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium">Không tìm thấy chủ đề</div>
          <Button onClick={handleGoBack} className="mt-4">
            Quay lại
          </Button>
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
                  CHI TIẾT CHỦ ĐỀ
                </h2>
                <p className="text-gray-600 text-sm font-medium mb-2">THÔNG TIN CHỦ ĐỀ</p>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-3"></div>
              </div>

              {/* Topic Information Card */}
              <div className="mb-8">
                <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6">
                  <h3 className="text-sm font-bold text-blue-700 mb-4">THÔNG TIN CỦA TOPIC:</h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="text-sm">
                      <span className="font-semibold text-blue-600">THỨ TỰ:</span>{" "}
                      <span className="text-gray-500">#{topic.sortOrder}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-blue-600">TÊN :</span>{" "}
                      <span className="text-gray-500">{topic.topicName}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-blue-600">NGƯỜI TẠO:</span>{" "}
                      <span className="text-gray-500">{topic.creatorName || "N/A"}</span>
                    </p>
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
                    CHỦ ĐỀ PHỤ
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
                  <div className="relative">
                    <div className="max-h-[500px] p-8 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm overflow-y-auto custom-scrollbar">
                      <div className="space-y-6">
                        {subtopics.length === 0 ? (
                          <div className="text-gray-500 italic text-center py-4">Chủ đề này chưa có subtopic nào.</div>
                        ) : (
                          <Accordion type="single" collapsible className="w-full space-y-4">
                            {subtopics.map((sub, idx) => (
                              <AccordionItem
                                key={sub.id || idx}
                                value={`item-${sub.id || idx}`}
                                className="border border-blue-100 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-200 group"
                              >
                                <AccordionTrigger className="flex items-center justify-between px-6 py-4 text-blue-700 font-bold text-base hover:no-underline">
                                  <div className="flex items-center gap-3">
                                    <ChevronRight className="w-6 h-6 text-blue-600 accordion-chevron transition-transform duration-200 group-hover:translate-x-1" />
                                    <span>{sub.subTopicName}</span>
                                  </div>
                                  <span className="text-base text-gray-500">{sub.vocabs?.length || 0} từ vựng</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-5 border-t border-blue-100 bg-blue-50/70 rounded-b-2xl">
                                  {sub.vocabs && sub.vocabs.length > 0 ? (
                                    <div className="overflow-x-auto rounded-lg border border-blue-100 shadow-inner">
                                      <table className="min-w-full divide-y divide-blue-100">
                                        <thead className="bg-blue-100/80">
                                          <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">
                                              #
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">
                                              Từ vựng
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">
                                              Nghĩa
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">
                                              Video
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">
                                              Mô tả
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white/90 divide-y divide-blue-100">
                                          {sub.vocabs.map((vocab, vIdx) => (
                                            <tr
                                              key={vIdx}
                                              className="hover:bg-blue-50/50 transition-colors duration-150"
                                            >
                                              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800">
                                                {vIdx + 1}
                                              </td>
                                              <td className="px-6 py-3 whitespace-nowrap text-base font-medium text-blue-700">
                                                {vocab.vocab}
                                              </td>
                                              <td className="px-6 py-3 text-sm text-gray-600">
                                                {vocab.meaning || (
                                                  <span className="italic text-gray-400">Không có</span>
                                                )}
                                              </td>
                                              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                                                {vocab.videoLink ? (
                                                  <video
                                                    src={vocab.videoLink}
                                                    controls
                                                    width={120}
                                                    height={70}
                                                    className="rounded-md shadow-sm"
                                                  />
                                                ) : (
                                                  <span className="italic text-gray-400">Không có</span>
                                                )}
                                              </td>
                                              <td className="px-6 py-3 text-sm text-gray-600">
                                                {vocab.description || (
                                                  <span className="italic text-gray-400">Không có</span>
                                                )}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="text-gray-400 italic text-center py-4">
                                      Chưa có từ vựng nào trong subtopic này.
                                    </div>
                                  )}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        )}
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
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ArrowLeft className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">QUAY LẠI</span>
                </Button>

                <Button
                  onClick={handleApprove}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Check className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">PHÊ DUYỆT</span>
                </Button>

                <Button
                  onClick={handleReject}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <X className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">TỪ CHỐI</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default TopicDetailsPageComponent
