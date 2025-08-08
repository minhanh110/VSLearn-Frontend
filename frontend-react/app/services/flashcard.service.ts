import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const API_BASE_URL = '/api/v1';

export interface Flashcard {
  id: number;
  front: {
    type: "video" | "image";
    content: string;
    title: string;
  };
  back: {
    word: string;
    description: string;
  };
}

export interface TimelineStep {
  type: "flashcard" | "practice";
  index?: number;
  start?: number;
  end?: number;
}

export interface PracticeQuestion {
  id: number;
  videoUrl?: string;
  imageUrl?: string;
  question: string;
  options: { text: string; videoUrl?: string; imageUrl?: string }[];
  correctAnswer: string;
}

export interface SentenceBuildingQuestion {
  id: number;
  videoUrl?: string;
  imageUrl?: string;
  question: string;
  words: string[];
  correctSentence: string[];
  correctAnswer: string;
}

export interface ProgressRequest {
  completedFlashcards: number[];
  completedPractice: boolean;
  completedPractices?: string[];
  userChoice?: 'continue' | 'review';
  userId: string;
}

export interface ProgressResponse {
  success: boolean;
  message: string;
  completedFlashcards: number[];
  completedPractice: boolean;
  completedPractices?: string[];
  userChoice?: string;
  progressPercentage: number;
}

export interface LearningAnalytics {
  userId: string;
  totalSubtopicCompleted: number;
  totalFlashcardsStudied: number;
  totalPracticeQuestionsAnswered: number;
  averageAccuracy: number;
  subtopicProgress: Array<{
    subtopicId: string;
    subtopicName: string;
    progressPercentage: number;
    completed: boolean;
    flashcardsStudied: number;
    totalFlashcards: number;
    accuracy: number;
  }>;
  dailyStudyTime: Record<string, number>;
  weakAreas: string[];
}

export interface SubtopicInfo {
  id: number;
  subTopicName: string;
  topicId: string;
  topicName: string;
  status: string;
  totalFlashcards: number;
}

export interface NextSubtopicInfo {
  hasNext: boolean;
  nextSubtopicId?: string;
  nextSubtopicName?: string;
  topicName?: string;
}

export class FlashcardService {
  // Lấy thông tin subtopic
  static async getSubtopicInfo(subtopicId: string) {
    const response = await fetch(`${API_BASE_URL}/flashcards/subtopic/${subtopicId}/info`);
    if (!response.ok) {
      throw new Error('Failed to fetch subtopic info');
    }
    return response.json();
  }

  // Lấy subtopic tiếp theo
  static async getNextSubtopic(currentSubtopicId: string): Promise<NextSubtopicInfo> {
    try {
      const response = await fetch(`${API_BASE_URL}/flashcards/subtopic/${currentSubtopicId}/next`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.warn('Next subtopic API failed:', error);
    }
    
    // Fallback: return no next subtopic
    return {
      hasNext: false
    };
  }

  // Lấy flashcards của subtopic
  static async getFlashcards(subtopicId: string): Promise<Flashcard[]> {
    const response = await fetch(`${API_BASE_URL}/flashcards/subtopic/${subtopicId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch flashcards');
    }
    return response.json();
  }

  // Lấy timeline từ backend
  static async getTimeline(subtopicId: string): Promise<TimelineStep[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/flashcards/subtopic/${subtopicId}/timeline`);
      if (response.ok) {
        const data = await response.json();
        return data.timeline || [];
      }
    } catch (error) {
      console.warn('Timeline API failed, using frontend logic');
    }
    return [];
  }

