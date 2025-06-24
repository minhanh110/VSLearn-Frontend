"use client"

import { useState, useEffect } from 'react'
import { PracticeMultipleChoiceCard } from './practice-multiple-choice-card'
import { FlashcardService, type PracticeQuestion } from '@/app/services/flashcard.service'

interface Flashcard {
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

interface PracticeGroupProps {
  practiceCards: Flashcard[];
  allCards: Flashcard[];
  onContinue: () => void;
  subtopicId: string;
}

export function PracticeGroup({ practiceCards, allCards, onContinue, subtopicId }: PracticeGroupProps) {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [questionKey, setQuestionKey] = useState(0);

  // Load practice questions from backend
  useEffect(() => {
    const loadPracticeQuestions = async () => {
      try {
        setIsLoading(true);
        // Tìm start và end index dựa trên practiceCards
        const startIndex = allCards.findIndex(card => card.id === practiceCards[0]?.id);
        const endIndex = startIndex + practiceCards.length;
        
        if (startIndex >= 0 && practiceCards.length > 0) {
          const backendQuestions = await FlashcardService.getPracticeQuestions(subtopicId, startIndex, endIndex);
          if (backendQuestions.length > 0) {
            setQuestions(backendQuestions);
            return;
          }
        }
        
        // Fallback: tạo questions ở frontend nếu backend không có data
        const frontendQuestions = practiceCards.map((card) => {
          const correctOption = {
            text: card.back.word,
          };
          // Lấy các card sai (ưu tiên trong đoạn vừa học, nếu thiếu thì lấy toàn bộ)
          let distractorPool = practiceCards.filter(c => c.id !== card.id);
          if (distractorPool.length < 3) {
            distractorPool = distractorPool.concat(
              allCards.filter(c => c.id !== card.id && !distractorPool.some(dc => dc.id === c.id))
            );
          }
          const distractorOptions = distractorPool
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(c => ({
              text: c.back.word,
            }));
          const options = [correctOption, ...distractorOptions].sort(() => 0.5 - Math.random());
          return {
            id: card.id,
            videoUrl: card.front.content,
            imageUrl: card.front.type === "image" ? card.front.content : undefined,
            question: "Đây là từ gì?",
            options,
            correctAnswer: correctOption.text,
          };
        }).sort(() => 0.5 - Math.random()); // random thứ tự câu hỏi
        
        setQuestions(frontendQuestions);
      } catch (error) {
        console.error('Failed to load practice questions:', error);
        // Fallback to frontend logic
        const frontendQuestions = practiceCards.map((card) => {
          const correctOption = {
            text: card.back.word,
          };
          let distractorPool = practiceCards.filter(c => c.id !== card.id);
          if (distractorPool.length < 3) {
            distractorPool = distractorPool.concat(
              allCards.filter(c => c.id !== card.id && !distractorPool.some(dc => dc.id === c.id))
            );
          }
          const distractorOptions = distractorPool
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(c => ({
              text: c.back.word,
            }));
          const options = [correctOption, ...distractorOptions].sort(() => 0.5 - Math.random());
          return {
            id: card.id,
            videoUrl: card.front.content,
            imageUrl: card.front.type === "image" ? card.front.content : undefined,
            question: "Đây là từ gì?",
            options,
            correctAnswer: correctOption.text,
          };
        }).sort(() => 0.5 - Math.random());
        
        setQuestions(frontendQuestions);
      } finally {
        setIsLoading(false);
      }
    };

    if (practiceCards.length > 0) {
      loadPracticeQuestions();
    }
  }, [practiceCards, allCards, subtopicId]);

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setQuestionKey(prev => prev + 1);
    } else {
      setCurrentIdx(0);
      setQuestionKey(prev => prev + 1);
      onContinue();
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-blue-700 text-lg font-semibold">Đang tải câu hỏi...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <p className="text-red-600 text-lg font-semibold">Không có câu hỏi nào</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <PracticeMultipleChoiceCard
        key={questionKey}
        question={questions[currentIdx]}
        onContinue={handleNext}
        isLastQuestion={currentIdx === questions.length - 1}
      />
      <div className="mt-4 text-blue-700 font-semibold">
        Câu {currentIdx + 1} / {questions.length}
      </div>
    </div>
  );
} 