const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface VideoProcessingRequest {
  video: File;
  expectedWord: string;
  category: string;
  difficulty: string;
}

export interface VideoProcessingResponse {
  taskId: string;
  status: string;
  message: string;
  expectedWord: string;
  category: string;
  difficulty: string;
}

export interface AIResponse {
  taskId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  result?: {
    predictedWord: string;
    confidence: number;
    overallAccuracy: number;
    feedback: string;
    suggestions: string[];
  };
  error?: string;
  createdAt: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  ai_service_available: boolean;
  timestamp: number;
  error?: string;
}

class AIServiceAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/ai`;
  }

  async processVideo(request: VideoProcessingRequest): Promise<VideoProcessingResponse> {
    const formData = new FormData();
    formData.append('video', request.video);
    formData.append('expectedWord', request.expectedWord);
    formData.append('category', request.category);
    formData.append('difficulty', request.difficulty);

    const response = await fetch(`${this.baseURL}/process-video`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process video');
    }

    return response.json();
  }

  async checkStatus(taskId: string): Promise<AIResponse> {
    const response = await fetch(`${this.baseURL}/status/${taskId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to check status');
    }

    return response.json();
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await fetch(`${this.baseURL}/health`);

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return response.json();
  }

  async testConnection(): Promise<{ message: string; timestamp: number }> {
    const response = await fetch(`${this.baseURL}/test`);

    if (!response.ok) {
      throw new Error('Test connection failed');
    }

    return response.json();
  }
}

export const aiServiceAPI = new AIServiceAPI(); 