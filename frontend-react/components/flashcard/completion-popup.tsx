"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface CompletionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  onNext: () => void;
  onSentenceBuilding?: () => void;
  subtopicName: string;
  hasNextSubtopic?: boolean;
  hasSentenceBuilding?: boolean;
  isAllSubtopicsCompleted?: boolean;
}

export function CompletionPopup({ 
  isOpen, 
  onClose, 
  onRetry, 
  onNext, 
  onSentenceBuilding,
  subtopicName,
  hasNextSubtopic = false,
  hasSentenceBuilding = false,
  isAllSubtopicsCompleted = false
}: CompletionPopupProps) {
  if (!isOpen) return null;

  // Debug logs
  console.log("🎯 CompletionPopup props:", {
    isOpen,
    hasNextSubtopic,
    hasSentenceBuilding,
    subtopicName
  });
  
  console.log("🔍 Button visibility check:");
  console.log("  - hasNextSubtopic:", hasNextSubtopic);
  console.log("  - hasSentenceBuilding:", hasSentenceBuilding);
  console.log("  - onSentenceBuilding exists:", !!onSentenceBuilding);
  console.log("  - onNext exists:", !!onNext);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md text-center shadow-2xl border-4 border-green-300 relative">
        {/* Celebration mascot */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/whale-happy.png"
            alt="Happy whale"
            width={100}
            height={100}
            className="object-contain animate-bounce"
          />
        </div>
        
        {/* Congratulations message */}
        <h1 className="text-2xl font-bold text-green-700 mb-4">🎉 CHÚC MỪNG! 🎉</h1>
        <p className="text-lg font-semibold text-blue-700 mb-2">Bạn đã hoàn thành</p>
        <p className="text-xl font-bold text-blue-800 mb-6">{subtopicName}</p>
        
        {/* Navigation buttons */}
        <div className="flex flex-col gap-3">
          {hasSentenceBuilding && onSentenceBuilding && (
            <Button 
              onClick={onSentenceBuilding}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🔤 Luyện tập ghép câu
            </Button>
          )}
          
          <Button 
            onClick={onRetry}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            🔄 Học lại subtopic này
          </Button>
          
          {/* Luôn hiển thị nút tiếp theo - nếu có next subtopic thì học tiếp, không thì làm bài test */}
          <Button 
            onClick={onNext}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {hasNextSubtopic ? "➡️ Học tiếp subtopic kế" : "📝 Làm bài test"}
          </Button>
          
          <Link href="/homepage">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              🏠 Về trang chủ
            </Button>
          </Link>
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
} 