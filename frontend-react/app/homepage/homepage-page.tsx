"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LearningPath } from "@/components/learning-path"

import axiosInstance from "@/app/services/axios.config"
import authService from "@/app/services/auth.service"
import { FlashcardService } from "@/app/services/flashcard.service"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [units, setUnits] = useState([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userType, setUserType] = useState<'guest' | 'registered' | 'premium'>('guest')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Kiểm tra token expiration
        if (authService.isTokenExpiringSoon()) {
          authService.logout();
          router.push('/login');
          return;
        }
        
        // Xác định loại user
        const token = authService.getCurrentToken()
        const isAuthenticated = authService.isAuthenticated()
        
        if (!isAuthenticated || !token) {
          setUserType('guest')
        } else {
          // Kiểm tra subscription status từ backend
          try {
            const subscriptionRes = await axios.get("http://localhost:8080/users/subscription-status", {
              headers: { 'Authorization': `Bearer ${token}` }
            })
            
            if (subscriptionRes.data && subscriptionRes.data.data) {
              const subscriptionData = subscriptionRes.data.data
              setUserType(subscriptionData.userType)
            } else {
              setUserType('registered')
            }
          } catch (subscriptionError: any) {
            if (subscriptionError.message === 'Network Error' || subscriptionError.code === 'ERR_NETWORK') {
              setUserType('guest')
            } else if (subscriptionError.response?.status === 401 || subscriptionError.response?.status === 403) {
              authService.logout()
              setUserType('guest')
            } else {
              setUserType('registered')
            }
          }
        }
        
        // Gọi API learning-path để lấy dữ liệu units
        const headers: Record<string, string> = {}
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const res1 = await axiosInstance.get("/learning-path", { headers })
        if (res1.data && res1.data.data) {
          setUnits(res1.data.data)
          
          // Extract completed lessons từ units
          const allCompletedLessons: string[] = [];
          res1.data.data.forEach((unit: any) => {
            unit.lessons.forEach((lesson: any) => {
              if (lesson.isCompleted) {
                allCompletedLessons.push(lesson.id.toString());
              }
            });
          });
          setCompletedLessons(allCompletedLessons);
        } else {
          setUnits([])
        }
      } catch (error: any) {
        setError(error.message || "Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  // Refresh data when returning from test result page
  useEffect(() => {
    const handleFocus = () => {
      const testResults = sessionStorage.getItem("testResults");
      if (testResults) {
        try {
          const results = JSON.parse(testResults);
          if (results.accuracy >= 90) {
            window.location.reload();
          }
        } catch {}
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Kiểm tra token định kỳ mỗi phút
  useEffect(() => {
    const interval = setInterval(() => {
      if (authService.isTokenExpiringSoon()) {
        authService.logout();
        router.push('/login');
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [router]);

  const markLessonCompleted = async (lessonId: string) => {
    try {
      await axiosInstance.post("/progress", { lessonId: parseInt(lessonId) })
      setCompletedLessons((prev) => prev.includes(lessonId) ? prev : [...prev, lessonId])
    } catch (err) {
      // no-op
    }
  }

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

  // Hiển thị thông tin khi không có units
  if (!units || units.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-yellow-600 mb-2">Không có dữ liệu</h2>
          <p className="text-gray-600 mb-4">
            Không tìm thấy units trong database.
          </p>
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
                </a> để học thêm chủ đề hoặc 
                <a href="/packages" className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1">
                  mua gói học
                </a> để truy cập tất cả!
              </p>
            </div>
          </div>
        </div>
      )}

      {userType === 'registered' && (
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
                {units.length <= 2 && (
                  <span className="block mt-1 text-xs text-green-600">
                    Hiện tại chỉ có {units.length} chủ đề trong hệ thống.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Thông báo cho subscription expired */}
      {userType === 'registered' && units.length > 2 && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-orange-700">
                <strong>Gói học đã hết hạn:</strong> Bạn chỉ có thể học 2 chủ đề đầu tiên. 
                <a href="/packages" className="font-medium underline text-orange-700 hover:text-orange-600 ml-1">
                  Gia hạn gói học
                </a> để tiếp tục truy cập tất cả chủ đề!
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
            userType={userType}
          />
        </main>
      </div>
    </div>
  )
}

