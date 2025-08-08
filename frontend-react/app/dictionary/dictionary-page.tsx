"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { VocabService } from "@/app/services/vocab.service"

interface VocabularyItem {
  id: number
  vocab: string
  topicName: string
  subTopicName: string
  region?: string
  meaning?: string
  status: string
  createdAt: string
  videoLink?: string
  thumbnailUrl?: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

export function DictionaryPageComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedLetter, setSelectedLetter] = useState("TẤT CẢ")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [vocabularyData, setVocabularyData] = useState<VocabularyItem[]>([])
  const [topics, setTopics] = useState<{ value: string; label: string }[]>([])
  const [regions, setRegions] = useState<{ value: string; label: string }[]>([])
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 12, // Giảm xuống 12 items per page
    hasNext: false,
    hasPrevious: false,
  })

  // Alphabet buttons (keeping the existing letters as requested)
  const alphabet = [
    "TẤT CẢ",
    "A",
    "B",
    "C",
    "D",
    "E",
    "G",
    "H",
    "I",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "X",
    "Y",
  ]

  // Fetch topics and regions on mount
  useEffect(() => {
    // Fetch topics
    fetch("/vocab/topics")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTopics(data.map((t: any) => ({ value: t.id?.toString() || t.value, label: t.name || t.label, id: t.id })))
        }
      })
      .catch(() => setTopics([]))

    // Fetch regions
    fetch("/vocab/regions")
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 Regions data from API:", data)
        if (Array.isArray(data)) {
          const mappedRegions = data.map((r: any) => ({ value: r.value || r.id, label: r.label || r.name }))
          console.log("🔍 Mapped regions:", mappedRegions)
          setRegions(mappedRegions)
        }
      })
      .catch(() => setRegions([]))
  }, [])

  // Debounced search
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (value: string) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          setSearchTerm(value)
          setCurrentPage(1) // Reset to first page when searching
        }, 500)
      }
    })(),
    [],
  )

  // Fetch vocabulary data
  useEffect(() => {
    const fetchVocabularyData = async () => {
      try {
        setLoading(true)

        // Prepare API parameters
        const params: any = {
          page: currentPage - 1, // Backend uses 0-based indexing
          size: 12, // Giảm xuống 12 vocab per page
        }

        // Add search term if not empty
        if (searchTerm.trim()) {
          params.search = searchTerm.trim()
        }

        // Add topic filter if selected - send topic name, not ID
        if (selectedTopic && selectedTopic !== "") {
          // Find topic name from topics array
          const selectedTopicObj = topics.find((t) => t.value === selectedTopic)
          if (selectedTopicObj) {
            params.topic = selectedTopicObj.label
          }
        }

        // Add region filter if selected - send region name, not ID
        if (selectedRegion && selectedRegion !== "") {
          // Find region name from regions array
          const selectedRegionObj = regions.find((r) => r.value === selectedRegion)
          console.log("🔍 Selected region value:", selectedRegion)
          console.log("🔍 Found region object:", selectedRegionObj)
          if (selectedRegionObj) {
            params.region = selectedRegionObj.label
            console.log("🔍 Sending region to API:", selectedRegionObj.label)
          }
        }

        // Add letter filter if selected
        if (selectedLetter !== "TẤT CẢ") {
          params.letter = selectedLetter
        }

        // Hiển thị vocab có status pending (vì chưa có active)
        params.status = "pending"

        console.log("API params:", params)

        const response = await VocabService.getVocabList(params)
        console.log("API response:", response.data)
        console.log("🔍 Response vocabList:", response.data.vocabList)
        console.log("🔍 Response data:", response.data)

        const filteredData = response.data.vocabList || response.data || []
        console.log("🔍 Filtered data:", filteredData)
        console.log("🔍 Data length:", filteredData.length)

        // Debug: Log status và video URL của từng vocab
        if (filteredData.length > 0) {
          console.log("🔍 First vocab status:", filteredData[0].status)
          console.log("🔍 First vocab videoLink:", filteredData[0].videoLink)
          console.log(
            "🔍 All vocab data:",
            filteredData.map((v) => ({
              id: v.id,
              vocab: v.vocab,
              status: v.status,
              videoLink: v.videoLink,
            })),
          )
        }

        setVocabularyData(filteredData)

        // Update pagination info
        if (response.data) {
          setPaginationInfo({
            currentPage: response.data.currentPage || 0,
            totalPages: response.data.totalPages || 0,
            totalElements: response.data.totalElements || 0,
            pageSize: response.data.pageSize || 12,
            hasNext: response.data.hasNext || false,
            hasPrevious: response.data.hasPrevious || false,
          })
        }
      } catch (error: any) {
        console.error("Error fetching vocabulary data:", error)
        setVocabularyData([])
        setPaginationInfo({
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
          pageSize: 12,
          hasNext: false,
          hasPrevious: false,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVocabularyData()
  }, [currentPage, searchTerm, selectedTopic, selectedRegion, selectedLetter, topics, regions])

  const handleVocabClick = (id: number) => {
    router.push(`/vocab-detail?id=${id}`)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    debouncedSearch(value)
  }

  const handleTopicChange = (value: string) => {
    setSelectedTopic(value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleLetterChange = (letter: string) => {
    setSelectedLetter(letter)
    setCurrentPage(1) // Reset to first page when filtering
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

      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Search Section */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 z-10" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm từ vựng..."
                    onChange={handleSearchChange}
                    className="pl-12 pr-4 h-16 border-3 border-blue-300/60 rounded-2xl bg-white/90 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-gray-700 placeholder:text-gray-400 w-full text-lg"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Alphabet Filter */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6">
                <div className="flex flex-col items-center gap-3">
                  {" "}
                  {/* Increased gap to gap-3 */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {" "}
                    {/* Increased gap to gap-3 */}
                    {alphabet.slice(0, 16).map((letter) => (
                      <Button
                        key={letter}
                        onClick={() => handleLetterChange(letter)}
                        className={`h-12 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 ${
                          letter === "TẤT CẢ" ? "px-8" : "w-12" // Apply wider padding for "TẤT CẢ"
                        } ${
                          selectedLetter === letter
                            ? letter === "TẤT CẢ"
                              ? "bg-gradient-to-r from-blue-300 to-cyan-300 text-blue-900" // Pastel blue for "TẤT CẢ" when selected
                              : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" // Original gradient for other letters when selected
                            : "bg-white/90 hover:bg-blue-50 text-gray-700 border border-blue-200/60"
                        }`}
                      >
                        {letter}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {" "}
                    {/* Increased gap to gap-3 */}
                    {alphabet.slice(16).map((letter) => (
                      <Button
                        key={letter}
                        onClick={() => handleLetterChange(letter)}
                        className={`h-12 w-12 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 ${
                          selectedLetter === letter
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                            : "bg-white/90 hover:bg-blue-50 text-gray-700 border border-blue-200/60"
                        }`}
                      >
                        {letter}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Topic Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-3">CHỌN TOPIC</label>
                  <Select value={selectedTopic} onValueChange={handleTopicChange}>
                    <SelectTrigger className="h-14 border-2 border-blue-200/60 rounded-2xl bg-white/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md">
                      <SelectValue placeholder="Chọn Topic" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-blue-200 shadow-xl">
                      {topics.map((topic) => (
                        <SelectItem key={topic.value} value={topic.value} className="rounded-lg">
                          {topic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Region Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-3">CHỌN KHU VỰC</label>
                  <Select value={selectedRegion} onValueChange={handleRegionChange}>
                    <SelectTrigger className="h-14 border-2 border-blue-200/60 rounded-2xl bg-white/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md">
                      <SelectValue placeholder="Chọn Khu Vực" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-blue-200 shadow-xl">
                      {regions.map((region) => (
                        <SelectItem key={region.value} value={region.value} className="rounded-lg">
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Video Grid Section */}
          <div className="mb-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-blue-700 font-medium">Đang tải từ vựng...</p>
              </div>
            ) : vocabularyData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 font-medium">Không tìm thấy từ vựng nào</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
                  {/* Desktop Grid: 4 videos per row */}
                  <div className="hidden md:grid md:grid-cols-4 gap-6">
                    {vocabularyData.map((vocab) => (
                      <div key={vocab.id} className="group cursor-pointer" onClick={() => handleVocabClick(vocab.id)}>
                        <div className="relative">
                          {/* Video Thumbnail */}
                          <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                            {vocab.videoLink ? (
                              <>
                                {/* Show video thumbnail with seek to get full body */}
                                <video
                                  className="w-full h-full object-cover"
                                  preload="metadata"
                                  muted
                                  playsInline
                                  style={{
                                    display: "block",
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "#f0f0f0",
                                    border: "2px solid #e0e0e0",
                                    position: "relative",
                                    zIndex: 5,
                                    minHeight: "200px",
                                  }}
                                  onLoadedMetadata={(e) => {
                                    const video = e.target as HTMLVideoElement
                                    // Try different times to find frame with full body
                                    const times = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
                                    const randomTime = times[Math.floor(Math.random() * times.length)]
                                    video.currentTime = randomTime
                                    console.log("🎬 Seeking to time:", randomTime, "for vocab:", vocab.vocab)
                                  }}
                                  onError={(e) => {
                                    // Fallback to letter if video fails to load
                                    const video = e.target as HTMLVideoElement
                                    video.style.display = "none"
                                    const parent = video.parentElement
                                    if (parent) {
                                      const fallback = document.createElement("div")
                                      fallback.className =
                                        "absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center"
                                      fallback.innerHTML = `<span class="text-4xl font-bold text-blue-600">${vocab.vocab.charAt(0).toUpperCase()}</span>`
                                      parent.appendChild(fallback)
                                    }
                                  }}
                                >
                                  <source src={vocab.videoLink} type="video/mp4" />
                                </video>
                                {/* Fallback nếu video không có poster */}
                                {!vocab.thumbnailUrl && (
                                  <div
                                    className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center"
                                    style={{ zIndex: 1 }}
                                  >
                                    <span className="text-4xl font-bold text-blue-600">
                                      {vocab.vocab.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </>
                            ) : vocab.thumbnailUrl ? (
                              <img
                                src={vocab.thumbnailUrl || "/placeholder.svg"}
                                alt={vocab.vocab}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                                <span className="text-4xl font-bold text-blue-600">
                                  {vocab.vocab.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                <Play className="w-6 h-6 text-blue-600 ml-1" />
                              </div>
                            </div>

                            {/* Region Tags - chỉ hiển thị region, bỏ topic */}
                            <div className="absolute top-2 left-2 flex gap-1">
                              {vocab.region && (
                                <span className="px-2 py-1 bg-cyan-500/80 text-white text-xs font-bold rounded-lg backdrop-blur-sm">
                                  {vocab.region}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Vocabulary Name */}
                          <div className="mt-3 text-center">
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                              {vocab.vocab}
                            </h3>
                            {vocab.meaning && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{vocab.meaning}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Layout: 1 video per row with text on the right */}
                  <div className="md:hidden space-y-4">
                    {vocabularyData.map((vocab) => (
                      <div key={vocab.id} className="group cursor-pointer" onClick={() => handleVocabClick(vocab.id)}>
                        <div className="flex gap-4 items-center">
                          {/* Video Thumbnail */}
                          <div className="relative w-32 aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0">
                            {vocab.videoLink ? (
                              <>
                                {/* Show video thumbnail with seek to get full body */}
                                <video
                                  className="w-full h-full object-cover"
                                  preload="metadata"
                                  muted
                                  playsInline
                                  style={{
                                    display: "block",
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "#f0f0f0",
                                    border: "2px solid #e0e0e0",
                                    position: "relative",
                                    zIndex: 5,
                                    minHeight: "120px",
                                  }}
                                  onLoadedMetadata={(e) => {
                                    const video = e.target as HTMLVideoElement
                                    // Try different times to find frame with full body
                                    const times = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
                                    const randomTime = times[Math.floor(Math.random() * times.length)]
                                    video.currentTime = randomTime
                                    console.log("🎬 Seeking to time:", randomTime, "for vocab:", vocab.vocab)
                                  }}
                                  onError={(e) => {
                                    // Fallback to letter if video fails to load
                                    const video = e.target as HTMLVideoElement
                                    video.style.display = "none"
                                    const parent = video.parentElement
                                    if (parent) {
                                      const fallback = document.createElement("div")
                                      fallback.className =
                                        "absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center"
                                      fallback.innerHTML = `<span class="text-2xl font-bold text-blue-600">${vocab.vocab.charAt(0).toUpperCase()}</span>`
                                      parent.appendChild(fallback)
                                    }
                                  }}
                                >
                                  <source src={vocab.videoLink} type="video/mp4" />
                                </video>
                                {/* Fallback nếu video không có poster */}
                                {!vocab.thumbnailUrl && (
                                  <div
                                    className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center"
                                    style={{ zIndex: 1 }}
                                  >
                                    <span className="text-2xl font-bold text-blue-600">
                                      {vocab.vocab.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </>
                            ) : vocab.thumbnailUrl ? (
                              <img
                                src={vocab.thumbnailUrl || "/placeholder.svg"}
                                alt={vocab.vocab}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                                <span className="text-2xl font-bold text-blue-600">
                                  {vocab.vocab.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                <Play className="w-4 h-4 text-blue-600 ml-0.5" />
                              </div>
                            </div>
                          </div>

                          {/* Vocabulary Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                              {vocab.vocab}
                            </h3>
                            {vocab.meaning && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{vocab.meaning}</p>
                            )}

                            {/* Tags - chỉ hiển thị region, bỏ topic */}
                            <div className="flex gap-2 mt-2">
                              {vocab.region && (
                                <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-bold rounded-lg">
                                  {vocab.region}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {paginationInfo.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={!paginationInfo.hasPrevious}
                className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                ←
              </Button>

              {/* Generate page numbers with proper range */}
              {(() => {
                const totalPages = paginationInfo.totalPages
                const current = currentPage
                const maxVisible = 5

                let startPage = Math.max(1, current - Math.floor(maxVisible / 2))
                const endPage = Math.min(totalPages, startPage + maxVisible - 1)

                // Adjust start if we're near the end
                if (endPage - startPage + 1 < maxVisible) {
                  startPage = Math.max(1, endPage - maxVisible + 1)
                }

                const pages = []
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i)
                }

                return pages.map((pageNum) => (
                  <Button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-12 h-12 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-200 ${
                      pageNum === currentPage
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        : "bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {pageNum}
                  </Button>
                ))
              })()}

              <Button
                onClick={() => setCurrentPage(Math.min(paginationInfo.totalPages, currentPage + 1))}
                disabled={!paginationInfo.hasNext}
                className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                →
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default DictionaryPageComponent

