"use client"

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { FeedbackService } from '@/app/services/feedback.service'

interface TopicRatingProps {
  topicId: number
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function TopicRating({ topicId, showCount = false, size = 'md' }: TopicRatingProps) {
  const [averageRating, setAverageRating] = useState<number>(0)
  const [ratingCount, setRatingCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRating = async () => {
      try {
        const [avgRating, feedbackList] = await Promise.all([
          FeedbackService.getAverageRatingByTopicId(topicId),
          FeedbackService.getFeedbackByTopicId(topicId)
        ])
        
        setAverageRating(avgRating)
        setRatingCount(feedbackList.length)
      } catch (error) {
        console.error('Error loading topic rating:', error)
        setAverageRating(0)
        setRatingCount(0)
      } finally {
        setLoading(false)
      }
    }

    loadRating()
  }, [topicId])

  const getStarSize = () => {
    switch (size) {
      case 'sm': return 16
      case 'lg': return 24
      default: return 20
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-1">
        <div className="animate-pulse bg-gray-200 rounded h-4 w-20"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={getStarSize()}
            className={`${
              star <= averageRating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      {showCount && ratingCount > 0 && (
        <span className="text-sm text-gray-500 ml-1">
          ({averageRating.toFixed(1)}, {ratingCount} đánh giá)
        </span>
      )}
    </div>
  )
} 