"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Square, RotateCcw, Download, Play, Volume2, VolumeX } from "lucide-react"

interface RecordedSign {
  id: string
  name: string
  videoBlob: Blob
  videoUrl: string
  timestamp: Date
  duration: number
}

export default function CameraSignPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedSigns, setRecordedSigns] = useState<RecordedSign[]>([])
  const [currentSign, setCurrentSign] = useState<string>("")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
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

      const newSign: RecordedSign = {
        id: Date.now().toString(),
        name: currentSign || `Sign ${recordedSigns.length + 1}`,
        videoBlob,
        videoUrl,
        timestamp: new Date(),
        duration: recordingTime,
      }

      setRecordedSigns((prev) => [...prev, newSign])
      setCurrentSign("")
      setRecordingTime(0)
    }

    recorder.start()
    setMediaRecorder(recorder)
    setIsRecording(true)

    // Start recording timer
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)
  }, [stream, currentSign, recordedSigns.length, recordingTime])

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

  // Download video
  const downloadVideo = useCallback((sign: RecordedSign) => {
    const link = document.createElement("a")
    link.href = sign.videoUrl
    link.download = `${sign.name}.webm`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  // Delete recorded sign
  const deleteSign = useCallback((id: string) => {
    setRecordedSigns((prev) => {
      const updated = prev.filter((sign) => sign.id !== id)
      // Revoke object URL to free memory
      const signToDelete = prev.find((sign) => sign.id === id)
      if (signToDelete) {
        URL.revokeObjectURL(signToDelete.videoUrl)
      }
      return updated
    })
  }, [])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
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
      // Cleanup object URLs
      recordedSigns.forEach((sign) => {
        URL.revokeObjectURL(sign.videoUrl)
      })
    }
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center gap-4 mb-6">
        <Camera className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Camera Sign Recording</h1>
          <p className="text-gray-600">Record and practice sign language</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Section */}
        <Card>
          <CardHeader>
            <CardTitle>Camera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video Preview */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video ref={videoRef} autoPlay muted={isMuted} className="w-full h-64 object-cover" playsInline />
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">REC {formatTime(recordingTime)}</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-transparent"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>

            {/* Sign Name Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Sign Name (Optional)</label>
              <input
                type="text"
                value={currentSign}
                onChange={(e) => setCurrentSign(e.target.value)}
                placeholder="Enter sign name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isRecording}
              />
            </div>

            {/* Recording Controls */}
            <div className="flex gap-3">
              {!isRecording ? (
                <Button onClick={startRecording} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="destructive" className="flex-1">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
              )}
              <Button variant="outline" onClick={initializeCamera}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recorded Signs */}
        <Card>
          <CardHeader>
            <CardTitle>Recorded Signs ({recordedSigns.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recordedSigns.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No signs recorded yet</p>
                  <p className="text-sm">Start recording to see your signs here</p>
                </div>
              ) : (
                recordedSigns.map((sign) => (
                  <div key={sign.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{sign.name}</h3>
                        <p className="text-sm text-gray-500">
                          {sign.timestamp.toLocaleString()} • {formatTime(sign.duration)}
                        </p>
                      </div>
                      <Badge variant="outline">{(sign.videoBlob.size / 1024 / 1024).toFixed(1)} MB</Badge>
                    </div>

                    {/* Video Preview */}
                    <div className="relative bg-black rounded overflow-hidden mb-3">
                      <video
                        src={sign.videoUrl}
                        className="w-full h-32 object-cover"
                        controls={playingVideo === sign.id}
                        onClick={() => setPlayingVideo(playingVideo === sign.id ? null : sign.id)}
                      />
                      {playingVideo !== sign.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                          <Button variant="outline" size="sm" onClick={() => setPlayingVideo(sign.id)}>
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => downloadVideo(sign)} className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSign(sign.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recording Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Good Lighting</h4>
              <p className="text-gray-600">
                Ensure you have good lighting on your hands and face for clear visibility.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Steady Position</h4>
              <p className="text-gray-600">
                Keep your device steady and maintain a consistent distance from the camera.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Clear Background</h4>
              <p className="text-gray-600">
                Use a plain background to make your signs more visible and easier to follow.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Practice Multiple Takes</h4>
              <p className="text-gray-600">
                Record multiple versions of the same sign to compare and improve your technique.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
