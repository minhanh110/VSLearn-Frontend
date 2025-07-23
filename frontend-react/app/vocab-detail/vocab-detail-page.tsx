"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Edit, Ban, BookOpen, Play, Pause } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { VocabService } from "@/app/services/vocab.service";

interface VocabularyDetail {
  id: number
  vocab: string
  topicName: string
  subTopicName: string
  description?: string
  videoLink?: string
  region?: string
  status: string
  createdAt: string
  createdBy: number
  updatedAt?: string
  updatedBy?: number
  deletedAt?: string
  deletedBy?: number
}

export function VocabDetailPageComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vocabId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [vocabulary, setVocabulary] = useState<VocabularyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)
  
  // Dynamic data for dropdowns
  const [topics, setTopics] = useState<{ value: string, label: string, id: string | number }[]>([])
  const [regions, setRegions] = useState<{ value: string, label: string }[]>([])

  // Fetch topics and regions on mount
  useEffect(() => {
    // Fetch topics
    fetch("http://localhost:8080/api/v1/vocab/topics")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTopics(data.map((t: any) => ({ value: t.id?.toString() || t.value, label: t.name || t.label, id: t.id })));
        }
      })
      .catch(() => setTopics([]));
    
    // Fetch regions
    fetch("http://localhost:8080/api/v1/vocab/regions")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRegions(data.map((r: any) => ({ value: r.value || r.id, label: r.label || r.name })));
        }
      })
      .catch(() => setRegions([]));
  }, []);

  // Fetch vocabulary detail
  useEffect(() => {
    if (!vocabId) return;
    
    const fetchVocabDetail = async () => {
      try {
        setLoading(true);
        const response = await VocabService.getVocabDetail(vocabId);
        console.log("🔍 Vocab detail response:", response.data);
        console.log("🔍 VideoLink:", response.data.videoLink);
        setVocabulary(response.data);
      } catch (error: any) {
        console.error("Error fetching vocab detail:", error);
        alert("Không thể tải thông tin từ vựng. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
    
    fetchVocabDetail();
  }, [vocabId])

  const handleRegionChange = async (region: string) => {
    if (!vocabulary) return;
    
    try {
      setLoading(true);
      // For now, just show an alert that this feature is not implemented
      alert(`Tính năng chuyển đổi vùng miền cho từ "${vocabulary.vocab}" chưa được triển khai`);
    } catch (error) {
      console.error("Error changing region:", error);
      alert("Có lỗi xảy ra khi chuyển đổi vùng miền");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back()
  }

  const handleEdit = () => {
    router.push(`/vocab-edit?id=${vocabId}`)
  }

  const handleDisable = async () => {
    if (!vocabId) return;
    
    if (confirm("Bạn có chắc chắn muốn vô hiệu hóa từ vựng này?")) {
      try {
        await VocabService.deleteVocab(vocabId);
        alert("Vô hiệu hóa từ vựng thành công!");
        router.push("/list-vocab");
      } catch (error: any) {
        alert(error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!");
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

  if (!vocabulary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium">Không tìm thấy từ vựng</div>
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
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-2">
              CHI TIẾT TỪ VỰNG
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
          </div>

          {/* Main Layout - Single Column */}
          <div className="relative">
            {/* Glow effect behind form */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>

            <div className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-10 max-w-4xl mx-auto">
              {/* Form Header with icon */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-2">
                  {vocabulary.vocab}
                </h2>
                <p className="text-gray-600 text-sm font-medium">CHI TIẾT TỪ VỰNG</p>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-3"></div>
              </div>

              {/* Video Section */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-gray-700 mb-4 text-center">VIDEO MINH HỌA</label>
                <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden shadow-lg max-w-2xl mx-auto">
                  {vocabulary.videoLink ? (
                    <>
                      {(() => {
                        // Use signed URL directly from backend response like flashcard does
                        const videoUrl = vocabulary.videoLink;
                        console.log("🔍 Video URL:", videoUrl);
                        return (
                          <video
                            ref={setVideoRef}
                            className="w-full h-full object-cover"
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            controls
                            preload="metadata"
                            onError={(e) => {
                              console.error("❌ Video error:", e);
                              const video = e.target as HTMLVideoElement;
                              console.error("❌ Video error details:", video.error);
                              console.error("❌ Video networkState:", video.networkState);
                              console.error("❌ Video readyState:", video.readyState);
                            }}
                            onLoadStart={() => console.log("🔍 Video loading started")}
                            onCanPlay={() => console.log("✅ Video can play")}
                          >
                            <source src={videoUrl} type="video/mp4" />
                            Trình duyệt của bạn không hỗ trợ video.
                          </video>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Chưa có video</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Region Selection Buttons */}
                <div className="flex justify-center gap-3 mt-6">
                  <Button
                    onClick={() => handleRegionChange('Toàn quốc')}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md ${
                      !vocabulary.region || vocabulary.region === 'Toàn quốc'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-white hover:bg-blue-50 text-gray-700 border border-blue-200'
                    }`}
                  >
                    Toàn quốc
                  </Button>
                  <Button
                    onClick={() => handleRegionChange('Miền Bắc')}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md ${
                      vocabulary.region === 'Miền Bắc'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-white hover:bg-blue-50 text-gray-700 border border-blue-200'
                    }`}
                  >
                    Miền Bắc
                  </Button>
                  <Button
                    onClick={() => handleRegionChange('Miền Trung')}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md ${
                      vocabulary.region === 'Miền Trung'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-white hover:bg-blue-50 text-gray-700 border border-blue-200'
                    }`}
                  >
                    Miền Trung
                  </Button>
                  <Button
                    onClick={() => handleRegionChange('Miền Nam')}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md ${
                      vocabulary.region === 'Miền Nam'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-white hover:bg-blue-50 text-gray-700 border border-blue-200'
                    }`}
                  >
                    Miền Nam
                  </Button>
                </div>
              </div>

              {/* Information Fields */}
              <div className="space-y-6">
                {/* Meaning - Most Important */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Ý NGHĨA:</label>
                  <div className="relative">
                    <div className="w-full min-h-20 p-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium leading-relaxed">
                      {vocabulary.description || "Chưa có ý nghĩa"}
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
                  </div>
                </div>

                {/* Description */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-3">MÔ TẢ:</label>
                  <div className="relative">
                    <div className="w-full min-h-24 p-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium leading-relaxed">
                      {vocabulary.description || "Chưa có mô tả"}
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
                  </div>
                </div>

                {/* Two columns for metadata */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Topic */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3">CHỦ ĐỀ:</label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium flex items-center">
                        {vocabulary.topicName}
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Region */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3">KHU VỰC:</label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium flex items-center">
                        {vocabulary.region || "Toàn quốc"}
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                {/* Additional info in two columns */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Sub Topic */}
                  {vocabulary.subTopicName && (
                    <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-3">CHỦ ĐỀ CON:</label>
                      <div className="relative">
                        <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium flex items-center">
                          {vocabulary.subTopicName}
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3">TRẠNG THÁI:</label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 border-2 border-blue-200/60 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium flex items-center">
                        <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                          vocabulary.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {vocabulary.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-10 justify-center">
                <Button
                  onClick={handleGoBack}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ArrowLeft className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">QUAY LẠI</span>
                </Button>

                <Button
                  onClick={handleEdit}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Edit className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">CHỈNH SỬA</span>
                </Button>

                <Button
                  onClick={handleDisable}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Ban className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">VÔ HIỆU HÓA</span>
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

export default VocabDetailPageComponent