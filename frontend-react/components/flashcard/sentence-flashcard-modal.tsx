"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Question {
  id: number;
  type: "multiple-choice" | "sentence-building";
  videoUrl: string;
  imageUrl: string;
  question: string;
  options?: { text: string; videoUrl?: string; imageUrl?: string }[];
  correctAnswer: string;
  words?: string[];
  correctSentence?: string[];
}

interface SentenceFlashcardModalProps {
  isOpen: boolean;
  question: Question | null;
  onClose: () => void;
}

export function SentenceFlashcardModal({ isOpen, question, onClose }: SentenceFlashcardModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen || !question) return null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleContinue = () => {
    setIsFlipped(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4">
        <div className="relative">
          {/* Flashcard Container */}
          <div className="relative w-full max-w-lg aspect-square">
            <div
              className={`relative w-full h-full cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              onClick={handleFlip}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front Side - Video */}
              <div
                className={`absolute inset-0 w-full h-full backface-hidden ${
                  isFlipped ? "opacity-0" : "opacity-100"
                } transition-opacity duration-300`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-3xl border-4 border-blue-400 shadow-2xl p-8 flex items-center justify-center relative overflow-hidden">
                  {/* Decorative border stars */}
                  <div className="absolute top-4 left-4 w-6 h-6 text-yellow-400">⭐</div>
                  <div className="absolute top-4 right-4 w-5 h-5 text-blue-400">⭐</div>
                  <div className="absolute bottom-4 left-4 w-5 h-5 text-green-400">⭐</div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 text-purple-400">⭐</div>

                  {/* Video content */}
                  <div className="w-full h-full flex items-center justify-center">
                    {question.videoUrl ? (
                      <video
                        src={question.videoUrl}
                        className="w-full h-full object-cover rounded-2xl"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <Image
                        src={question.imageUrl || ""}
                        alt="Sentence demonstration"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Back Side - Sentence */}
              <div
                className={`absolute inset-0 w-full h-full backface-hidden ${
                  isFlipped ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300`}
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-3xl border-4 border-purple-400 shadow-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Decorative border stars */}
                  <div className="absolute top-4 left-4 w-6 h-6 text-yellow-400">⭐</div>
                  <div className="absolute top-4 right-4 w-5 h-5 text-blue-400">⭐</div>
                  <div className="absolute bottom-4 left-4 w-5 h-5 text-green-400">⭐</div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 text-purple-400">⭐</div>

                  {/* Sentence content */}
                  <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">
                    {question.correctAnswer}
                  </h1>
                  <p className="text-base text-gray-700 font-medium text-center">
                    Click để xem video và ghi nhớ câu này
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 text-center">
            <p className="text-blue-700 font-semibold text-lg mb-2">
              Học câu trước khi ghép
            </p>
            <p className="text-gray-600 text-sm mb-4">
              Click vào card để xem câu hoàn chỉnh
            </p>
            
            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              BẮT ĐẦU GHÉP CÂU
            </Button>
          </div>
        </div>
      </div>
    </>
  );
} 