"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronUp, Trophy } from "lucide-react"
import { useState, useEffect } from "react"

interface LearningPathProps {
  sidebarOpen?: boolean
}

export function LearningPath({ sidebarOpen = false }: LearningPathProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Show scroll to top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const unit1Lessons = [
    { id: 1, completed: true, current: false, locked: false },
    { id: 2, completed: true, current: false, locked: false },
    { id: 3, completed: false, current: true, locked: false, isTest: true },
  ]

  const unit2Lessons = [
    { id: 4, completed: false, current: false, locked: true },
    { id: 5, completed: false, current: false, locked: true },
    { id: 6, completed: false, current: false, locked: true, isTest: true },
  ]

  const getPositionClass = (index: number) => {
    const positions = [
      "ml-8", // First lesson - left
      "mr-8", // Second lesson - right
      "ml-16", // Test - left more
    ]
    return positions[index] || "mx-auto"
  }

  const renderUnit = (lessons: any[], unitNumber: number, title: string, description: string, isLocked = false) => (
    <div className="mb-16">
      {/* Unit header */}
      <div className="px-4 mb-8">
        <div
          className={`rounded-xl p-6 mx-auto max-w-md shadow-lg ${
            isLocked ? "bg-gradient-to-r from-gray-200 to-gray-300" : "bg-gradient-to-r from-pink-200 to-purple-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-bold ${isLocked ? "text-gray-600" : "text-gray-800"}`}>
                Unit {unitNumber}
                {isLocked && <span className="ml-2">🔒</span>}
              </h2>
              <p className={`text-sm mt-1 ${isLocked ? "text-gray-500" : "text-gray-600"}`}>{description}</p>
            </div>
            <Button
              className={`font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg border-0 ${
                isLocked
                  ? "bg-gray-300 hover:bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-gray-800"
              }`}
              disabled={isLocked}
            >
              📖 GUIDEBOOK
            </Button>
          </div>
        </div>
      </div>

      {/* Lessons - Zigzag layout */}
      <div className="px-4">
        <div className="max-w-2xl mx-auto">
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className={`relative mb-12 ${getPositionClass(index)}`}>
              {/* Lesson circle */}
              <div className="relative z-10 flex justify-center">
                {lesson.locked ? (
                  <div className="relative">
                    {lesson.isTest ? (
                      /* Locked Test - bo tròn */
                      <div className="relative">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full border-4 border-gray-400 flex items-center justify-center bg-gray-100 overflow-hidden">
                            <div className="w-16 h-16 rounded-full overflow-hidden">
                              <Image
                                src="/images/test-mascot-final.png"
                                alt="Test"
                                width={64}
                                height={64}
                                className="object-cover w-full h-full grayscale opacity-50"
                              />
                            </div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-gray-600 text-2xl">🔒</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Locked regular lesson */
                      <div>
                        <div className="w-20 h-20 rounded-full border-4 border-gray-400 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <Image
                              src="/images/lesson-button.png"
                              alt="Lesson mascot"
                              width={64}
                              height={64}
                              className="object-cover w-full h-full grayscale opacity-50"
                            />
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-gray-600 text-2xl">🔒</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href={`/lesson/${lesson.id}`} className="block">
                    <div className="relative cursor-pointer hover:scale-105 transition-transform">
                      {lesson.isTest ? (
                        /* Test - bo tròn với màu sắc */
                        <div className="relative">
                          <div
                            className={`w-20 h-20 rounded-full border-4 flex items-center justify-center overflow-hidden ${
                              lesson.completed ? "border-green-500 bg-green-50" : "border-gray-400 bg-gray-50"
                            }`}
                          >
                            <div className="w-16 h-16 rounded-full overflow-hidden">
                              <Image
                                src="/images/test-mascot-final.png"
                                alt="Test"
                                width={64}
                                height={64}
                                className="object-cover w-full h-full hover:scale-110 transition-transform"
                              />
                            </div>
                          </div>

                          {/* Trophy icon for test */}
                          <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                            <Trophy className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      ) : (
                        /* Regular lesson */
                        <div>
                          <div
                            className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${
                              lesson.completed ? "border-green-500" : "border-gray-400"
                            }`}
                          >
                            <div className="w-16 h-16 rounded-full overflow-hidden">
                              <Image
                                src="/images/lesson-button.png"
                                alt="Lesson mascot"
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 overflow-hidden pb-20 lg:pb-8 pt-20">
      {/* Fixed decorative background elements - Only on desktop with NEW seaweed - shifts with sidebar */}
      <div
        className={`hidden lg:block fixed inset-0 pointer-events-none z-0 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}
      >
        {/* Left seaweed - Full height with new design */}
        <div className="absolute left-12 top-0 bottom-0 w-48">
          <Image
            src="/images/seaweed-decoration-new.png"
            alt="Seaweed decoration"
            fill
            className="object-cover opacity-80"
          />
        </div>

        {/* Right seaweed - Full height with new design */}
        <div className="absolute right-12 top-0 bottom-0 w-48 scale-x-[-1]">
          <Image
            src="/images/seaweed-decoration-new.png"
            alt="Seaweed decoration"
            fill
            className="object-cover opacity-80"
          />
        </div>

        {/* Enhanced bubbles */}
        <div className="absolute left-1/4 top-32 w-5 h-5 bg-blue-200 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute right-1/3 top-48 w-4 h-4 bg-cyan-200 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute left-1/2 top-80 w-6 h-6 bg-blue-100 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute right-1/4 bottom-48 w-7 h-7 bg-cyan-100 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute left-1/3 bottom-64 w-5 h-5 bg-blue-300 rounded-full opacity-60 animate-pulse"></div>
      </div>

      {/* BIGGER Fixed whale character - shifts with sidebar but not too far */}
      <div
        className={`fixed right-8 lg:left-1/2 lg:ml-32 bottom-32 lg:top-1/2 lg:mt-8 lg:transform lg:-translate-y-1/2 z-10 pointer-events-none transition-all duration-300 ${sidebarOpen ? "lg:ml-48" : "lg:ml-32"}`}
      >
        <div className="animate-bounce">
          <Image
            src="/images/whale-with-book-new.png"
            alt="Whale with book"
            width={100}
            height={100}
            className="lg:w-32 lg:h-32 object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Beautiful scroll to top button - không chèn lên footer */}
      {showScrollTop && (
        <div className="fixed bottom-20 lg:bottom-8 right-8 z-20">
          <Button
            onClick={scrollToTop}
            className="group relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-0 overflow-hidden"
            size="sm"
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-75"></div>

            {/* Arrow icon */}
            <ChevronUp className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform duration-200" />

            {/* Subtle inner shadow */}
            <div className="absolute inset-1 rounded-full border border-white/10"></div>
          </Button>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 pt-8">
        {/* Unit 1 */}
        {renderUnit(unit1Lessons, 1, "Unit 1", "Form basic sentences, greet people")}

        {/* Unit 2 - Locked */}
        {renderUnit(unit2Lessons, 2, "Unit 2", "Learn about food and drinks", true)}
      </div>
    </div>
  )
}
