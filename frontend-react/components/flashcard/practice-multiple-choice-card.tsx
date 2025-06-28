"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface Question {
  id: number;
  videoUrl?: string;
  imageUrl?: string;
  question: string;
  options: { text: string; videoUrl?: string; imageUrl?: string }[];
  correctAnswer: string;
}

interface PracticeMultipleChoiceCardProps {
  question: Question;
  onContinue: () => void;
  isLastQuestion?: boolean;
}

export function PracticeMultipleChoiceCard({ question, onContinue, isLastQuestion }: PracticeMultipleChoiceCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [videoError, setVideoError] = useState(false);

  console.log("🔍 PracticeMultipleChoiceCard render:");
  console.log("  - question.id:", question.id);
  console.log("  - isLastQuestion:", isLastQuestion);
  console.log("  - isCorrect:", isCorrect);
  console.log("  - showPopup:", showPopup);
  console.log("  - onContinue function:", typeof onContinue);

  // Reset state khi sang câu mới
  useEffect(() => {
    console.log("🔄 PracticeMultipleChoiceCard: Resetting state for question", question.id);
    console.log("  - Previous state - selectedAnswer:", selectedAnswer);
    console.log("  - Previous state - isCorrect:", isCorrect);
    console.log("  - Previous state - showPopup:", showPopup);
    
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setShowPopup(false);
    setVideoError(false);
    
    console.log("  - State reset completed");
  }, [question.id]);

  const handleSelectAnswer = (answer: string) => {
    console.log("🎯 PracticeMultipleChoiceCard: handleSelectAnswer called with:", answer);
    console.log("  - correct answer:", question.correctAnswer);
    console.log("  - isCorrect (before):", isCorrect);
    console.log("  - question ID:", question.id);
    console.log("  - all options:", question.options.map(opt => opt.text));
    
    if (isCorrect) return;
    setSelectedAnswer(answer);
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setShowPopup(true);
    
    console.log("  - isCorrect (after):", correct);
    console.log("  - showPopup set to true");
    console.log("  - Answer check result:", correct ? "CORRECT" : "WRONG");
  };

  const handleContinue = () => {
    console.log("🎯 PracticeMultipleChoiceCard handleContinue called");
    console.log("  - isLastQuestion:", isLastQuestion);
    console.log("  - isCorrect:", isCorrect);
    setShowPopup(false);
    onContinue();
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setShowPopup(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    console.warn("Video failed to load, showing fallback");
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Video/Image Container - giống practice-page */}
        <div className="flex justify-center mb-4">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden border-4 border-blue-300 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
            {/* Decorative elements */}
            <div className="absolute top-2 left-2 w-4 h-4 text-yellow-400 z-10">⭐</div>
            <div className="absolute top-2 right-2 w-3 h-3 text-blue-400 z-10">⭐</div>
            <div className="absolute bottom-2 left-2 w-3 h-3 text-green-400 z-10">⭐</div>
            <div className="absolute bottom-2 right-2 w-4 h-4 text-purple-400 z-10">⭐</div>
            {/* Video hoặc Image chính của câu hỏi */}
            <div className="absolute inset-4 rounded-xl overflow-hidden bg-blue-900 flex items-center justify-center">
              {question.videoUrl && !videoError ? (
                <video 
                  src={question.videoUrl} 
                  controls 
                  className="w-full h-full object-contain"
                  onError={handleVideoError}
                />
              ) : (
                <Image 
                  src={question.imageUrl || "/placeholder.svg"} 
                  alt="Sign language demonstration" 
                  fill 
                  className="object-cover" 
                />
              )}
            </div>
          </div>
        </div>
        {/* Question */}
        <h2 className="text-xl sm:text-2xl font-bold text-blue-700 text-center mb-6">{question.question}</h2>
        {/* Multiple Choice Questions */}
        <div className="mb-6 grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-md mx-auto">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(option.text)}
              disabled={isCorrect}
              className={`relative py-2 sm:py-3 px-3 sm:px-4 rounded-full border-2 border-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-200 font-bold text-blue-700 text-center text-sm sm:text-base whitespace-nowrap ${
                selectedAnswer === option.text
                  ? option.text === question.correctAnswer
                    ? "bg-green-100 border-green-500 text-green-700"
                    : "bg-red-100 border-red-500 text-red-700"
                  : ""
              }`}
            >
              <span>{option.text}</span>
              {selectedAnswer === option.text && (
                <span className="absolute -top-1 -right-1">
                  {option.text === question.correctAnswer ? (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4 -4" /></svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  )}
                </span>
              )}
            </button>
          ))}
        </div>
        {/* Popup feedback lớn giống practice-page */}
        {showPopup && (
          <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xs mx-4">
              <div className={`rounded-2xl px-6 py-6 text-center shadow-2xl border-4 ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                {/* Whale mascot */}
                <div className="flex justify-center mb-4">
                  <Image
                    src={isCorrect ? "/images/whale-happy.png" : "/images/whale-sad.png"}
                    alt={isCorrect ? "Happy whale" : "Sad whale"}
                    width={80}
                    height={80}
                    className="object-contain animate-bounce"
                  />
                </div>
                {/* Main title */}
                <h2 className={`text-xl font-bold mb-2 ${isCorrect ? "text-green-700" : "text-red-700"}`}>{isCorrect ? "CHÍNH XÁC!" : "CHƯA ĐÚNG!"}</h2>
                {/* Result message */}
                <p className={`text-base font-semibold mb-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}>{isCorrect ? "Bạn đã trả lời đúng" : "Hãy thử lại nhé"}</p>
                {/* Correct answer for wrong answers */}
                {!isCorrect && (
                  <p className="text-red-500 text-sm font-bold mb-6">Đáp án: {question.correctAnswer}</p>
                )}
                {isCorrect && <div className="mb-6"></div>}
                {/* Continue/Retry button */}
                {isCorrect ? (
                  <Button
                    onClick={() => {
                      console.log("🎯 Completion button clicked!");
                      console.log("  - isLastQuestion:", isLastQuestion);
                      console.log("  - About to call handleContinue...");
                      handleContinue();
                      console.log("  - handleContinue called successfully");
                    }}
                    className="w-full font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl text-base bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    {isLastQuestion ? (console.log("🟢 Rendering 'Hoàn thành' button"), "Hoàn thành") : (console.log("🟡 Rendering 'Tiếp tục' button"), "Tiếp tục")}
                  </Button>
                ) : (
                  <Button
                    onClick={handleRetry}
                    className="w-full font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl text-base bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    Làm lại
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 