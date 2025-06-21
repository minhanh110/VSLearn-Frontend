"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface TestPopupProps {
  isOpen: boolean
  onClose: () => void
  testNumber: number
  questionCount: number
  testTitle: string
  position?: { x: number; y: number }
  testId: number
}

export function TestPopup({ isOpen, onClose, testNumber, questionCount, testTitle, position, testId }: TestPopupProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Invisible overlay to detect clicks outside */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        className="fixed z-50"
        style={{
          left: position?.x ? `${position.x}px` : "50%",
          top: position?.y ? `${position.y + 90}px` : "50%",
          transform: position?.x ? "translateX(-50%)" : "translate(-50%, -50%)",
        }}
      >
        {/* Test popup design - similar to LessonPopup but with orange/yellow theme */}
        <div className="relative">
          {/* Orange/yellow pastel rounded popup */}
          <div className="bg-orange-50 rounded-lg px-3 py-3 text-center shadow-lg min-w-[200px] border-2 border-orange-200">
            {/* Test mascot */}
            <div className="flex justify-center mb-1">
              <Image
                src="/images/test-mascot-final.png"
                alt="Test mascot"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>

            {/* Main title */}
            <h2 className="text-sm font-bold text-orange-700 mb-1">KIỂM TRA KIẾN THỨC!</h2>

            {/* Test info */}
            <p className="text-orange-600 text-xs font-semibold mb-1">BÀI TEST: {testTitle.toUpperCase()}</p>

            {/* Question count */}
            <p className="text-orange-500 text-xs font-bold mb-2">{questionCount} CÂU HỎI</p>

            {/* Start test button */}
            <Link href={`/practice?testId=${testId}`} className="block">
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-1.5 px-3 rounded-md shadow-sm transition-all duration-200 hover:shadow-md text-xs"
                onClick={onClose}
              >
                BẮT ĐẦU TEST
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
