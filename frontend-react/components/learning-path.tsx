"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { LessonPopup } from "./lesson-popup"
import { TestPopup } from "./test-popup"

interface LearningPathProps {
  sidebarOpen?: boolean
}

export function LearningPath({ sidebarOpen = false }: LearningPathProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [selectedTest, setSelectedTest] = useState<number | null>(null)
  const lessonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({})

  // State để track completed lessons - FORCE lesson 1 và 2 completed
  const [completedLessons, setCompletedLessons] = useState<number[]>([1, 2])

  // Load completed lessons từ localStorage khi component mount
  useEffect(() => {
    // FORCE set lesson 1 và 2 là completed để test popup hiện
    setCompletedLessons([1, 2])
    localStorage.setItem("completedLessons", JSON.stringify([1, 2]))
  }, [])

  // Save completed lessons vào localStorage khi state thay đổi
  useEffect(() => {
    localStorage.setItem("completedLessons", JSON.stringify(completedLessons))
  }, [completedLessons])

  // Function để mark lesson as completed
  const markLessonCompleted = (lessonId: number) => {
    setCompletedLessons((prev) => {
      if (!prev.includes(lessonId)) {
        return [...prev, lessonId]
      }
      return prev
    })
  }

  // Listen for lesson completion events
  useEffect(() => {
    const handleLessonComplete = (event: CustomEvent) => {
      markLessonCompleted(event.detail.lessonId)
    }

    window.addEventListener("lessonCompleted", handleLessonComplete as EventListener)
    return () => {
      window.removeEventListener("lessonCompleted", handleLessonComplete as EventListener)
    }
  }, [])

  // Show scroll to top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
      // Close popup when scrolling
      if (selectedLesson) {
        setSelectedLesson(null)
      }
      if (selectedTest) {
        setSelectedTest(null)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [selectedLesson, selectedTest])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Lesson data with word counts
  const lessonData: Record<string, { title: string; wordCount: number }> = {
    "1": { title: "Bảng chữ cái", wordCount: 20 },
    "2": { title: "Chào hỏi cơ bản", wordCount: 15 },
    "4": { title: "Gia đình", wordCount: 18 },
    "5": { title: "Thức ăn và đồ uống", wordCount: 25 },
  }

  // Test data
  const testData: Record<string, { title: string; questionCount: number }> = {
    "3": { title: "Unit 1 Test", questionCount: 10 },
    "6": { title: "Unit 2 Test", questionCount: 12 },
  }

  const unit1Lessons = [
    { id: 1, isTest: false },
    { id: 2, isTest: false },
    { id: 3, isTest: true },
  ]

  const unit2Lessons = [
    { id: 4, isTest: false },
    { id: 5, isTest: false },
    { id: 6, isTest: true },
  ]

  // Function để get current lesson (lesson tiếp theo cần làm)
  const getCurrentLesson = (unitLessons: any[]) => {
    // Tìm lesson đầu tiên chưa completed trong unit
    for (const lesson of unitLessons) {
      if (!completedLessons.includes(lesson.id)) {
        return lesson.id
      }
    }
    // Nếu tất cả đã completed thì return null
    return null
  }

  // Function để check xem unit có bị lock không
  const isUnitLocked = (unitLessons: any[]) => {
    // Unit 1 luôn unlock
    if (unitLessons[0].id === 1) return false

    // Unit 2 cần Unit 1 hoàn thành (tất cả lessons trong unit1)
    if (unitLessons[0].id === 4) {
      return !unit1Lessons.every((lesson) => completedLessons.includes(lesson.id))
    }

    return false
  }

  // NEW: Function để check lesson có thể hiện popup không (tất cả lesson trong unit không khóa)
  const canShowPopup = (lessonId: number, unitLessons: any[]) => {
    // Nếu unit bị lock thì không hiện popup
    if (isUnitLocked(unitLessons)) return false

    // Unit không khóa thì tất cả lesson đều hiện popup
    return true
  }

  // NEW: Function để check lesson có available để làm không
  const isLessonAvailable = (lessonId: number, unitLessons: any[]) => {
    // Nếu unit bị lock thì không available
    if (isUnitLocked(unitLessons)) return false

    const currentLesson = getCurrentLesson(unitLessons)
    const isCompleted = completedLessons.includes(lessonId)

    // Available nếu: đã completed (có thể làm lại) HOẶC là current lesson
    return isCompleted || lessonId === currentLesson
  }

  const handleLessonClick = (lessonId: number, isTest: boolean, unitLessons: any[], event: React.MouseEvent) => {
    // Nếu unit bị locked thì không làm gì
    if (isUnitLocked(unitLessons)) {
      return
    }

    // Tất cả lesson trong unit không khóa đều hiện popup
    if (isTest) {
      setSelectedTest(lessonId)
    } else {
      setSelectedLesson(lessonId)
    }
  }

  const getPositionClass = (index: number) => {
    const positions = [
      "ml-8", // First lesson - left
      "mr-8", // Second lesson - right
      "ml-16", // Test - left more
    ]
    return positions[index] || "mx-auto"
  }

  // Function to get lesson number within unit and total lessons in unit
  const getLessonInfo = (lessonId: number, unitLessons: any[]) => {
    const lessonIndex = unitLessons.findIndex((lesson) => lesson.id === lessonId)
    const regularLessons = unitLessons.filter((lesson) => !lesson.isTest)
    const lessonNumber = regularLessons.findIndex((lesson) => lesson.id === lessonId) + 1
    return {
      lessonNumber,
      totalLessons: regularLessons.length,
    }
  }

  const renderUnit = (lessons: any[], unitNumber: number, title: string, description: string) => {
    const unitLocked = isUnitLocked(lessons)
    const currentLesson = getCurrentLesson(lessons)

    return (
      <div className="mb-16">
        {/* Unit header */}
        <div className="px-4 mb-8">
          <div
            className={`rounded-xl p-6 mx-auto max-w-md shadow-lg ${
              unitLocked ? "bg-gradient-to-r from-gray-200 to-gray-300" : "bg-gradient-to-r from-pink-200 to-purple-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-bold ${unitLocked ? "text-gray-600" : "text-gray-800"}`}>
                  Unit {unitNumber}
                  {unitLocked && <span className="ml-2">🔒</span>}
                </h2>
                <p className={`text-sm mt-1 ${unitLocked ? "text-gray-500" : "text-gray-600"}`}>{description}</p>
              </div>
              <Button
                className={`font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg border-0 ${
                  unitLocked
                    ? "bg-gray-300 hover:bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-gray-800"
                }`}
                disabled={unitLocked}
              >
                📖 GUIDEBOOK
              </Button>
            </div>
          </div>
        </div>

        {/* Lessons - Zigzag layout */}
        <div className="px-4">
          <div className="max-w-2xl mx-auto">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id)
              const isCurrent = lesson.id === currentLesson
              const canPopup = canShowPopup(lesson.id, lessons)
              const isAvailable = isLessonAvailable(lesson.id, lessons)

              return (
                <div key={lesson.id} className={`relative mb-12 ${getPositionClass(index)}`}>
                  {/* Lesson circle */}
                  <div
                    className="relative z-10 flex justify-center"
                    style={{ zIndex: selectedLesson === lesson.id || selectedTest === lesson.id ? 1000 : 10 }}
                  >
                    {unitLocked ? (
                      // Unit bị lock - hiển thị locked state
                      <div className="relative">
                        {lesson.isTest ? (
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
                        ) : (
                          <div className="relative">
                            <div className="w-20 h-20 rounded-full border-4 border-gray-400 flex items-center justify-center bg-gray-100">
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
                      // Unit không bị lock - hiển thị normal state
                      <div className="relative">
                        <button
                          ref={(el) => {
                            lessonRefs.current[lesson.id] = el
                          }}
                          onClick={(e) => handleLessonClick(lesson.id, lesson.isTest, lessons, e)}
                          className="block relative cursor-pointer"
                        >
                          <div className="relative hover:scale-105 transition-transform">
                            {lesson.isTest ? (
                              /* Test - màu dựa trên completed state */
                              <div className="relative">
                                <div
                                  className={`w-20 h-20 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all duration-500 ${
                                    isCompleted
                                      ? "border-yellow-500 bg-yellow-50"
                                      : isCurrent
                                        ? "border-orange-500 bg-orange-50 animate-pulse"
                                        : "border-gray-400 bg-gray-100"
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
                              </div>
                            ) : (
                              /* Regular lesson - màu dựa trên completed state */
                              <div className="relative">
                                <div
                                  className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                                    isCompleted
                                      ? "border-green-500 bg-green-50"
                                      : isCurrent
                                        ? "border-blue-500 bg-blue-50 animate-pulse"
                                        : "border-gray-400 bg-gray-100"
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
                        </button>

                        {/* LESSON POPUP - hiện cho tất cả lesson trong unit không khóa */}
                        {selectedLesson === lesson.id && !lesson.isTest && canPopup && (
                          <LessonPopup
                            isOpen={true}
                            onClose={() => setSelectedLesson(null)}
                            lessonNumber={getLessonInfo(selectedLesson, lessons).lessonNumber}
                            totalLessons={getLessonInfo(selectedLesson, lessons).totalLessons}
                            wordCount={lessonData[selectedLesson as keyof typeof lessonData]?.wordCount || 0}
                            lessonTitle={lessonData[selectedLesson as keyof typeof lessonData]?.title || ""}
                            position={
                              lessonRefs.current[selectedLesson]
                                ? {
                                    x:
                                      lessonRefs.current[selectedLesson]!.getBoundingClientRect().left +
                                      lessonRefs.current[selectedLesson]!.getBoundingClientRect().width / 2,
                                    y: lessonRefs.current[selectedLesson]!.getBoundingClientRect().top,
                                  }
                                : undefined
                            }
                            lessonId={selectedLesson}
                            isAvailable={isAvailable} // Pass availability status
                          />
                        )}

                        {/* TEST POPUP - hiện cho tất cả test trong unit không khóa */}
                        {selectedTest === lesson.id && lesson.isTest && canPopup && (
                          <TestPopup
                            isOpen={true}
                            onClose={() => setSelectedTest(null)}
                            testNumber={lesson.id}
                            questionCount={testData[selectedTest as keyof typeof testData]?.questionCount || 10}
                            testTitle={testData[selectedTest as keyof typeof testData]?.title || ""}
                            position={
                              lessonRefs.current[selectedTest]
                                ? {
                                    x:
                                      lessonRefs.current[selectedTest]!.getBoundingClientRect().left +
                                      lessonRefs.current[selectedTest]!.getBoundingClientRect().width / 2,
                                    y: lessonRefs.current[selectedTest]!.getBoundingClientRect().top,
                                  }
                                : undefined
                            }
                            testId={selectedTest}
                            isAvailable={isAvailable} // Pass availability status
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 overflow-hidden pb-20 lg:pb-8 pt-20">
      {/* Fixed decorative background elements - Only on desktop with NEW seaweed - shifts with sidebar */}
      <div className={`hidden lg:block fixed inset-0 pointer-events-none z-0`}>
        {/* Left seaweed - Full height with new design */}
        <div className="absolute left-16 top-0 bottom-0 w-48">
          <Image
            src="/images/seaweed-decoration-new.png"
            alt="Seaweed decoration"
            fill
            className="object-cover opacity-80"
          />
        </div>

        {/* Right seaweed - Full height with new design */}
        <div className="absolute right-16 top-0 bottom-0 w-48 scale-x-[-1]">
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
        className={`fixed right-8 lg:left-1/2 lg:ml-32 bottom-32 lg:top-1/2 lg:mt-8 lg:transform lg:-translate-y-1/2 z-10 pointer-events-none`}
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

        {/* Unit 2 */}
        {renderUnit(unit2Lessons, 2, "Unit 2", "Learn about food and drinks")}
      </div>
    </div>
  )
}
