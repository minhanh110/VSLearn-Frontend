"use client"

import type React from "react"
import type { ReactElement } from "react"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Video, Plus, X, Search, AlertCircle, CheckCircle } from "lucide-react"
import { TopicService } from "@/app/services/topic.service"
import { VocabService } from "@/app/services/vocab.service"
import { WordService } from "@/app/services/word.service"

// Mock data for demonstration
let mockWords = [
  { word: "Tôi", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "là", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "bác sĩ", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "tệ", topicId: "1", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "giỏi", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "cô giáo", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "học sinh", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "đẹp", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "trai", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "gái", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "ăn", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "uống", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "ngủ", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "đi", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "chạy", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "nhảy", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "hát", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "đọc", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "viết", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "nghe", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "sách", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "bút", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "bảng", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "ghế", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "bàn", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "nhà", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "trường", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "bệnh viện", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "chợ", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "siêu thị", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "vui vẻ", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "buồn bã", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "hạnh phúc", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "tức giận", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "yêu", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "ghét", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "thích", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "không thích", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "Việt Nam", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "Hà Nội", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "Hồ Chí Minh", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "Đà Nẵng", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "Huế", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "Nha Trang", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "Phú Quốc", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "màu đỏ", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "màu xanh", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "màu vàng", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "màu trắng", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "màu đen", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "màu tím", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "màu cam", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "một", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "hai", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "ba", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "bốn", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "năm", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "sáu", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "bảy", topicId: "2", subtopicName: "Chủ đề con 2.1" },
  { word: "tám", topicId: "2", subtopicName: "Chủ đề con 2.2" },
  { word: "chín", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "mười", topicId: "1", subtopicName: "Chủ đề con 1.2" },
]

let mockTopics = [
  { id: "all", name: "Tất cả chủ đề", subtopics: [] },
  { id: "1", name: "Chủ đề lớn 1", subtopics: ["Chủ đề con 1.1", "Chủ đề con 1.2"] },
  { id: "2", name: "Chủ đề lớn 2", subtopics: ["Chủ đề con 2.1", "Chủ đề con 2.2"] },
]

