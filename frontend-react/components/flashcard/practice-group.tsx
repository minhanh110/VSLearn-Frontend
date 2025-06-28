"use client"

import { useState, useEffect, useMemo } from "react"
import { PracticeMultipleChoiceCard } from "./practice-multiple-choice-card"
import { type Flashcard } from "@/app/services/flashcard.service"

interface PracticeGroupProps {
  practiceCards: Flashcard[];
  allCards: Flashcard[];
  onContinue: () => void;
  subtopicId: string;
}

export function PracticeGroup({ practiceCards, allCards, onContinue, subtopicId }: PracticeGroupProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  console.log("🔍 PracticeGroup render:");
  console.log("  - currentQuestionIndex:", currentQuestionIndex);
  console.log("  - practiceCards.length:", practiceCards.length);
  console.log("  - onContinue function:", typeof onContinue);

  // Tạo câu hỏi từ practice cards
  const questions = useMemo(() => {
    console.log("🔄 PracticeGroup: Creating questions from", practiceCards.length, "cards");
    console.log("  - Practice cards:", practiceCards.map(c => ({ id: c.id, word: c.back.word })));
    
    return practiceCards.map((card, index) => {
      console.log(`  - Creating question ${index + 1} for card ID ${card.id}, word: ${card.back.word}`);
      
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
      
      const question = {
        id: card.id,
        videoUrl: card.front.content,
        imageUrl: card.front.type === "image" ? card.front.content : "",
        question: "Đây là từ gì?",
        options,
        correctAnswer: correctOption.text,
      };
      
      console.log(`  - Question ${index + 1} created:`, {
        id: question.id,
        correctAnswer: question.correctAnswer,
        options: question.options.map(opt => opt.text)
      });
      
      return question;
    }).sort(() => 0.5 - Math.random()); // Khôi phục random thứ tự câu hỏi
  }, [practiceCards, allCards]);

  const currentQuestion = useMemo(() => {
    console.log("🔄 PracticeGroup: Getting current question at index", currentQuestionIndex);
    const question = questions[currentQuestionIndex];
    if (question) {
      console.log("  - Question ID:", question.id);
      console.log("  - Correct answer:", question.correctAnswer);
      console.log("  - Options:", question.options.map(opt => opt.text));
    }
    return question;
  }, [questions, currentQuestionIndex]);

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  console.log("🔍 PracticeGroup: isLastQuestion =", isLastQuestion, "(currentQuestionIndex:", currentQuestionIndex, "questions.length:", questions.length, ")");

  const handleContinue = () => {
    console.log("🎯 PracticeGroup handleContinue called");
    console.log("  - currentQuestionIndex:", currentQuestionIndex);
    console.log("  - questions.length:", questions.length);
    console.log("  - isLastQuestion:", isLastQuestion);
    
    if (isLastQuestion) {
      // Hoàn thành practice session
      console.log("✅ This is the last question, calling onContinue");
      console.log("  - onContinue function type:", typeof onContinue);
      console.log("  - About to call onContinue...");
      onContinue();
      console.log("  - onContinue called successfully");
    } else {
      // Chuyển sang câu hỏi tiếp theo
      console.log("➡️ Moving to next question");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 text-lg font-semibold">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <PracticeMultipleChoiceCard
        question={currentQuestion}
        onContinue={handleContinue}
        isLastQuestion={isLastQuestion}
      />
      
      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
        <span className="text-blue-700 font-semibold text-sm">
          Câu {currentQuestionIndex + 1} / {questions.length}
        </span>
      </div>
    </div>
  );
} 