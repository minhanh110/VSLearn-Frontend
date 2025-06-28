"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronUp, Lock } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { LessonPopup } from "./lesson-popup"
import { TestPopup } from "./test-popup"
import { UpgradeModal } from "./upgrade-modal"
import { FlashcardService } from "@/app/services/flashcard.service"
import { useRouter } from "next/navigation"

interface LearningPathProps {
  sidebarOpen?: boolean
  units: Unit[]
  completedLessons: string[]
  markLessonCompleted: (lessonId: string) => void
  userType?: 'guest' | 'registered' | 'premium'
}

interface Lesson {
  id: number;
  title: string;
  wordCount?: number;
  questionCount?: number;
  isTest: boolean;
  accessible?: boolean;
}

interface Unit {
  unitId: number;
  title: string;
  description: string;
  lessons: Lesson[];
  accessible?: boolean;
  lockReason?: string;
}

export function LearningPath({ sidebarOpen = false, units, completedLessons, markLessonCompleted, userType }: LearningPathProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [selectedTest, setSelectedTest] = useState<string | null>(null)
  const [selectedSentenceBuilding, setSelectedSentenceBuilding] = useState<number | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeModalData, setUpgradeModalData] = useState<{
    userType: 'guest' | 'registered';
    currentTopicCount: number;
    maxTopicCount: number;
  }>({
    userType: 'guest',
    currentTopicCount: 1,
    maxTopicCount: 2,
  })
  const [sentenceBuildingInfo, setSentenceBuildingInfo] = useState<{[topicId: number]: boolean}>({})
  const [loadingSentenceBuilding, setLoadingSentenceBuilding] = useState<{[topicId: number]: boolean}>({})
  const lessonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const router = useRouter()

  // Debug: Log props
  console.log("🎯 LearningPath component received props:")
  console.log("  - sidebarOpen:", sidebarOpen)
  console.log("  - units:", units)
  console.log("  - units length:", units?.length)
  console.log("  - completedLessons:", completedLessons)
  console.log("  - markLessonCompleted:", typeof markLessonCompleted)

  // Debug: Log units structure
  if (units && units.length > 0) {
    console.log("📋 First unit structure:", JSON.stringify(units[0], null, 2))
  }

  // Kiểm tra sentence building cho mỗi topic
  useEffect(() => {
    const checkSentenceBuilding = async () => {
      if (!units || units.length === 0) return;
      
      const unitsToCheck = units.filter(unit => 
        !loadingSentenceBuilding[unit.unitId] && 
        sentenceBuildingInfo[unit.unitId] === undefined
      );
      
      if (unitsToCheck.length === 0) return;
      
      for (const unit of unitsToCheck) {
        setLoadingSentenceBuilding(prev => ({ ...prev, [unit.unitId]: true }));
        
        try {
          const hasSentenceBuilding = await FlashcardService.hasSentenceBuildingForTopic(unit.unitId);
          setSentenceBuildingInfo(prev => ({ ...prev, [unit.unitId]: hasSentenceBuilding }));
        } catch (error) {
          console.warn(`Failed to check sentence building for topic ${unit.unitId}:`, error);
          setSentenceBuildingInfo(prev => ({ ...prev, [unit.unitId]: false }));
        } finally {
          setLoadingSentenceBuilding(prev => ({ ...prev, [unit.unitId]: false }));
        }
      }
    };
    
    checkSentenceBuilding();
  }, [units]); // Chỉ dependency units

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
      if (selectedSentenceBuilding) {
        setSelectedSentenceBuilding(null)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, []) // Không có dependency để tránh vòng lặp

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Function để get current lesson (lesson tiếp theo cần làm)
  const getCurrentLesson = (unitLessons: any[]) => {
    // Tìm lesson đầu tiên chưa completed trong unit
    for (const lesson of unitLessons) {
      if (!completedLessons.includes(lesson.id.toString())) {
        return lesson.id.toString()
      }
    }
    // Nếu tất cả đã completed thì return null
    return null
  }

  // Function để check lesson có thể hiện popup không
  const canShowPopup = (lesson: any) => {
    // Nếu có accessible field thì sử dụng, không thì mặc định là true
    return lesson.accessible !== false
  }

  // Function để check lesson có available để làm không
  const isLessonAvailable = (lesson: any) => {
    // Nếu có accessible field và false thì không available
    if (lesson.accessible === false) return false

    const isCompleted = completedLessons.includes(lesson.id.toString())
    return isCompleted
  }

  const handleLessonClick = (lesson: any, event: React.MouseEvent) => {
    console.log("Lesson clicked:", { id: lesson.id, title: lesson.title, isTest: lesson.isTest });
    event.preventDefault()
    event.stopPropagation()

    if (!lesson.accessible) {
      console.log("Lesson not accessible");
      
      if (userType === 'guest') {
        // User chưa đăng nhập - chuyển hướng sang trang đăng nhập
        console.log("User not authenticated, redirecting to login");
        setShowUpgradeModal(true)
        setUpgradeModalData({
          userType: "guest",
          currentTopicCount: 1,
          maxTopicCount: 2,
        })
      } else {
        // User đã đăng nhập nhưng chưa mua gói học - chuyển hướng sang trang gói học
        console.log("User authenticated but no subscription, redirecting to pricing");
        setShowUpgradeModal(true)
        setUpgradeModalData({
          userType: "registered",
          currentTopicCount: 1,
          maxTopicCount: 2,
        })
      }
      return
    }

    if (lesson.isTest) {
      console.log("Test lesson clicked, setting selectedTest");
      setSelectedTest(lesson.id.toString())
    } else {
      console.log("Regular lesson clicked, setting selectedLesson");
      setSelectedLesson(lesson.id.toString())
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
  const getLessonInfo = (lessonId: string, unitLessons: any[]) => {
    const lessonIndex = unitLessons.findIndex((lesson) => lesson.id.toString() === lessonId)
    const regularLessons = unitLessons.filter((lesson) => !lesson.isTest)
    const lessonNumber = regularLessons.findIndex((lesson) => lesson.id.toString() === lessonId) + 1
    return {
      lessonNumber,
      totalLessons: regularLessons.length,
    }
  }

  const handleSentenceBuildingClick = (topicId: number) => {
    console.log("Sentence building clicked for topic:", topicId);
    setSelectedSentenceBuilding(topicId);
  }

  const renderUnit = (unit: Unit, unitNumber: number) => {
    const currentLesson = getCurrentLesson(unit.lessons)
    const isUnitAccessible = unit.accessible !== false
    // Tìm lesson test trong unit
    const testLesson = unit.lessons.find((lesson) => lesson.isTest)

    const allLessonsCompleted = unit.lessons.every(l => completedLessons.includes(l.id.toString()));

    return (
      <div className="mb-16">
        {/* Unit header */}
        <div className="px-4 mb-8">
          <div
            className={`rounded-xl p-6 mx-auto max-w-md shadow-lg ${
              !isUnitAccessible ? "bg-gradient-to-r from-gray-200 to-gray-300" : "bg-gradient-to-r from-pink-200 to-purple-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-bold ${!isUnitAccessible ? "text-gray-600" : "text-gray-800"}`}>
                  {unit.title}
                  {!isUnitAccessible && <span className="ml-2">🔒</span>}
                </h2>
                <p className={`text-sm mt-1 ${!isUnitAccessible ? "text-gray-500" : "text-gray-600"}`}>
                  {isUnitAccessible ? unit.description : unit.lockReason || "Chủ đề này bị khóa"}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  className={`font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg border-0 ${
                    !isUnitAccessible
                      ? "bg-gray-300 hover:bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-gray-800"
                  }`}
                  disabled={!isUnitAccessible}
                >
                  📖 GUIDEBOOK
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons - Zigzag layout */}
        <div className="px-4">
          <div className="max-w-2xl mx-auto relative">
            {/* Nút Thực hành ghép câu - bên phải danh sách subtopics */}
            {isUnitAccessible && sentenceBuildingInfo[unit.unitId] && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20">
                <div className="relative">
                  <button
                    onClick={() => handleSentenceBuildingClick(unit.unitId)}
                    className="block relative cursor-pointer"
                    disabled={loadingSentenceBuilding[unit.unitId]}
                    data-sentence-building={unit.unitId}
                  >
                    <div className="relative hover:scale-105 transition-transform">
                      <div className="w-20 h-20 rounded-full border-4 border-cyan-400 bg-gradient-to-r from-cyan-50 to-blue-50 flex items-center justify-center overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg">
                        <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
                          {loadingSentenceBuilding[unit.unitId] ? (
                            <div className="w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Image
                              src="/images/lesson-button.png"
                              alt="Sentence building"
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
            
            {unit.lessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id.toString())
              const isCurrent = lesson.id.toString() === currentLesson
              const canPopup = canShowPopup(lesson)
              const isAvailable = isLessonAvailable(lesson)
              const isLessonAccessible = lesson.accessible !== false

              return (
                <div key={lesson.id} className={`relative mb-12 ${getPositionClass(index)}`}>
                  {/* Lesson circle */}
                  <div
                    className="relative z-10 flex justify-center"
                    style={{ zIndex: selectedLesson === lesson.id.toString() || selectedTest === lesson.id.toString() ? 1000 : 10 }}
                  >
                    {!isLessonAccessible ? (
                      // Lesson bị lock - hiển thị locked state
                      <div className="relative">
                        <button
                          onClick={(e) => handleLessonClick(lesson, e)}
                          className="block relative cursor-pointer"
                        >
                          <div className="relative hover:scale-105 transition-transform">
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
                                  <Lock className="w-6 h-6 text-gray-600" />
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
                                  <Lock className="w-6 h-6 text-gray-600" />
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      </div>
                    ) : (
                      // Lesson accessible - hiển thị normal state
                      <div className="relative">
                        <button
                          ref={(el) => {
                            lessonRefs.current[lesson.id.toString()] = el
                          }}
                          onClick={(e) => handleLessonClick(lesson, e)}
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

                        {/* LESSON POPUP - chỉ hiện cho lesson accessible */}
                        {selectedLesson === lesson.id.toString() && !lesson.isTest && canPopup && selectedLesson && (() => {
                          let popupDirection: "up" | "down" = "down";
                          let popupPosition = undefined;
                          if (lessonRefs.current[selectedLesson]) {
                            const rect = lessonRefs.current[selectedLesson]!.getBoundingClientRect();
                            const popupHeight = 190; // chiều cao ước lượng của popup
                            if (rect.bottom + popupHeight > window.innerHeight) {
                              popupDirection = "up";
                              popupPosition = {
                                x: rect.left + rect.width / 2,
                                y: rect.top,
                              };
                            } else {
                              popupDirection = "down";
                              popupPosition = {
                                x: rect.left + rect.width / 2,
                                y: rect.top,
                              };
                            }
                          }
                          return (
                            <LessonPopup
                              isOpen={true}
                              onClose={() => setSelectedLesson(null)}
                              lessonNumber={getLessonInfo(selectedLesson, unit.lessons).lessonNumber}
                              totalLessons={getLessonInfo(selectedLesson, unit.lessons).totalLessons}
                              wordCount={lesson.wordCount || 0}
                              lessonTitle={lesson.title || ""}
                              position={popupPosition}
                              direction={popupDirection}
                              lessonId={parseInt(selectedLesson)}
                              subtopicId={lesson.id}
                            />
                          );
                        })()}

                        {/* TEST POPUP - chỉ hiện cho test accessible */}
                        {selectedTest === lesson.id.toString() && lesson.isTest && canPopup && selectedTest && (
                          <TestPopup
                            isOpen={true}
                            onClose={() => setSelectedTest(null)}
                            testNumber={lesson.id}
                            questionCount={lesson.questionCount || 10}
                            testTitle={lesson.title || ""}
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
                            testId={parseInt(selectedTest)}
                            topicId={unit.unitId}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Nút test lớn ở cuối unit, luôn hiển thị nếu unit accessible */}
            {isUnitAccessible && (
              <div className="flex justify-center mt-8">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedTest(`unit-test-${unit.unitId}`);
                    }}
                    className="block relative cursor-pointer"
                  >
                    <div className="relative hover:scale-105 transition-transform">
                      <div className={`w-24 h-24 rounded-full border-4 border-orange-400 bg-yellow-50 flex items-center justify-center overflow-hidden shadow-lg ${!allLessonsCompleted ? 'animate-pulse-fast' : ''}`}>
                        <div className="w-20 h-20 rounded-full overflow-hidden">
                          <Image
                            src="/images/test-mascot-final.png"
                            alt="Test"
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                  {/* TEST POPUP cho nút test lớn cuối unit */}
                  {selectedTest === `unit-test-${unit.unitId}` && (
                    <TestPopup
                      isOpen={true}
                      onClose={() => setSelectedTest(null)}
                      testNumber={unit.unitId}
                      questionCount={testLesson?.questionCount || 20}
                      testTitle={unit.title || ""}
                      position={undefined}
                      testId={testLesson?.id || unit.unitId}
                      topicId={unit.unitId}
                    />
                  )}
                </div>
              </div>
            )}

            {/* SENTENCE BUILDING POPUP */}
            {selectedSentenceBuilding === unit.unitId && (() => {
              let popupDirection: "up" | "down" = "down";
              let popupPosition = undefined;
              // Tính toán vị trí popup giống như subtopic
              const buttonElement = document.querySelector(`[data-sentence-building="${unit.unitId}"]`) as HTMLElement;
              if (buttonElement) {
                const rect = buttonElement.getBoundingClientRect();
                const popupHeight = 190; // chiều cao ước lượng của popup
                if (rect.bottom + popupHeight > window.innerHeight) {
                  popupDirection = "up";
                  popupPosition = {
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  };
                } else {
                  popupDirection = "down";
                  popupPosition = {
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  };
                }
              }
              return (
                <>
                  {/* Invisible overlay to detect clicks outside */}
                  <div className="fixed inset-0 z-40" onClick={() => setSelectedSentenceBuilding(null)} />

                  <div
                    className="fixed z-50"
                    style={{
                      left: popupPosition?.x ? `${popupPosition.x}px` : "50%",
                      top: popupDirection === "up"
                        ? popupPosition?.y
                          ? `${popupPosition.y - 190}px` // hiển thị phía trên
                          : "50%"
                        : popupPosition?.y
                          ? `${popupPosition.y + 90}px` // hiển thị phía dưới
                          : "50%",
                      transform: popupPosition?.x ? "translateX(-50%)" : "translate(-50%, -50%)",
                    }}
                  >
                    {/* New popup design - very small */}
                    <div className="relative">
                      {/* Cyan pastel rounded popup - very small */}
                      <div className="bg-cyan-50 rounded-lg px-3 py-3 text-center shadow-lg min-w-[180px] border-2 border-cyan-200">
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
                        <h2 className="text-sm font-bold text-cyan-700 mb-1">THỰC HÀNH GHÉP CÂU !!!</h2>

                        {/* Lesson topic - very small */}
                        <p className="text-cyan-600 text-xs font-semibold mb-1">CHỦ ĐỀ: {unit.title.toUpperCase()}</p>

                        {/* Word count - very small */}
                        <p className="text-cyan-500 text-xs font-bold mb-2">GHÉP TỪ THÀNH CÂU</p>

                        {/* Start button - very small */}
                        <Button
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-1.5 px-3 rounded-md shadow-sm transition-all duration-200 hover:shadow-md text-xs"
                          onClick={() => {
                            setSelectedSentenceBuilding(null);
                            router.push(`/practice?topicId=${unit.unitId}&mode=sentence-building`);
                          }}
                        >
                          BẮT ĐẦU
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
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
            src="/images/whale-character.png"
            alt="Whale character"
            width={120}
            height={120}
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Title */}
        <div className="text-center mb-12 px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">Lộ trình học tập</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá ngôn ngữ ký hiệu qua các chủ đề thú vị và thực hành với các bài tập tương tác
          </p>
        </div>

        {/* Units */}
        {units.map((unit, unitIdx) => (
          <div className="mb-16" key={unit.unitId}>
            {renderUnit(unit, unitIdx)}
          </div>
        ))}
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 lg:bottom-12 lg:right-12 z-50 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        userType={upgradeModalData.userType}
        currentTopicCount={upgradeModalData.currentTopicCount}
        maxTopicCount={upgradeModalData.maxTopicCount}
      />
    </div>
  )
} 