export default function CreateSentencesPageContent(): ReactElement {
  const [sentenceWords, setSentenceWords] = useState<string[]>([]) // Start with empty array
  const [globalSearchTerm, setGlobalSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false) // Add this line
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)

  // NEW: state thay cho mock data
  const [topics, setTopics] = useState<{ id: string; name: string; subtopics: string[] }[]>([
    { id: "all", name: "Tất cả chủ đề", subtopics: [] },
  ])
  const [words, setWords] = useState<{ word: string; topicId: string; subtopicName: string }[]>([])

  // NEW: hydrate từ API
  useEffect(() => {
    const hydrateTopics = async () => {
      try {
        const res = await TopicService.getTopicList({ page: 0, size: 100, status: "active" })
        const list = res.data.topicList || res.data || []
        setTopics([
          { id: "all", name: "Tất cả chủ đề", subtopics: [] },
          ...list.map((t: any) => ({ id: String(t.id), name: t.topicName, subtopics: [] })),
        ])
      } catch {}
    }
    hydrateTopics()
  }, [])

  useEffect(() => {
    const hydrateWords = async () => {
      try {
        const params: any = { page: 0, size: 300, status: "active" }
        if (selectedFilter !== "all") {
          const t = topics.find((x) => x.id === selectedFilter)
          if (t?.name) params.topic = t.name
        }
        const [vocabRes, distractors] = await Promise.all([
          VocabService.getVocabList(params),
          WordService.getRandomWords(80),
        ])
        const list = vocabRes.data.vocabList || vocabRes.data || []
        // Merge vocab + distractors, dedupe by word (case-insensitive)
        const vocabItems = list.map((v: any) => ({
          word: v.vocab,
          topicId: selectedFilter !== "all" ? selectedFilter : String(v.topicId || v.topic?.id || ""),
          subtopicName: v.subTopicName || "",
        }))
        const distractorItems = (distractors || []).map((w: string) => ({ word: w, topicId: "distractor", subtopicName: "" }))
        const merged = [...vocabItems, ...distractorItems]
        const seen = new Set<string>()
        const dedup = merged.filter((it) => {
          const key = (it.word || "").trim().toLowerCase()
          if (!key || seen.has(key)) return false
          seen.add(key)
          return true
        })
        setWords(dedup)
      } catch {
        setWords([])
      }
    }
    hydrateWords()
  }, [selectedFilter, topics])

  const handleAddWordSlot = () => {
    setSentenceWords([...sentenceWords, ""])
  }

  const handleRemoveWordSlot = (index: number) => {
    setSentenceWords(sentenceWords.filter((_, i) => i !== index))
  }

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...sentenceWords]
    newWords[index] = value
    setSentenceWords(newWords)
  }

  const handleAddWordFromGlobalSearch = (word: string, topicId: string) => {
    // Find the first empty slot or add a new one
    const firstEmptyIndex = sentenceWords.findIndex((w) => w === "")
    if (firstEmptyIndex !== -1) {
      handleWordChange(firstEmptyIndex, word)
    } else {
      setSentenceWords([...sentenceWords, word])
    }
  }

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", "")
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newWords = [...sentenceWords]
    const draggedWord = newWords[draggedIndex]

    // Remove the dragged item
    newWords.splice(draggedIndex, 1)

    // Insert at new position
    newWords.splice(dropIndex, 0, draggedWord)

    setSentenceWords(newWords)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const filteredGlobalWords = words.filter((item) => {
    const matchesSearchTerm = item.word.toLowerCase().includes(globalSearchTerm.toLowerCase())

    if (selectedFilter === "all") {
      return matchesSearchTerm
    }

    // Filter only by major topic ID
    return matchesSearchTerm && item.topicId === selectedFilter
  })

  // Check if sentence has valid words (not empty strings)
  const hasValidWords = sentenceWords.some((word) => word.trim() !== "")
  const completeSentence = sentenceWords.filter((word) => word.trim() !== "").join(" ")

  const handleCreateSentence = () => {
    if (!hasValidWords) {
      setShowWarningModal(true)
    } else {
      setShowConfirmModal(true)
    }
  }

  const confirmCreateSentence = () => {
    // Here you would typically send the sentence to your API
    console.log("Creating sentence:", completeSentence)
    alert(`Câu đã được tạo thành công: "${completeSentence}"`)
    setShowConfirmModal(false)

    // Optionally clear the sentence after creation
    // setSentenceWords([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 relative overflow-hidden">
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

      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        {/* Main content area */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
          {/* Left Section: Video Upload & Sentence Builder */}
          <div className="flex flex-col w-full lg:w-2/3 gap-6 items-center">
            {/* Video Upload/Record Area */}
            <Card className="relative w-full max-w-[600px] h-[400px] rounded-2xl shadow-xl overflow-hidden">
              {/* Gradient background for the border */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{ background: "linear-gradient(to bottom right, #ADD8E6, #FFC0CB)" }}
              ></div>

              {/* Inner content area with light grey background */}
              <div className="absolute inset-[2px] bg-gray-100 rounded-2xl flex items-center justify-center">
                {/* Stars - positioned relative to the Card, but visually on the inner grey area */}
                <div className="absolute top-2 left-2 text-yellow-400 text-2xl">⭐</div>
                <div className="absolute top-2 right-2 text-yellow-400 text-2xl">⭐</div>
                <div className="absolute bottom-2 left-2 text-yellow-400 text-2xl">⭐</div>
                <div className="absolute bottom-2 right-2 text-yellow-400 text-2xl">⭐</div>

                {/* DropdownMenuTrigger and its content */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="relative flex flex-col items-center justify-center w-full h-full cursor-pointer z-10">
                      {/* Original content for upload/record */}
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center">
                          <Upload className="w-10 h-10 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-700 mb-1">Tải video lên</p>
                          <p className="text-sm text-gray-500">hoặc quay video mới</p>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      <span>Tải video lên</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Video className="mr-2 h-4 w-4" />
                      <span>Quay video mới</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>

            {/* Sentence Builder Inputs */}
            <div className="w-full p-6 rounded-xl border-0 shadow-lg bg-transparent backdrop-blur-sm">
              <div className="flex flex-wrap gap-3 items-center justify-center w-full min-h-[60px]">
                {sentenceWords.length === 0 ? (
                  // Show only plus button when no words exist
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddWordSlot}
                    className="rounded-full w-12 h-12 border-blue-400 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors bg-white shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-6 h-6" />
                  </Button>
                ) : (
                  // Show word chips and plus button when words exist
                  <>
                    {sentenceWords.map((word, index) => {
                      const isDragging = draggedIndex === index
                      const isDragOver = dragOverIndex === index

                      return (
                        <div
                          key={index}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`transition-all duration-200 cursor-move ${
                            isDragging ? "opacity-50 scale-95 bg-blue-100/50" : "hover:bg-blue-50/30"
                          } ${isDragOver ? "bg-blue-100/70 border-t-2 border-blue-400" : ""}`}
                        >
                          <WordInputChip
                            word={word}
                            onWordChange={(value) => handleWordChange(index, value)}
                            onRemove={() => handleRemoveWordSlot(index)}
                            mockWords={words.map((item) => item.word)}
                            isDragging={isDragging}
                          />
                        </div>
                      )
                    })}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleAddWordSlot}
                      className="rounded-full w-10 h-10 border-blue-400 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors bg-transparent"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Create Sentence Button - Always visible with simple styling */}
            <div className="w-full flex justify-center mt-4">
              <Button
                onClick={handleCreateSentence}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Tạo câu
              </Button>
            </div>
          </div>

          {/* Right Section: Global Word Search */}
          <div className="flex flex-col w-full lg:w-1/3 gap-4">
            <Card className="p-4 rounded-xl border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search"
                    value={globalSearchTerm}
                    onChange={(e) => setGlobalSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl border-blue-200 focus-visible:ring-blue-300"
                  />
                </div>
                {/* Topic Filter */}
                <Select onValueChange={setSelectedFilter} value={selectedFilter}>
                  <SelectTrigger className="w-[180px] rounded-xl border-blue-200 focus:ring-blue-300">
                    <SelectValue placeholder="Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id} className="font-semibold">
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Results - Display as a list */}
              <div className="flex flex-col overflow-y-auto max-h-[calc(100vh-180px)]">
                {filteredGlobalWords.length > 0 ? (
                  filteredGlobalWords.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors text-blue-700 text-sm"
                      onClick={() => handleAddWordFromGlobalSearch(item.word, item.topicId)}
                    >
                      <span>{item.word}</span>
                      <span className="text-gray-600 text-sm">
                        {topics.find((t) => t.id === item.topicId)?.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Không tìm thấy từ nào</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Warning Modal - No words selected */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Chưa chọn từ vựng</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Bạn chưa chọn từ vựng để hoàn thành câu. Vui lòng thêm ít nhất một từ vào câu trước khi tạo.
              </p>
              <Button
                onClick={() => setShowWarningModal(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Đã hiểu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Xác nhận tạo câu</h3>
              <p className="text-gray-600 mb-2">Bạn có chắc chắn muốn tạo câu với các từ đã chọn không?</p>
              <div className="bg-blue-50 rounded-lg p-3 mb-6">
                <p className="text-blue-800 font-medium">"{completeSentence}"</p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                >
                  Hủy
                </Button>
                <Button
                  onClick={confirmCreateSentence}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}
interface WordInputChipProps {
  word: string
  onWordChange: (value: string) => void
  onRemove: () => void
  mockWords: string[]
  isDragging: boolean
}

function WordInputChip({ word, onWordChange, onRemove, mockWords, isDragging }: WordInputChipProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localSearchTerm, setLocalSearchTerm] = useState(word)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  useEffect(() => {
    setLocalSearchTerm(word)
  }, [word])

  const filteredLocalWords = localSearchTerm
    ? mockWords.filter((w) => w.toLowerCase().includes(localSearchTerm.toLowerCase()))
    : []

  const handleSelectSuggestion = (selectedWord: string) => {
    onWordChange(selectedWord)
    setIsEditing(false)
  }

  const handleInputBlur = () => {
    if (localSearchTerm.trim() !== "") {
      onWordChange(localSearchTerm.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && localSearchTerm.trim() !== "") {
      onWordChange(localSearchTerm.trim())
      setIsEditing(false)
    }
  }

  return (
    <div className="relative">
      {isEditing ? (
        <div className="flex items-center gap-1">
          <Input
            ref={inputRef}
            type="text"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder="Nhập từ"
            className="w-32 rounded-xl border-blue-400 focus-visible:ring-blue-300"
          />
          {localSearchTerm && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setLocalSearchTerm("")
                inputRef.current?.focus()
              }}
              className="rounded-full w-6 h-6 text-gray-500 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 z-10"
          >
            <X className="w-3 h-3" />
          </Button>
          {filteredLocalWords.length > 0 && localSearchTerm && (
            <Card className="absolute top-full left-0 mt-1 w-full bg-white shadow-lg rounded-lg z-20 max-h-40 overflow-y-auto">
              {filteredLocalWords.map((sugg, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-sm hover:bg-blue-50"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelectSuggestion(sugg)}
                >
                  {sugg}
                </Button>
              ))}
            </Card>
          )}
        </div>
      ) : (
        <Badge
          variant="outline"
          className={`relative bg-white text-blue-600 border-blue-400 px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-2 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onClick={() => setIsEditing(true)}
        >
          {word || "Nhập từ"}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      )}
    </div>
  )
}