  // Lấy practice questions từ backend cho range cụ thể
  static async getPracticeQuestions(subtopicId: string, start: number, end: number): Promise<PracticeQuestion[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/flashcards/subtopic/${subtopicId}/practice?start=${start}&end=${end}`);
      if (response.ok) {
        const data = await response.json();
        return data.questions || [];
      }
    } catch (error) {
      console.warn('Practice questions API failed, using frontend logic');
    }
    return [];
  }

  // Lấy sentence building questions từ backend
  static async getSentenceBuildingQuestions(subtopicId: string): Promise<SentenceBuildingQuestion[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/flashcards/subtopic/${subtopicId}/sentence-building`);
      if (response.ok) {
        const data = await response.json();
        return data || [];
      }
    } catch (error) {
      console.warn('Sentence building API failed, using fallback data');
    }
    return [];
  }

  // Kiểm tra topic có sentence building không
  static async hasSentenceBuildingForTopic(topicId: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/flashcards/topic/${topicId}/has-sentence-building`);
      if (response.ok) {
        const data = await response.json();
        return data.hasSentenceBuilding || false;
      }
    } catch (error) {
      console.warn('Sentence building check API failed:', error);
    }
    return false;
  }

  // Lấy sentence building questions cho topic
  static async getSentenceBuildingQuestionsForTopic(topicId: number): Promise<SentenceBuildingQuestion[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/flashcards/topic/${topicId}/sentence-building`);
      if (response.ok) {
        const data = await response.json();
        return data || [];
      }
    } catch (error) {
      console.warn('Sentence building questions API failed:', error);
    }
    return [];
  }

  // Lưu trạng thái học tập
  static async saveProgress(subtopicId: string, progress: ProgressRequest): Promise<ProgressResponse> {
    try {
      // Lấy userId từ JWT token
      const token = Cookies.get('token');
      let userId = 'default-user';
      if (token) {
        try {
          const decoded = jwtDecode(token) as any;
          userId = decoded.id || 'default-user';
        } catch (error) {
          console.warn('Failed to decode token:', error);
        }
      }

      const response = await fetch(`${API_BASE_URL}/flashcards/subtopic/${subtopicId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...progress,
          userId: userId
        }),
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.warn('Progress API not available:', error);
      // Return mock response for now
      return {
        success: false,
        message: 'Progress API not available',
        completedFlashcards: progress.completedFlashcards,
        completedPractice: progress.completedPractice,
        userChoice: progress.userChoice,
        progressPercentage: 0
      };
    }
  }

  // Lấy trạng thái học tập
  static async getProgress(subtopicId: string): Promise<ProgressResponse> {
    try {
      // Lấy userId từ JWT token
      const token = Cookies.get('token');
      let userId = 'default-user';
      if (token) {
        try {
          const decoded = jwtDecode(token) as any;
          userId = decoded.id || 'default-user';
        } catch (error) {
          console.warn('Failed to decode token:', error);
        }
      }

      const response = await fetch(`${API_BASE_URL}/flashcards/subtopic/${subtopicId}/progress?userId=${userId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Progress API not available');
    }
    
    // Return empty progress if API not available
    return {
      success: false,
      message: 'Progress API not available',
      completedFlashcards: [],
      completedPractice: false,
      userChoice: undefined,
      progressPercentage: 0
    };
  }

  // Lấy learning analytics
  static async getLearningAnalytics(userId: string): Promise<LearningAnalytics> {
    try {
      const response = await fetch(`${API_BASE_URL}/flashcards/user/${userId}/learning-analytics`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Learning analytics API not available');
    }
    
    // Return empty analytics if API not available
    return {
      userId,
      totalSubtopicCompleted: 0,
      totalFlashcardsStudied: 0,
      totalPracticeQuestionsAnswered: 0,
      averageAccuracy: 0,
      subtopicProgress: [],
      dailyStudyTime: {},
      weakAreas: []
    };
  }

  // Lấy tất cả progress của user
  static async getUserProgress(userId: string): Promise<{completedSubtopicIds: number[]}> {
    try {
      const response = await fetch(`${API_BASE_URL}/flashcards/user/progress?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        return {
          completedSubtopicIds: data.completedSubtopicIds || []
        };
      }
    } catch (error) {
      console.warn('User progress API not available:', error);
    }
    
    // Return empty progress if API not available
    return {
      completedSubtopicIds: []
    };
  }
} 
