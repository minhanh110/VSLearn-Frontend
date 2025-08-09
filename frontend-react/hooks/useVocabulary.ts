import { useState, useEffect, useCallback } from 'react';
import { vocabularyServiceAPI, VocabularyWord } from '@/lib/api/vocabulary-service';

export interface UseVocabularyReturn {
  vocabulary: VocabularyWord[];
  currentWord: VocabularyWord | null;
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadVocabulary: () => Promise<void>;
  setCurrentWord: (word: VocabularyWord) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goToRandom: () => void;
  goToIndex: (index: number) => void;
  searchByCategory: (category: string) => Promise<void>;
  searchByDifficulty: (difficulty: string) => Promise<void>;
  resetToAll: () => Promise<void>;
}

export const useVocabulary = (): UseVocabularyReturn => {
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [currentWord, setCurrentWord] = useState<VocabularyWord | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVocabulary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading vocabulary from API...');
      const response = await vocabularyServiceAPI.getAllVocabulary(0, 50);
      console.log('API Response:', response);
      
      if (response.content && response.content.length > 0) {
        console.log('Setting vocabulary from API:', response.content.length, 'items');
        setVocabulary(response.content);
        setCurrentWord(response.content[0]);
        setCurrentIndex(0);
      } else {
        console.log('No vocabulary data available');
        setVocabulary([]);
        setCurrentWord(null);
        setCurrentIndex(0);
        setError('No vocabulary data available');
      }
    } catch (err) {
      console.error('API Error:', err);
      setVocabulary([]);
      setCurrentWord(null);
      setCurrentIndex(0);
      setError(err instanceof Error ? err.message : 'Failed to load vocabulary');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const goToNext = useCallback(() => {
    if (vocabulary.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % vocabulary.length;
    setCurrentIndex(nextIndex);
    setCurrentWord(vocabulary[nextIndex]);
  }, [vocabulary, currentIndex]);

  const goToPrevious = useCallback(() => {
    if (vocabulary.length === 0) return;
    
    const prevIndex = currentIndex === 0 ? vocabulary.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentWord(vocabulary[prevIndex]);
  }, [vocabulary, currentIndex]);

  const goToRandom = useCallback(() => {
    if (vocabulary.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * vocabulary.length);
    setCurrentIndex(randomIndex);
    setCurrentWord(vocabulary[randomIndex]);
  }, [vocabulary]);

  const goToIndex = useCallback((index: number) => {
    if (vocabulary.length === 0 || index < 0 || index >= vocabulary.length) return;
    
    setCurrentIndex(index);
    setCurrentWord(vocabulary[index]);
  }, [vocabulary]);

  const searchByCategory = useCallback(async (category: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await vocabularyServiceAPI.getVocabularyByCategory(category);
      if (results.length > 0) {
        setVocabulary(results);
        setCurrentWord(results[0]);
        setCurrentIndex(0);
      } else {
        setVocabulary([]);
        setCurrentWord(null);
        setCurrentIndex(0);
        setError(`No vocabulary found for category: ${category}`);
      }
    } catch (err) {
      setVocabulary([]);
      setCurrentWord(null);
      setCurrentIndex(0);
      setError(err instanceof Error ? err.message : 'Failed to search by category');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchByDifficulty = useCallback(async (difficulty: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await vocabularyServiceAPI.getVocabularyByDifficulty(difficulty);
      if (results.length > 0) {
        setVocabulary(results);
        setCurrentWord(results[0]);
        setCurrentIndex(0);
      } else {
        setVocabulary([]);
        setCurrentWord(null);
        setCurrentIndex(0);
        setError(`No vocabulary found for difficulty: ${difficulty}`);
      }
    } catch (err) {
      setVocabulary([]);
      setCurrentWord(null);
      setCurrentIndex(0);
      setError(err instanceof Error ? err.message : 'Failed to search by difficulty');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetToAll = useCallback(async () => {
    await loadVocabulary();
  }, [loadVocabulary]);

  // Load vocabulary on mount
  useEffect(() => {
    loadVocabulary();
  }, [loadVocabulary]);

  return {
    vocabulary,
    currentWord,
    currentIndex,
    isLoading,
    error,
    loadVocabulary,
    setCurrentWord,
    goToNext,
    goToPrevious,
    goToRandom,
    goToIndex,
    searchByCategory,
    searchByDifficulty,
    resetToAll,
  };
}; 