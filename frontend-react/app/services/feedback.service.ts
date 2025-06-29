import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface FeedbackRequest {
  topicId: number;
  rating: number;
  feedbackContent?: string;
}

export interface FeedbackResponse {
  id: number;
  topicId: number;
  topicName: string;
  rating: number;
  feedbackContent?: string;
  totalPoint: number;
  createdBy: string;
  createdAt: string;
  message?: string;
}

export class FeedbackService {
  /**
   * Submit feedback for a topic
   */
  static async submitFeedback(request: FeedbackRequest, userId: number): Promise<FeedbackResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/feedback/submit`, request, {
        params: { userId },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  /**
   * Get all feedback for a specific topic
   */
  static async getFeedbackByTopicId(topicId: number): Promise<FeedbackResponse[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/feedback/topic/${topicId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting feedback by topic ID:', error);
      throw error;
    }
  }

  /**
   * Get feedback by user ID
   */
  static async getFeedbackByUserId(userId: number): Promise<FeedbackResponse[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/feedback/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting feedback by user ID:', error);
      throw error;
    }
  }

  /**
   * Get average rating for a topic
   */
  static async getAverageRatingByTopicId(topicId: number): Promise<number> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/feedback/topic/${topicId}/average-rating`);
      return response.data;
    } catch (error) {
      console.error('Error getting average rating by topic ID:', error);
      throw error;
    }
  }
} 