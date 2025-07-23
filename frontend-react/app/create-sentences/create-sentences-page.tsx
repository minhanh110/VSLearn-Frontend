"use client"

import React from "react"
import type { ReactElement } from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Video, Plus, X, Search } from "lucide-react"

// Mock data for demonstration
const mockWords = [
  { word: "Tôi", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "là", topicId: "1", subtopicName: "Chủ đề con 1.1" },
  { word: "bác sĩ", topicId: "1", subtopicName: "Chủ đề con 1.2" },
  { word: "tệ", topicId: "1", subtopicName: "Chủ đề con 1.2" },
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

const mockTopics = [
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

  const handleAddWordFromGlobalSearch = (word: string) => {
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

  const filteredGlobalWords = mockWords
    .filter((item) => {
      const matchesSearchTerm = item.word.toLowerCase().includes(globalSearchTerm.toLowerCase())

      if (selectedFilter === "all") {
        return matchesSearchTerm
      }

      // Check if selectedFilter matches a major topic ID
      const majorTopic = mockTopics.find((t) => t.id === selectedFilter)
      if (majorTopic && majorTopic.id !== "all") {
        // If it's a major topic, filter by words belonging to that major topic
        return matchesSearchTerm && item.topicId === majorTopic.id
      }

      // Check if selectedFilter matches a subtopic name
      let matchesSubtopic = false
      mockTopics.forEach((topic) => {
        if (topic.subtopics.includes(selectedFilter)) {
          if (item.subtopicName === selectedFilter) {
            matchesSubtopic = true
          }
        }
      })

      return matchesSearchTerm && matchesSubtopic
    })
    .map((item) => item.word) // Map back to just the word string

  return (
    <div className="flex min-h-screen bg-blue-50 p-4">
      {/* Main content area */}
      <div className="flex flex-col lg:flex-row flex-1 p-6 gap-6">
        {/* Left Section: Video Upload & Sentence Builder */}
        <div className="flex flex-col w-full lg:w-3/5 gap-6 items-center">
          {/* Video Upload/Record Area */}
          <Card className="relative flex items-center justify-center w-[350px] h-[350px] bg-blue-100 rounded-2xl overflow-hidden border-2 border-blue-300 border-dashed p-2 mx-auto">
            {/* Decorative border elements */}
            <div className="absolute inset-0 border-4 border-pink-200 rounded-2xl z-0"></div>
            <div className="absolute inset-1 border-2 border-blue-200 rounded-xl z-0"></div>
            {/* Stars and circles */}
            <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-300 rounded-full transform rotate-45"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-yellow-300 rounded-full transform -rotate-30"></div>
            <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-yellow-300 rounded-full transform rotate-60"></div>
            <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-yellow-300 rounded-full transform -rotate-15"></div>
            <div className="absolute top-1/2 left-0 w-3 h-3 bg-blue-200 rounded-full"></div>
            <div className="absolute bottom-1/2 right-0 w-3 h-3 bg-pink-200 rounded-full"></div>
            <div className="absolute top-0 right-1/3 w-2 h-2 bg-blue-200 rounded-full"></div>
            <div className="absolute bottom-0 left-1/3 w-2 h-2 bg-pink-200 rounded-full"></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative flex flex-col items-center justify-center w-full h-full cursor-pointer z-10">
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
          </Card>

          {/* Sentence Builder Inputs */}
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
                        mockWords={mockWords.map((item) => item.word)}
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

        {/* Right Section: Global Word Search */}
        <div className="flex flex-col w-full lg:w-2/5 gap-4">
          <div className="flex items-center gap-2">
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
            {/* Combined Topic/Sub-topic Filter */}
            <Select onValueChange={setSelectedFilter} value={selectedFilter}>
              <SelectTrigger className="w-[180px] rounded-xl border-blue-200 focus:ring-blue-300">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                {mockTopics.map((topic) => (
                  <React.Fragment key={topic.id}>
                    <SelectItem value={topic.id} className="font-semibold">
                      {topic.name}
                    </SelectItem>
                    {topic.subtopics.map((sub) => (
                      <SelectItem key={sub} value={sub} className="pl-8 text-sm">
                        &nbsp;&nbsp;- {sub}
                      </SelectItem>
                    ))}
                  </React.Fragment>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Results - Display as a list */}
          <Card className="flex-1 p-4 rounded-xl border-blue-200 overflow-y-auto max-h-[calc(100vh-180px)]">
            <div className="flex flex-col">
              {filteredGlobalWords.length > 0 ? (
                filteredGlobalWords.map((word, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors text-blue-700 text-sm"
                    onClick={() => handleAddWordFromGlobalSearch(word)}
                  >
                    <span>{word}</span>
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
