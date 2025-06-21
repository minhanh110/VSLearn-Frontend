"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LearningPath } from "@/components/learning-path"
import axiosInstance from "@/app/services/axios.config"

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [units, setUnits] = useState([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log("🔄 Fetching learning path data...")
        
        // Gọi API learning-path để lấy dữ liệu units từ database
        const res1 = await axiosInstance.get("/learning-path")
        console.log("📊 Learning path response:", res1.data)
        console.log("📊 Response status:", res1.status)
        console.log("📊 Response headers:", res1.headers)
        
        if (res1.data && res1.data.data && Array.isArray(res1.data.data)) {
          console.log("✅ Valid data structure found")
          console.log("✅ Units data:", JSON.stringify(res1.data.data, null, 2))
          setUnits(res1.data.data)
          console.log("✅ Set units:", res1.data.data.length, "units")
        } else {
          console.warn("⚠️ Invalid data structure:", res1.data)
          console.warn("⚠️ Data type:", typeof res1.data)
          console.warn("⚠️ Data.data type:", typeof res1.data?.data)
          console.warn("⚠️ Is array:", Array.isArray(res1.data?.data))
          setUnits([])
        }
        
        // Gọi API demo progress để lấy danh sách lesson đã hoàn thành (không cần auth)
        console.log("🔄 Fetching progress data...")
        const res2 = await axiosInstance.get("/demo/progress")
        console.log("📊 Progress response:", res2.data)
        
        // Chuyển đổi từ Long sang String để tương thích với frontend
        const completedIds = res2.data.data.map((id: number) => id.toString())
        setCompletedLessons(completedIds)
        console.log("✅ Set completed lessons:", completedIds)
        
      } catch (err: any) {
        console.error("❌ Error fetching data:", err)
        console.error("❌ Error response:", err.response)
        console.error("❌ Error message:", err.message)
        console.error("❌ Error stack:", err.stack)
        setError(err.message || "Lỗi tải dữ liệu")
      } finally {
        setLoading(false)
        console.log("🏁 Finished loading data")
        console.log("🏁 Final units state:", units)
        console.log("🏁 Final completedLessons state:", completedLessons)
      }
    }
    fetchData()
  }, [])

  const markLessonCompleted = async (lessonId: string) => {
    try {
      console.log("🎯 Marking lesson completed:", lessonId)
      // Sử dụng demo endpoint thay vì endpoint yêu cầu auth
      await axiosInstance.post("/demo/progress", { lessonId: parseInt(lessonId) })
      setCompletedLessons((prev) => prev.includes(lessonId) ? prev : [...prev, lessonId])
      console.log("✅ Lesson marked as completed")
    } catch (err) {
      console.error("❌ Error marking lesson completed:", err)
    }
  }

  // Debug: Log state changes
  useEffect(() => {
    console.log("🔄 Units state changed:", units)
  }, [units])

  useEffect(() => {
    console.log("🔄 CompletedLessons state changed:", completedLessons)
  }, [completedLessons])

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
      </div>
    </div>
  )
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h2 className="text-xl font-bold text-red-600 mb-2">Lỗi tải dữ liệu</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thử lại
        </button>
      </div>
    </div>
  )

  // Hiển thị thông tin debug nếu không có units
  if (!units || units.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-yellow-600 mb-2">Không có dữ liệu</h2>
          <p className="text-gray-600 mb-4">
            Không tìm thấy units trong database. Vui lòng kiểm tra:
          </p>
          <ul className="text-left text-sm text-gray-500 mb-4 max-w-md mx-auto">
            <li>• Database có dữ liệu trong bảng topic và sub_topic</li>
            <li>• Backend API /learning-path hoạt động</li>
            <li>• Console logs để xem chi tiết lỗi</li>
          </ul>
          <div className="bg-gray-100 p-4 rounded text-left text-xs max-w-md mx-auto mb-4">
            <strong>Debug Info:</strong><br/>
            Units length: {units?.length || 0}<br/>
            Units type: {typeof units}<br/>
            Units value: {JSON.stringify(units, null, 2)}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
      {/* Fixed Header */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} showMenuButton={true} />

      <div className="flex">
        {/* Footer component handles both sidebar (desktop) and footer (mobile) */}
        <Footer isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content - shifts right when sidebar is open */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}>
          <LearningPath
            sidebarOpen={sidebarOpen}
            units={units}
            completedLessons={completedLessons}
            markLessonCompleted={markLessonCompleted}
          />
        </main>
      </div>
    </div>
  )
}
