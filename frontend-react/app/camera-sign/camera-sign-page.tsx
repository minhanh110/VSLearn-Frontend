"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Camera,
  Square,
  RotateCcw,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle,
  AlertCircle,
  Info,
  Wifi,
  WifiOff,
  ChevronLeft,
  ChevronRight,
  Shuffle,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAIService } from "@/hooks/useAIService"
import { useVocabulary } from "@/hooks/useVocabulary"
import { useSearchParams } from "next/navigation"
import { VocabularyWord } from "@/lib/api/vocabulary-service"

// Remove this interface since we're using the one from vocabulary-service

const CameraSignPage = () => {
  const searchParams = useSearchParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  
  // Vocabulary Hook
  const {
    vocabulary,
    currentWord,
    currentIndex,
    isLoading: vocabularyLoading,
    error: vocabularyError,
    goToNext,
    goToPrevious,
    goToRandom,
    searchByCategory,
    searchByDifficulty,
  } = useVocabulary()
  
  // AI Service Hook
  const {
    isProcessing,
    isAnalyzing,
    accuracy,
    taskId,
    aiResponse,
    error,
    healthStatus,
    processVideo,
    resetState,
  } = useAIService()

  const videoRef = useRef<HTMLVideoElement>(null)
  const referenceVideoRef = useRef<HTMLVideoElement>(null)
  const uploadVideoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access camera. Please check permissions.")
    }
  }, [])

  // Start recording
  const startRecording = useCallback(() => {
    if (!stream) return

    const recorder = new MediaRecorder(stream)
    const chunks: BlobPart[] = []

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data)
      }
    }

    recorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" })
      const videoUrl = URL.createObjectURL(videoBlob)
      setUploadedVideo(videoUrl)
      setRecordingTime(0)
      analyzeVideo()
    }

    recorder.start()
    setMediaRecorder(recorder)
    setIsRecording(true)

    // Start recording timer
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)
  }, [stream])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
    }
    setIsRecording(false)
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }
  }, [mediaRecorder])

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const videoUrl = URL.createObjectURL(file)
      setUploadedVideo(videoUrl)
      analyzeVideo()
    }
  }, [])

  // Real video analysis using AI service
  const analyzeVideo = useCallback(async () => {
    if (!uploadedVideo || !currentWord) return
    
    try {
      // Convert video URL to File object
      const response = await fetch(uploadedVideo)
      const blob = await response.blob()
      const videoFile = new File([blob], 'recorded_video.webm', { type: 'video/webm' })
      
      // Process video with AI service
      await processVideo({
        video: videoFile,
        expectedWord: currentWord.vocab,
        category: currentWord.category,
        difficulty: currentWord.difficulty || "medium",
      })
      
    } catch (err) {
      console.error('Failed to analyze video:', err)
    }
  }, [uploadedVideo, currentWord, processVideo])

  // Toggle reference video play
  const toggleReferenceVideo = useCallback(() => {
    if (referenceVideoRef.current) {
      if (isPlaying) {
        referenceVideoRef.current.pause()
      } else {
        referenceVideoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Get accuracy color
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-green-600"
    if (accuracy >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  // Get accuracy icon
  const getAccuracyIcon = (accuracy: number) => {
    if (accuracy >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (accuracy >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <AlertCircle className="h-5 w-5 text-red-600" />
  }

  // Load word from URL parameters
  useEffect(() => {
    const wordId = searchParams.get('wordId')
    const category = searchParams.get('category')
    
    if (category) {
      searchByCategory(category)
    }
  }, [searchParams, searchByCategory])

  // Navigation functions with reset
  const goToNextWord = useCallback(() => {
    goToNext()
    resetState()
    setUploadedVideo(null)
  }, [goToNext, resetState])

  const goToPreviousWord = useCallback(() => {
    goToPrevious()
    resetState()
    setUploadedVideo(null)
  }, [goToPrevious, resetState])

  const goToRandomWord = useCallback(() => {
    goToRandom()
    resetState()
    setUploadedVideo(null)
  }, [goToRandom, resetState])

  // Initialize camera on component mount
  useEffect(() => {
    initializeCamera()

    return () => {
      // Cleanup
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      if (uploadedVideo) {
        URL.revokeObjectURL(uploadedVideo)
      }
    }
  }, [])

  // Reset AI state when component unmounts
  useEffect(() => {
    return () => {
      resetState()
    }
  }, [resetState])

  // Loading state
  if (vocabularyLoading || !currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 relative overflow-hidden">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">
                {vocabularyLoading ? 'Đang tải từ vựng từ database...' : 'Không tìm thấy từ vựng'}
              </p>
              {vocabularyError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                  <p className="text-red-600 text-sm">Lỗi: {vocabularyError}</p>
                  <p className="text-gray-600 text-xs mt-2">Vui lòng kiểm tra kết nối database</p>
                </div>
              )}
              {vocabulary.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Đã tải {vocabulary.length} từ vựng
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
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
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <Badge className="bg-blue-100 text-blue-700 border-blue-300 px-4 py-2 text-lg font-semibold">
                {currentWord.category}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-2 mt-2">
              {currentWord.vocab}
            </h1>
            
            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                onClick={goToPreviousWord}
                variant="outline"
                size="sm"
                className="border-2 border-blue-200/60 bg-white/90 text-blue-600 hover:bg-blue-50 rounded-full p-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={goToRandomWord}
                variant="outline"
                size="sm"
                className="border-2 border-blue-200/60 bg-white/90 text-blue-600 hover:bg-blue-50 rounded-full p-2"
              >
                <Shuffle className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={goToNextWord}
                variant="outline"
                size="sm"
                className="border-2 border-blue-200/60 bg-white/90 text-blue-600 hover:bg-blue-50 rounded-full p-2"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-sm text-gray-600">
                {currentIndex + 1} / {vocabulary.length}
              </span>
            </div>
            
            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
                <p className="text-xs text-blue-600">
                  <strong>Debug:</strong> ID: {currentWord.id} | Category: {currentWord.category} | 
                  Total: {vocabulary.length} items
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Force Reload
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Practice Section */}
            <div className="space-y-6">
              {/* Camera Practice */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>
                <Card className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50">
                  <CardHeader>
                    <CardTitle className="text-blue-700 text-center">CAMERA THỰC HÀNH</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Video Display */}
                    <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
                      {uploadedVideo ? (
                        <video ref={uploadVideoRef} src={uploadedVideo} className="w-full h-64 object-cover" controls />
                      ) : (
                        <video
                          ref={videoRef}
                          autoPlay
                          muted={isMuted}
                          className="w-full h-64 object-cover"
                          playsInline
                        />
                      )}

                      {isRecording && (
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-white font-medium">REC {formatTime(recordingTime)}</span>
                        </div>
                      )}

                      {!uploadedVideo && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-4 right-4 bg-white/30 backdrop-blur-sm hover:bg-white/50 text-white"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3">
                      {!uploadedVideo && (
                        <>
                          {!isRecording ? (
                            <Button
                              onClick={startRecording}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Bắt đầu quay
                            </Button>
                          ) : (
                            <Button
                              onClick={stopRecording}
                              variant="destructive"
                              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              <Square className="h-4 w-4 mr-2" />
                              Dừng quay
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={initializeCamera}
                            className="border-2 border-blue-200/60 bg-white/90 text-blue-600 hover:bg-blue-50 rounded-2xl px-4"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="border-2 border-blue-200/60 bg-white/90 text-blue-600 hover:bg-blue-50 rounded-2xl px-6"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Tải video
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Practice Tips */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>
                <Card className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50">
                  <CardHeader>
                    <CardTitle className="text-blue-700 text-center">MẸO THỰC HÀNH</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-blue-200">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Đảm bảo ánh sáng tốt và nền không bị nhiễu</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-blue-200">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Thực hiện động tác chậm và rõ ràng</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-blue-200">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Giữ tay trong khung hình camera</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Accuracy Display */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>
                <Card className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50">
                  <CardHeader>
                    <CardTitle className="text-blue-700 text-center">ĐỘ CHÍNH XÁC</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      {getAccuracyIcon(accuracy)}
                      <span className={`text-4xl font-bold ${getAccuracyColor(accuracy)}`}>
                        {Math.round(accuracy)}%
                      </span>
                    </div>
                    <Progress value={accuracy} className="w-full h-3 bg-gray-200" />
                    {isAnalyzing && <p className="text-sm text-blue-600 animate-pulse">Đang phân tích video...</p>}
                    {accuracy > 0 && !isAnalyzing && (
                      <p className="text-sm text-gray-600">
                        {accuracy >= 80
                          ? "Xuất sắc! Bạn đã thực hiện rất tốt."
                          : accuracy >= 60
                            ? "Tốt! Hãy thử lại để cải thiện."
                            : "Cần cải thiện. Xem lại video mẫu và thử lại."}
                      </p>
                    )}
                    
                    {/* AI Service Health Status */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                      {healthStatus?.ai_service_available ? (
                        <Wifi className="h-4 w-4 text-green-600" />
                      ) : (
                        <WifiOff className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-xs ${healthStatus?.ai_service_available ? 'text-green-600' : 'text-red-600'}`}>
                        {healthStatus?.ai_service_available ? 'AI Service Online' : 'AI Service Offline'}
                      </span>
                    </div>
                    
                    {/* Error Display */}
                    {error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Side - Reference Section */}
            <div className="space-y-6">
              {/* Reference Video */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>
                <Card className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50">
                  <CardHeader>
                    <CardTitle className="text-blue-700 text-center">CÁCH THỰC HIỆN</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Video demo */}
                    {currentWord && (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <video
                          className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          muted
                          playsInline
                          preload="metadata"
                          controls
                          onLoadedMetadata={(e) => {
                            const video = e.target as HTMLVideoElement;
                            const times = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
                            const randomTime = times[Math.floor(Math.random() * times.length)];
                            video.currentTime = randomTime;
                            console.log("🎬 Seeking to time:", randomTime, "for vocab:", currentWord.vocab);
                          }}
                          onError={(e) => {
                            // Fallback to letter if video fails to load
                            const video = e.target as HTMLVideoElement;
                            video.style.display = "none";
                            const parent = video.parentElement;
                            if (parent) {
                              const fallback = document.createElement("div");
                              fallback.className = "absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center";
                              fallback.innerHTML = `<span class="text-4xl font-bold text-blue-600">${currentWord.vocab.charAt(0).toUpperCase()}</span>`;
                              parent.appendChild(fallback);
                            }
                          }}
                        >
                          <source src={currentWord.videoUrl} type="video/mp4" />
                        </video>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* AI Result Display */}
              {aiResponse && aiResponse.status === 'completed' && aiResponse.result && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-3xl blur-xl"></div>
                  <Card className="relative bg-gradient-to-br from-green-100/95 to-emerald-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50">
                    <CardHeader>
                      <CardTitle className="text-green-700 text-center">KẾT QUẢ PHÂN TÍCH AI</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-white/70 p-6 rounded-xl border border-green-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2">Từ được nhận diện:</h4>
                            <p className="text-2xl font-bold text-gray-800">{aiResponse.result.predictedWord}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2">Độ tin cậy:</h4>
                            <p className="text-2xl font-bold text-gray-800">
                              {Math.round(aiResponse.result.confidence * 100)}%
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-semibold text-green-700 mb-2">Đánh giá:</h4>
                          <p className="text-gray-700">{aiResponse.result.feedback}</p>
                        </div>
                        
                        {aiResponse.result.suggestions && aiResponse.result.suggestions.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-semibold text-green-700 mb-2">Gợi ý cải thiện:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {aiResponse.result.suggestions.map((suggestion, index) => (
                                <li key={index} className="text-gray-700 text-sm">{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Description */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>
                <Card className="relative bg-gradient-to-br from-blue-100/95 to-cyan-100/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50">
                  <CardHeader>
                    <CardTitle className="text-blue-700">MÔ TẢ:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white/70 p-6 rounded-xl border border-blue-200">
                      <p className="text-gray-700 leading-relaxed text-base">{currentWord.description}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`
                          ${
                            currentWord.difficulty === "easy"
                              ? "bg-green-100 text-green-700 border-green-300"
                              : currentWord.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                : "bg-red-100 text-red-700 border-red-300"
                          }
                        `}
                      >
                        {currentWord.difficulty === "easy"
                          ? "Dễ"
                          : currentWord.difficulty === "medium"
                            ? "Trung bình"
                            : "Khó"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
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
      `}</style>
    </div>
  )
}

export default CameraSignPage
