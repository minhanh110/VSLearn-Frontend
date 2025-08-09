import { useState, useCallback, useEffect } from 'react';
import { aiServiceAPI, VideoProcessingRequest, AIResponse, HealthCheckResponse } from '@/lib/api/ai-service';

export interface UseAIServiceReturn {
  // States
  isProcessing: boolean;
  isAnalyzing: boolean;
  accuracy: number;
  taskId: string | null;
  aiResponse: AIResponse | null;
  error: string | null;
  healthStatus: HealthCheckResponse | null;
  
  // Actions
  processVideo: (request: VideoProcessingRequest) => Promise<void>;
  checkStatus: (taskId: string) => Promise<void>;
  resetState: () => void;
  checkHealth: () => Promise<void>;
}

export const useAIService = (): UseAIServiceReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);

  const processVideo = useCallback(async (request: VideoProcessingRequest) => {
    try {
      setIsProcessing(true);
      setError(null);
      setAccuracy(0);
      setAiResponse(null);

      const response = await aiServiceAPI.processVideo(request);
      setTaskId(response.taskId);
      setIsAnalyzing(true);

      // Start polling for status
      pollStatus(response.taskId);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process video');
      setIsProcessing(false);
      setIsAnalyzing(false);
    }
  }, []);

  const checkStatus = useCallback(async (taskId: string) => {
    try {
      const response = await aiServiceAPI.checkStatus(taskId);
      setAiResponse(response);

      // Update accuracy based on progress
      if (response.progress) {
        setAccuracy(response.progress);
      }

      // If completed or failed, stop analyzing
      if (response.status === 'completed' || response.status === 'failed') {
        setIsAnalyzing(false);
        setIsProcessing(false);
        
        if (response.status === 'failed') {
          setError(response.error || 'Processing failed');
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check status');
      setIsAnalyzing(false);
      setIsProcessing(false);
    }
  }, []);

  const pollStatus = useCallback((taskId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await aiServiceAPI.checkStatus(taskId);
        setAiResponse(response);

        // Update accuracy based on progress
        if (response.progress) {
          setAccuracy(response.progress);
        }

        // If completed or failed, stop polling
        if (response.status === 'completed' || response.status === 'failed') {
          clearInterval(pollInterval);
          setIsAnalyzing(false);
          setIsProcessing(false);
          
          if (response.status === 'failed') {
            setError(response.error || 'Processing failed');
          }
        }

      } catch (err) {
        clearInterval(pollInterval);
        setError(err instanceof Error ? err.message : 'Failed to check status');
        setIsAnalyzing(false);
        setIsProcessing(false);
      }
    }, 2000); // Poll every 2 seconds

    // Cleanup interval on unmount
    return () => clearInterval(pollInterval);
  }, []);

  const resetState = useCallback(() => {
    setIsProcessing(false);
    setIsAnalyzing(false);
    setAccuracy(0);
    setTaskId(null);
    setAiResponse(null);
    setError(null);
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const health = await aiServiceAPI.healthCheck();
      setHealthStatus(health);
    } catch (err) {
      setHealthStatus({
        status: 'unhealthy',
        ai_service_available: false,
        timestamp: Date.now(),
        error: err instanceof Error ? err.message : 'Health check failed'
      });
    }
  }, []);

  // Check health on mount
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    isProcessing,
    isAnalyzing,
    accuracy,
    taskId,
    aiResponse,
    error,
    healthStatus,
    processVideo,
    checkStatus,
    resetState,
    checkHealth,
  };
}; 