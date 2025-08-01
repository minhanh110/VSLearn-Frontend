"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check, X, Clock, RefreshCw } from "lucide-react"
import api from "@/lib/axios"

interface VietQRResponse {
  qrCodeUrl: string
  qrCodeImage: string
  transactionCode: string
  amount: number
  bankId: string
  accountNo: string
  accountName: string
  description: string
  status: string
  message: string
}

export function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFailureModal, setShowFailureModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [vietQRData, setVietQRData] = useState<VietQRResponse | null>(null)
  const [checkingPayment, setCheckingPayment] = useState(false)
  const [mockQRPattern, setMockQRPattern] = useState<boolean[]>([])

  // Mock package data - in real app, get from searchParams or API
  const packageData = {
    title: "Gói Premium 1 Năm",
    subtitle: "Truy cập không giới hạn tất cả khóa học",
    price: 299000,
    duration: "12 tháng",
    features: [
      "Truy cập không giới hạn",
      "Tất cả khóa học cao cấp",
      "Kiểm tra tiến độ",
      "Chứng chỉ hoàn thành",
      "Hỗ trợ ưu tiên",
    ],
  }

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Tạo VietQR khi component mount
  useEffect(() => {
    createVietQR()
  }, [])

  // Tạo mock QR pattern khi component mount
  useEffect(() => {
    const pattern = Array.from({ length: 64 }, () => Math.random() > 0.5)
    setMockQRPattern(pattern)
  }, [])

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Tạo VietQR code
  const createVietQR = async () => {
    setLoading(true)
    try {
      // Test connection trước
      try {
        const testResponse = await api.get('/payment/test')
        console.log('Test connection:', testResponse.data)
      } catch (testError) {
        console.error('Test connection failed:', testError)
      }

      const response = await api.post('/payment/vietqr/create', {
        bankId: 'MB', // Vietcombank
        accountNo: '0356682909', // Số tài khoản thực
        accountName: 'PHAM MINH QUOC', // Tên chủ tài khoản
        amount: packageData.price,
        description: `VSLearn - ${packageData.title}`,
        packageName: packageData.title,
        packageDuration: packageData.duration,
        userId: 1 // Lấy từ auth
      })

      console.log('VietQR Response:', response.data) // Debug log

      if (response.data.success) {
        setVietQRData(response.data.data)
        console.log('QR Code URL:', response.data.data.qrCodeImage) // Debug log
      } else {
        console.error('Lỗi tạo QR code:', response.data.message)
      }
    } catch (error) {
      console.error('Lỗi tạo QR code:', error)
    } finally {
      setLoading(false)
    }
  }

  // Kiểm tra trạng thái thanh toán
  const checkPaymentStatus = async () => {
    if (!vietQRData?.transactionCode) return

    setCheckingPayment(true)
    try {
      const response = await api.get(`/payment/status/${vietQRData.transactionCode}`)
      
      if (response.data.success && response.data.isPaid) {
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error('Lỗi kiểm tra thanh toán:', error)
    } finally {
      setCheckingPayment(false)
    }
  }

  // Auto check payment status every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (vietQRData?.transactionCode) {
        checkPaymentStatus()
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [vietQRData])

  const handleStartLearning = () => {
    setShowSuccessModal(false)
    router.push("/homepage")
  }

  const handleTryAgain = () => {
    setShowFailureModal(false)
    createVietQR()
  }

  const handleSupport = () => {
    setShowFailureModal(false)
    alert("Chuyển đến trang hỗ trợ...")
  }

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content */}
      <div className="flex pt-16">
        {/* Sidebar Navigation */}
        <div className="hidden lg:block w-64 bg-blue-100 min-h-screen p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-blue-200 rounded-lg">
              <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">
                <span className="text-white text-sm">📚</span>
              </div>
              <span className="text-blue-800 font-medium">Học theo chủ đề</span>
            </div>
            <div className="flex items-center gap-3 p-3 hover:bg-blue-150 rounded-lg cursor-pointer">
              <div className="w-6 h-6 bg-blue-300 rounded flex items-center justify-center">
                <span className="text-white text-sm">📖</span>
              </div>
              <span className="text-blue-800">Từ điển</span>
            </div>
            <div className="flex items-center gap-3 p-3 hover:bg-blue-150 rounded-lg cursor-pointer">
              <div className="w-6 h-6 bg-blue-300 rounded flex items-center justify-center">
                <span className="text-white text-sm">📹</span>
              </div>
              <span className="text-blue-800">Thực hành Camera</span>
            </div>
            <div className="flex items-center gap-3 p-3 hover:bg-blue-150 rounded-lg cursor-pointer">
              <div className="w-6 h-6 bg-blue-300 rounded flex items-center justify-center">
                <span className="text-white text-sm">💰</span>
              </div>
              <span className="text-blue-800">Các gói học</span>
            </div>
            <div className="flex items-center gap-3 p-3 hover:bg-blue-150 rounded-lg cursor-pointer">
              <div className="w-6 h-6 bg-blue-300 rounded flex items-center justify-center">
                <span className="text-white text-sm">⚙️</span>
              </div>
              <span className="text-blue-800">Cài đặt</span>
            </div>
          </div>
        </div>

        {/* Payment Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-2xl mx-auto">
            {/* Payment Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-200">
              {/* Package Info */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-blue-800 mb-2">{packageData.title}</h1>
                <p className="text-blue-600 mb-4">{packageData.subtitle}</p>
                <div className="text-4xl font-bold text-blue-700 mb-2">₫{packageData.price.toLocaleString()}</div>
                <p className="text-blue-500">Quét mã QR để thanh toán</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-8">
                <div className="bg-white p-6 rounded-2xl border-2 border-blue-200 shadow-lg">
                  {loading ? (
                    <div className="w-48 h-48 bg-blue-50 rounded-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : vietQRData?.qrCodeImage ? (
                    <div className="w-48 h-48 flex items-center justify-center">
                      <img 
                        src={vietQRData.qrCodeImage} 
                        alt="VietQR Code"
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => {
                          console.error('Lỗi tải QR code:', e);
                          console.log('QR Code URL:', vietQRData.qrCodeImage);
                          // Fallback to mock QR code
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.mock-qr-fallback');
                          if (fallback) {
                            fallback.classList.remove('hidden');
                          }
                        }}
                      />
                      {/* Fallback mock QR code */}
                      <div className="mock-qr-fallback hidden w-48 h-48 bg-blue-50 rounded-lg flex items-center justify-center">
                        <div className="grid grid-cols-8 gap-1">
                          {mockQRPattern.map((isBlack, i) => (
                            <div key={i} className={`w-2 h-2 ${isBlack ? "bg-blue-800" : "bg-white"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-blue-50 rounded-lg flex items-center justify-center">
                      <div className="grid grid-cols-8 gap-1">
                        {mockQRPattern.map((isBlack, i) => (
                          <div key={i} className={`w-2 h-2 ${isBlack ? "bg-blue-800" : "bg-white"}`} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction Info */}
              {vietQRData && (
                <div className="text-center mb-6">
                  <p className="text-sm text-blue-600 mb-2">Mã giao dịch: {vietQRData.transactionCode}</p>
                  <p className="text-sm text-blue-600 mb-2">Ngân hàng: {vietQRData.bankId}</p>
                  <p className="text-sm text-blue-600 mb-2">Tài khoản: {vietQRData.accountNo}</p>
                  <p className="text-sm text-blue-600 mb-2">Nội dung: {vietQRData.description}</p>
                </div>
              )}

              {/* Timer */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-medium">Thời gian còn lại:</span>
                  <span className="text-blue-800 font-bold text-lg">{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Check Payment Button */}
              <div className="text-center mb-8">
                <Button
                  onClick={checkPaymentStatus}
                  disabled={checkingPayment || !vietQRData}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg flex items-center gap-2 mx-auto"
                >
                  {checkingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Đang kiểm tra...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Kiểm tra thanh toán
                    </>
                  )}
                </Button>
              </div>

              {/* Payment Instructions */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-blue-800 mb-4">Hướng dẫn thanh toán</h3>

                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="text-blue-700">Mở ứng dụng ngân hàng trên điện thoại của bạn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="text-blue-700">Chọn chức năng "Quét mã QR" hoặc "QR Pay"</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="text-blue-700">Quét mã QR ở trên và xác nhận thanh toán</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <div>
                    <p className="text-blue-700">Nhấn "Kiểm tra thanh toán" để xác nhận</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Chúc Mừng!</h3>
            <p className="text-blue-600 mb-6">
              Thanh toán thành công! Bạn đã mở khóa được hành trình học ngôn ngữ ký hiệu đầy thú vị
            </p>

            {/* Package Info */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <h4 className="font-bold text-blue-800 mb-4">Gói học trong vòng {packageData.duration}</h4>
              <ul className="text-left space-y-2">
                {packageData.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-blue-700">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Start Learning Button */}
            <Button
              onClick={handleStartLearning}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg"
            >
              Bắt Đầu Học Ngay
            </Button>
          </div>
        </div>
      )}

      {/* Failure Modal */}
      {showFailureModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-red-600 mb-4">Oops! Có lỗi xảy ra</h3>
            <p className="text-blue-600 mb-6">
              Thanh toán không thành công. Đừng lo lắng, chúng tôi sẽ giúp bạn giải quyết vấn đề này!
            </p>

            {/* Error Reasons */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
              <h4 className="font-bold text-red-700 mb-4">Có thể do những nguyên nhân sau:</h4>
              <ul className="text-left space-y-2 text-sm">
                <li className="flex items-start gap-2 text-red-600">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2"></div>
                  <span>Thông tin thẻ không chính xác hoặc hết hạn</span>
                </li>
                <li className="flex items-start gap-2 text-red-600">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2"></div>
                  <span>Tài khoản không đủ số dư</span>
                </li>
                <li className="flex items-start gap-2 text-red-600">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2"></div>
                  <span>Vượt quá hạn mức giao dịch hàng ngày</span>
                </li>
                <li className="flex items-start gap-2 text-red-600">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2"></div>
                  <span>Lỗi kết nối mạng hoặc máy chủ giao dịch offline</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleTryAgain}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-2xl"
              >
                Thử Lại
              </Button>
              <Button
                onClick={handleSupport}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-2xl"
              >
                Hỗ Trợ
              </Button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-blue-500 text-sm font-medium mb-2">Đội Phương Thức</p>
            </div>

            {/* Support Contact */}
            <div className="bg-blue-50 rounded-2xl p-4">
              <p className="text-blue-600 text-sm mb-2">Cần trợ giúp ngay?</p>
              <p className="text-blue-700 font-medium text-sm">📞 Hotline: 1900 xxxx • ✉️ vslearn@gmail.com</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default PaymentPage