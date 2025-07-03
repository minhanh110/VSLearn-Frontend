"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

interface VocabularyItem {
  id: string
  letter: string
  topic: string
  region: string
}

export function DictionaryPageComponent() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedLetter, setSelectedLetter] = useState("TẤT CẢ")
  const [currentPage, setCurrentPage] = useState(1)

  // Alphabet buttons
  const alphabet = [
    "TẤT CẢ",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
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
    "W",
    "X",
    "Y",
    "Z",
  ]

  // Sample vocabulary data
  const vocabularyData: VocabularyItem[] = [
    { id: "1", letter: "A", topic: "Bảng chữ cái", region: "Toàn Quốc" },
    { id: "2", letter: "Á", topic: "Bảng chữ cái", region: "Toàn Quốc" },
    { id: "3", letter: "Â", topic: "Bảng chữ cái", region: "Toàn Quốc" },
    { id: "4", letter: "Ã", topic: "Bảng chữ cái", region: "Toàn Quốc" },
  ]

  const topics = [
    { value: "bảng-chữ-cái", label: "Bảng chữ cái" },
    { value: "gia-đình", label: "Gia đình" },
    { value: "thiên-nhiên", label: "Thiên nhiên" },
    { value: "học-tập", label: "Học tập" },
  ]

  const regions = [
    { value: "toàn-quốc", label: "Toàn Quốc" },
    { value: "miền-bắc", label: "Miền Bắc" },
    { value: "miền-trung", label: "Miền Trung" },
    { value: "miền-nam", label: "Miền Nam" },
  ]

  const handleVocabClick = (id: string) => {
    router.push(`/vocab-detail-dictionary?id=${id}`)
  }

  const totalPages = 5

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
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-14 gap-2">
                  {alphabet.map((letter) => (
                    <Button
                      key={letter}
                      onClick={() => setSelectedLetter(letter)}
                      className={`h-12 w-12 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 ${
                        selectedLetter === letter
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                          : "bg-white/90 hover:bg-blue-50 text-gray-700 border border-blue-200/60"
                      }`}
                    >
                      {letter === "TẤT CẢ" ? "ALL" : letter}
                    </Button>
                  ))}
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
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
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
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
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

          {/* Vocabulary List */}
          <div className="space-y-6 mb-8">
            {vocabularyData.map((vocab) => (
              <div key={vocab.id} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div
                  className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] cursor-pointer"
                  onClick={() => handleVocabClick(vocab.id)}
                >
                  <div className="flex items-center justify-between">
                    {/* Vocabulary Letter */}
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg">
                        <span className="text-3xl font-bold text-white">{vocab.letter}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex gap-4">
                        <span className="px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-2xl text-sm font-bold shadow-sm">
                          {vocab.topic}
                        </span>
                        <span className="px-6 py-3 bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-700 rounded-2xl text-sm font-bold shadow-sm">
                          {vocab.region}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              ←
            </Button>

            {[1, 2, 3, "...", 5].map((page, index) => (
              <Button
                key={index}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                className={`w-12 h-12 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-200 ${
                  page === currentPage
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800"
                } ${typeof page !== "number" ? "cursor-default hover:bg-white/80" : ""}`}
                disabled={typeof page !== "number"}
              >
                {page}
              </Button>
            ))}

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

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default DictionaryPageComponent
