"use client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  itemName?: string
  isLoading?: boolean
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-blue-50/95 to-cyan-50/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8 max-w-md w-full mx-4 animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Mascot Character */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-4 shadow-lg">
              <div className="text-4xl">🤔</div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-2 leading-relaxed">{message}</p>

          {/* Item name if provided */}
          {itemName && (
            <p className="text-blue-700 font-semibold mb-6 bg-blue-50 rounded-lg py-2 px-4 border border-blue-200">
              "{itemName}"
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <Button
              onClick={onClose}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              QUAY VỀ
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ĐANG XÓA...
                </div>
              ) : (
                "XÓA"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
