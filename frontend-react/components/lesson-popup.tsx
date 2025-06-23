"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface LessonPopupProps {
  isOpen: boolean
  onClose: () => void
  lessonNumber: number
  totalLessons: number
  wordCount: number
  lessonTitle: string
  position?: { x: number; y: number }
  lessonId: number
  subtopicId?: number
  direction?: "up" | "down"
}

export function LessonPopup({
  isOpen,
  onClose,
  lessonNumber,
  totalLessons,
  wordCount,
  lessonTitle,
  position,
  lessonId,
  subtopicId,
  direction = "down",
}: LessonPopupProps) {
  console.log("LessonPopup props:", { lessonId, subtopicId, lessonTitle, direction });
  
  if (!isOpen) return null

  return (
    <>
      {/* Invisible overlay to detect clicks outside */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        className="fixed z-50"
        style={{
          left: position?.x ? `${position.x}px` : "50%",
          top: direction === "up"
            ? position?.y
              ? `${position.y - 190}px` // hiển thị phía trên
              : "50%"
            : position?.y
              ? `${position.y + 90}px` // hiển thị phía dưới
              : "50%",
          transform: position?.x ? "translateX(-50%)" : "translate(-50%, -50%)",
        }}
      >
        {/* New popup design - very small */}
        <div className="relative">
          {/* Blue pastel rounded popup - very small */}
          <div className="bg-blue-50 rounded-lg px-3 py-3 text-center shadow-lg min-w-[180px] border-2 border-blue-200">
            {/* New Study mascot - very small */}
            <div className="flex justify-center mb-1">
              <Image
                src="/images/study-mascot-new.png"
                alt="Study mascot"
                width={45}
                height={45}
                className="object-contain"
              />
            </div>

            {/* Main title - very small */}
            <h2 className="text-sm font-bold text-blue-700 mb-1">BẮT ĐẦU HỌC NHÉ !!!</h2>

            {/* Lesson topic - very small */}
            <p className="text-blue-600 text-xs font-semibold mb-1">CHỦ ĐỀ: {lessonTitle.toUpperCase()}</p>

            {/* Word count - very small */}
            <p className="text-blue-500 text-xs font-bold mb-2">{wordCount} TỪ VỰNG</p>

            {/* Start button - very small */}
            <Link href={`/flashcard?subtopicId=${subtopicId || lessonId}`} className="block">
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-1.5 px-3 rounded-md shadow-sm transition-all duration-200 hover:shadow-md text-xs"
                onClick={() => {
                  console.log("Navigating to flashcard with subtopicId:", subtopicId || lessonId);
                  onClose();
                }}
              >
                BẮT ĐẦU
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
