const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface VocabularyWord {
  id: string;
  vocab: string; // Tên từ vựng
  meaning: string; // Nghĩa của từ
  category: string; // Area name hoặc SubTopic name
  videoUrl: string; // VocabArea video URL
  description: string; // VocabArea description
  difficulty?: "easy" | "medium" | "hard"; // Có thể tính từ sortOrder hoặc area
  subTopicName?: string;
  topicName?: string;
  areaName?: string;
}

export interface VocabularyResponse {
  content: VocabularyWord[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

class VocabularyServiceAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api`;
  }

  async getAllVocabulary(page: number = 0, size: number = 20): Promise<VocabularyResponse> {
    const response = await fetch(`${this.baseURL}/v1/vocab?page=${page}&size=${size}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch vocabulary: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    // Transform the response to match our interface
    return {
      content: data.content || [],
      totalElements: data.totalElements || 0,
      totalPages: data.totalPages || 0,
      currentPage: data.currentPage || 0
    };
  }

  async getVocabularyById(id: string): Promise<VocabularyWord> {
    const response = await fetch(`${this.baseURL}/v1/vocab/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch vocabulary by ID');
    }

    return response.json();
  }

  async getVocabularyByCategory(category: string): Promise<VocabularyWord[]> {
    const response = await fetch(`${this.baseURL}/v1/vocab/category/${category}`);

    if (!response.ok) {
      throw new Error('Failed to fetch vocabulary by category');
    }

    return response.json();
  }

  async getVocabularyByDifficulty(difficulty: string): Promise<VocabularyWord[]> {
    const response = await fetch(`${this.baseURL}/v1/vocab/difficulty/${difficulty}`);

    if (!response.ok) {
      throw new Error('Failed to fetch vocabulary by difficulty');
    }

    return response.json();
  }

  async searchVocabulary(query: string): Promise<VocabularyWord[]> {
    const response = await fetch(`${this.baseURL}/v1/vocab/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error('Failed to search vocabulary');
    }

    return response.json();
  }
}

export const vocabularyServiceAPI = new VocabularyServiceAPI(); 