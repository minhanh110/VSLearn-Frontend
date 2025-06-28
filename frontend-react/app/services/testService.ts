import { API_BASE_URL } from '@/lib/constants';
import axiosInstance from './axios.config';
import Cookies from 'js-cookie';
import authService from './auth.service';

export interface TestQuestion {
  id: number;
  type: "multiple-choice" | "true-false" | "essay";
  videoUrl: string;
  imageUrl: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  trueFalseAnswer?: boolean;
  essayPrompt?: string;
}

export interface TestAnswer {
  questionId: number;
  answer: string;
  questionType: string;
}

export interface TestSubmissionRequest {
  userId: number;
  topicId: number;
  answers: TestAnswer[];
  score: number;
}

export interface NextTopicInfo {
  id: number;
  topicName: string;
  isAvailable: boolean;
}

export interface NextSubtopicInfo {
  id: number;
  subtopicName: string;
  topicId: number;
  topicName: string;
  isAvailable: boolean;
}

export interface TestSubmissionResponse {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  isPassed: boolean;
  topicCompleted: boolean;
  nextTopic: NextTopicInfo;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

class TestService {
  private baseUrl = API_BASE_URL;

  /**
   * Check if user is authenticated before making API calls
   */
  private checkAuthentication() {
    if (!authService.isAuthenticated()) {
      throw new Error('Authentication required. Please login to continue.');
    }
  }

  /**
   * Generate test questions for a specific topic
   */
  async generateTest(userId: number, topicId: number): Promise<TestQuestion[]> {
    try {
      this.checkAuthentication();
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/test/generate?userId=${userId}&topicId=${topicId}`
      );
      const result: ApiResponse<TestQuestion[]> = response.data;
      if (result.status !== 200) {
        throw new Error(result.message);
      }
      return result.data || [];
    } catch (error) {
      console.error('Error generating test:', error);
      throw error;
    }
  }

  /**
   * Submit test results
   */
  async submitTest(request: TestSubmissionRequest): Promise<TestSubmissionResponse> {
    try {
      this.checkAuthentication();
      const response = await axiosInstance.post(`${this.baseUrl}/api/test/submit`, request);
      const result: ApiResponse<TestSubmissionResponse> = response.data;
      if (result.status !== 200) {
        throw new Error(result.message);
      }
      return result.data!;
    } catch (error) {
      console.error('Error submitting test:', error);
      throw error;
    }
  }

  /**
   * Get next topic information
   */
  async getNextTopic(userId: number, currentTopicId: number): Promise<NextTopicInfo> {
    try {
      this.checkAuthentication();
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/test/next-topic?userId=${userId}&currentTopicId=${currentTopicId}`
      );
      const result: ApiResponse<NextTopicInfo> = response.data;
      if (result.status !== 200) {
        throw new Error(result.message);
      }
      return result.data!;
    } catch (error) {
      console.error('Error getting next topic:', error);
      throw error;
    }
  }

  /**
   * Get next subtopic information for a topic
   */
  async getNextSubtopic(topicId: number): Promise<NextSubtopicInfo> {
    try {
      this.checkAuthentication();
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/test/next-subtopic?topicId=${topicId}`
      );
      const result: ApiResponse<NextSubtopicInfo> = response.data;
      if (result.status !== 200) {
        throw new Error(result.message);
      }
      return result.data!;
    } catch (error) {
      console.error('Error getting next subtopic:', error);
      throw error;
    }
  }

  /**
   * Get topic name by topic ID
   */
  async getTopicName(topicId: number): Promise<string> {
    try {
      this.checkAuthentication();
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/test/topic-name?topicId=${topicId}`
      );
      const result: ApiResponse<string> = response.data;
      if (result.status !== 200) {
        throw new Error(result.message);
      }
      return result.data!;
    } catch (error) {
      console.error('Error getting topic name:', error);
      throw error;
    }
  }
}

export const testService = new TestService(); 