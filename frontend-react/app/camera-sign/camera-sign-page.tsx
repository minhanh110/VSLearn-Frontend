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
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface VocabularyWord {
  id: string
  word: string
  category: string
  videoUrl: string
  description: string
  difficulty: "easy" | "medium" | "hard"
}

const CameraSignPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWord, setCurrentWord] = useState<VocabularyWord>({
    id: "1",
    word: "BỐ MẸ",
    category: "GIA ĐÌNH",
    videoUrl: "/placeholder.svg?height=400&width=600",
    description:
      'Tay phải giống chữ cái ngón tay "B", lòng bàn tay hướng vào trong, đặt chạm các đầu ngón tay vào cằm. Lòng bàn tay hướng sang trái, đầu ngón tay hướng lên trên, đặt áp vào má phải.',
    difficulty: "easy",
  })
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

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

  // Simulate video analysis
  const analyzeVideo = useCallback(() => {
    setIsAnalyzing(true)
    setAccuracy(0)

    // Simulate analysis progress
    const analysisInterval = setInterval(() => {
      setAccuracy((prev) => {
        if (prev >= 85) {
          clearInterval(analysisInterval)
          setIsAnalyzing(false)
          return 85
        }
        return prev + Math.random() * 10
      })
    }, 200)
  }, [])

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
              {currentWord.word}
            </h1>
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
                    <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={currentWord.videoUrl || "/placeholder.svg"}
                        alt="Reference video"
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <Button
                          onClick={toggleReferenceVideo}
                          size="lg"
                          className="bg-white/30 backdrop-blur-sm hover:bg-white/50 text-white border-white/50 rounded-full p-4"
                        >
                          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                        </Button>
                      </div>
                      <video
                        ref={referenceVideoRef}
                        className="hidden"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                      >
                        <source src={currentWord.videoUrl} type="video/mp4" />
                      </video>
                    </div>
                  </CardContent>
                </Card>
              </div>

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
