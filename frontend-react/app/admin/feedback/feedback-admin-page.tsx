"use client"

import { useState, useEffect } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Star } from 'lucide-react'
import { FeedbackService, FeedbackResponse } from '@/app/services/feedback.service'

export function FeedbackAdminPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [allFeedback, setAllFeedback] = useState<FeedbackResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        // Load feedback for all topics (you might want to create a new API endpoint for this)
        const topicIds = [1, 2, 3, 4, 5, 6, 7, 8] // Hardcoded for now
        const allFeedbackData: FeedbackResponse[] = []
        
        for (const topicId of topicIds) {
          try {
            const feedback = await FeedbackService.getFeedbackByTopicId(topicId)
            allFeedbackData.push(...feedback)
          } catch (error) {
            console.error(`Error loading feedback for topic ${topicId}:`, error)
          }
        }
        
        setAllFeedback(allFeedbackData)
      } catch (error) {
        console.error('Error loading feedback:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeedback()
  }, [])

  const filteredFeedback = selectedTopicId 
    ? allFeedback.filter(f => f.topicId === selectedTopicId)
    : allFeedback

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Đang tải dữ liệu feedback...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-100 relative overflow-hidden">
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-700 mb-4">Quản lý Feedback</h1>
            <p className="text-gray-600">Xem và quản lý tất cả phản hồi từ người dùng</p>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-blue-200 mb-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Lọc theo topic:</label>
              <select
                value={selectedTopicId || ''}
                onChange={(e) => setSelectedTopicId(e.target.value ? Number(e.target.value) : null)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Tất cả topics</option>
                {Array.from(new Set(allFeedback.map(f => f.topicId))).map(topicId => {
                  const feedback = allFeedback.find(f => f.topicId === topicId)
                  return (
                    <option key={topicId} value={topicId}>
                      {feedback?.topicName || `Topic ${topicId}`}
                    </option>
                  )
                })}
              </select>
              <span className="text-sm text-gray-500">
                {filteredFeedback.length} phản hồi
              </span>
            </div>
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {filteredFeedback.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-lg border-2 border-blue-200">
                <p className="text-gray-500 text-lg">Chưa có phản hồi nào</p>
              </div>
            ) : (
              filteredFeedback.map((feedback) => (
                <div key={feedback.id} className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {feedback.topicName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Bởi {feedback.createdBy} • {formatDate(feedback.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRatingStars(feedback.rating)}
                      <span className="text-sm font-medium text-gray-700">
                        {feedback.rating}/5
                      </span>
                    </div>
                  </div>
                  
                  {feedback.feedbackContent && (
                    <div className="mb-4">
                      <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm">
                        "{feedback.feedbackContent}"
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Điểm: {feedback.totalPoint}</span>
                    <span>ID: {feedback.id}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default FeedbackAdminPage 