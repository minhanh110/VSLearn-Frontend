"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Crown, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  userType: 'guest' | 'registered'
  currentTopicCount: number
  maxTopicCount: number
}

export function UpgradeModal({ 
  isOpen, 
  onClose, 
  userType, 
  currentTopicCount, 
  maxTopicCount
}: UpgradeModalProps) {
  if (!isOpen) return null

  const getTitle = () => {
    if (userType === 'guest') {
      return "Đăng nhập để học thêm!"
    }
    return "Nâng cấp gói học để truy cập tất cả chủ đề!"
  }

  const getDescription = () => {
    if (userType === 'guest') {
      return "Bạn đang ở chế độ khách và chỉ có thể học chủ đề đầu tiên. Đăng nhập để học thêm chủ đề!"
    }
    return `Bạn đã học ${currentTopicCount}/${maxTopicCount} chủ đề miễn phí. Nâng cấp gói học để truy cập tất cả chủ đề!`
  }

  const getActionButton = () => {
    if (userType === 'guest') {
      return (
        <Link href="/login">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
            ĐĂNG NHẬP NGAY
          </Button>
        </Link>
      )
    }
    return (
      <Link href="/packages">
        <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
          NÂNG CẤP NGAY
        </Button>
      </Link>
    )
  }

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
              {userType === 'guest' ? (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8 text-yellow-600" />
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              {getTitle()}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {getDescription()}
            </p>

            {/* Features list */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Lợi ích khi nâng cấp:</h3>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Truy cập tất cả chủ đề học tập
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Bài học nâng cao và chuyên sâu
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Thực hành với camera AI
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Hỗ trợ 24/7 từ đội ngũ chuyên gia
                </li>
              </ul>
            </div>

            {/* Action button */}
            <div className="mb-4">
              {getActionButton()}
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