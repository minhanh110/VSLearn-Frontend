"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Lock } from "lucide-react"
import Link from "next/link"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  returnUrl?: string
}

export function LoginModal({ 
  isOpen, 
  onClose, 
  returnUrl
}: LoginModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Modal content */}
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-blue-200 p-6 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Đăng nhập để làm bài test!
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Bạn cần đăng nhập để làm bài test. Hãy đăng nhập để tiếp tục!
            </p>

            {/* Features list */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Lợi ích khi đăng nhập:</h3>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Làm bài test và kiểm tra kiến thức
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Theo dõi tiến độ học tập
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Lưu kết quả và điểm số
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Truy cập tất cả bài học và chủ đề
                </li>
              </ul>
            </div>

            {/* Action button */}
            <div className="mb-4">
              <Link href={returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login'}>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
                  ĐĂNG NHẬP NGAY
                </Button>
              </Link>
            </div>

            {/* Secondary action */}
            <button
              onClick={onClose}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Có thể sau
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 