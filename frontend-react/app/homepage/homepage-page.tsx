"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LearningPath } from "@/components/learning-path"
import axiosInstance from "@/app/services/axios.config"
import authService from "@/app/services/auth.service"

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [units, setUnits] = useState([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userType, setUserType] = useState<'guest' | 'registered' | 'premium'>('guest')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log("🔄 Fetching learning path data...")
        
        // Xác định loại user
        const token = authService.getCurrentToken()
        const isAuthenticated = authService.isAuthenticated()
        
        if (!isAuthenticated) {
          setUserType('guest')
          console.log("👤 User type: Guest (no authentication)")
        } else {
          // Kiểm tra subscription status từ backend
          try {
            const subscriptionRes = await axiosInstance.get("/users/subscription-status", {
              headers: { 'Authorization': `Bearer ${token}` }
            })
            
            if (subscriptionRes.data && subscriptionRes.data.data) {
              const subscriptionData = subscriptionRes.data.data
              setUserType(subscriptionData.userType)
              console.log("👤 User type:", subscriptionData.userType)
              console.log("👤 Has subscription:", subscriptionData.hasSubscription)
            } else {
              setUserType('registered')
              console.log("👤 User type: Registered user (fallback)")
            }
          } catch (subscriptionError) {
            console.warn("⚠️ Error fetching subscription status:", subscriptionError)
            setUserType('registered')
            console.log("👤 User type: Registered user (fallback)")
          }
        }
        
        // Gọi API learning-path để lấy dữ liệu units từ database
        const headers: Record<string, string> = {}
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const res1 = await axiosInstance.get("/learning-path", { headers })
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

      {/* User Type Notification */}
      {userType === 'guest' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Chế độ khách:</strong> Bạn chỉ có thể học chủ đề đầu tiên. 
                <a href="/login" className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1">
                  Đăng nhập
                </a> để học thêm chủ đề!
              </p>
            </div>
          </div>
        </div>
      )}

      {userType === 'registered' && units.length <= 2 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Tài khoản miễn phí:</strong> Bạn có thể học 2 chủ đề đầu tiên. 
                <a href="/packages" className="font-medium underline text-blue-700 hover:text-blue-600 ml-1">
                  Nâng cấp gói học
                </a> để truy cập tất cả chủ đề!
              </p>
            </div>
          </div>
        </div>
      )}

      {userType === 'premium' && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Gói học Premium:</strong> Bạn có thể truy cập tất cả chủ đề học tập!
              </p>
            </div>
          </div>
        </div>
      )}

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
