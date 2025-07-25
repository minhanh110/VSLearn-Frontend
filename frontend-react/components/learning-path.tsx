"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
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
  isCompleted?: boolean;
}

interface Unit {
  unitId: number;
  title: string;
  description: string;
  lessons: Lesson[];
  accessible?: boolean;
  lockReason?: string;
  wordCount?: number;
}

// Component TestRequirementModal
function TestRequirementModal({
  isOpen,
  onClose,
  topicName,
  completedCount,
  totalCount
}: {
  isOpen: boolean;
  onClose: () => void;
  topicName: string;
  completedCount: number;
  totalCount: number;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md text-center shadow-2xl border-4 border-orange-300 relative">
        {/* Warning icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-orange-700 mb-4">⚠️ CHƯA THỂ LÀM BÀI TEST</h1>

        {/* Message */}
        <p className="text-lg text-gray-700 mb-4">
          Bạn cần hoàn thành tất cả các chủ đề nhỏ trước khi làm bài test
        </p>

        {/* Progress info */}
        <div className="bg-orange-50 rounded-xl p-4 mb-6">
          <p className="text-orange-800 font-semibold mb-2">Tiến độ hoàn thành:</p>
          <div className="flex justify-between items-center">
            <span className="text-orange-700">Chủ đề: {topicName}</span>
            <span className="text-orange-700 font-bold">
              {completedCount}/{totalCount} subtopics
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
          {/* Thông báo đặc biệt */}
          {completedCount === totalCount - 1 && (
            <p className="text-orange-600 text-sm mt-2 font-semibold">
              🎯 Chỉ còn 1 subtopic nữa để có thể làm bài test!
            </p>
          )}
          {completedCount < totalCount && (
            <p className="text-orange-600 text-sm mt-2">
              Hoàn thành tất cả subtopics để mở khóa bài test
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            ĐÓNG
          </button>
          <button
            onClick={() => {
              onClose();
              // Scroll to first incomplete subtopic
              const firstIncompleteLesson = document.querySelector('[data-lesson-id]') as HTMLElement;
              if (firstIncompleteLesson) {
                firstIncompleteLesson.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            TIẾP TỤC HỌC
          </button>
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

// Component SubtopicRequirementModal
function SubtopicRequirementModal({
  isOpen,
  onClose,
  topicName
}: {
  isOpen: boolean;
  onClose: () => void;
  topicName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md text-center shadow-2xl border-4 border-blue-300 relative">
        {/* Info icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-blue-700 mb-4">📚 CHỦ ĐỀ NHỎ BỊ KHÓA</h1>

        {/* Message */}
        <p className="text-lg text-gray-700 mb-6">
          Bạn cần hoàn thành chủ đề nhỏ trước đó để tiếp tục học
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            ĐÓNG
          </button>
          <button
            onClick={() => {
              onClose();
              // Scroll to first incomplete subtopic
              const firstIncompleteLesson = document.querySelector('[data-lesson-id]') as HTMLElement;
              if (firstIncompleteLesson) {
                firstIncompleteLesson.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            TIẾP TỤC HỌC
          </button>
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

// Component TopicLockedModal
function TopicLockedModal({
  isOpen,
  onClose,
  currentTopicName,
  previousTopicName
}: {
  isOpen: boolean;
  onClose: () => void;
  currentTopicName: string;
  previousTopicName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md text-center shadow-2xl border-4 border-blue-300 relative">
        {/* Lock icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-blue-700 mb-4">🔒 CHỦ ĐỀ BỊ KHÓA</h1>

        {/* Message */}
        <p className="text-lg text-gray-700 mb-4">
          Bạn cần hoàn thành bài test của chủ đề trước với điểm ≥90% để mở khóa chủ đề này
        </p>

        {/* Topic info */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-blue-800 font-semibold mb-2">Chủ đề cần hoàn thành:</p>
          <div className="text-blue-700 font-bold text-lg mb-2">
            {previousTopicName}
          </div>
          <p className="text-blue-600 text-sm">
            Chủ đề hiện tại: <span className="font-semibold">{currentTopicName}</span>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            ĐÓNG
          </button>
          <button
            onClick={() => {
              onClose();
              // Scroll to previous topic's test
              const previousTopicElement = document.querySelector(`[data-unit-id="${previousTopicName}"]`) as HTMLElement;
              if (previousTopicElement) {
                previousTopicElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            QUAY LẠI CHỦ ĐỀ TRƯỚC
          </button>
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

export function LearningPath({ sidebarOpen = false, units, completedLessons, markLessonCompleted, userType }: LearningPathProps) {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [selectedTest, setSelectedTest] = useState<string | null>(null)
  const [selectedSentenceBuilding, setSelectedSentenceBuilding] = useState<number | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeModalData, setUpgradeModalData] = useState({
    userType: "guest" as "guest" | "registered",
    currentTopicCount: 0,
    maxTopicCount: 0,
  })
  const [showTestRequirementModal, setShowTestRequirementModal] = useState(false)
  const [testRequirementData, setTestRequirementData] = useState({
    topicName: "",
    completedCount: 0,
    totalCount: 0,
  })
  const [showSubtopicRequirementModal, setShowSubtopicRequirementModal] = useState(false)
  const [subtopicRequirementData, setSubtopicRequirementData] = useState({
    currentSubtopic: "",
    requiredSubtopic: "",
  })
  const [showTopicLockedModal, setShowTopicLockedModal] = useState(false)
  const [topicLockedData, setTopicLockedData] = useState({
    currentTopicName: "",
    previousTopicName: "",
  })
  const [sentenceBuildingInfo, setSentenceBuildingInfo] = useState<{ [topicId: number]: boolean }>({})
  const [loadingSentenceBuilding, setLoadingSentenceBuilding] = useState<{ [topicId: number]: boolean }>({})
  const lessonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const router = useRouter()

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
    // Nếu có accessible field và false thì không hiển thị popup
    if (lesson.accessible === false) return false;

    // Test luôn có thể hiển thị popup (sẽ có logic riêng bên trong)
    return true;
  }

  // Function để check lesson có available để làm không
  const isLessonAvailable = (lesson: any) => {
    // Sử dụng trực tiếp accessible từ backend
    // Backend đã tính toán:
    // - Topic accessible: khi test topic trước đạt >=90%
    // - Subtopic accessible: khi subtopic trước đã hoàn thành
    return lesson.accessible !== false;
  }

  const handleLessonClick = (lesson: any, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    console.log('Lesson clicked:', {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      isTest: lesson.isTest,
      accessible: lesson.accessible,
      userType
    });

    // Luôn cho phép mở TestPopup khi bấm nút test, kể cả khi lesson test bị khóa
    if (lesson.isTest) {
      setSelectedTest(lesson.id.toString());
      return;
    }

    // Check if lesson is accessible (backend đã tính toán)
    if (!lesson.accessible) {
      const unit = units.find(u => u.lessons.some(l => l.id === lesson.id));
      if (unit) {
        const currentUnitIndex = units.findIndex(u => u.unitId === unit.unitId);

        // Check if it's a topic access issue
        if (!unit.accessible) {
          if (userType === 'guest') {
            setShowUpgradeModal(true)
            setUpgradeModalData({
              userType: "guest",
              currentTopicCount: 1,
              maxTopicCount: 2,
            })
          } else if (userType === 'registered' && currentUnitIndex >= 2) {
            setShowUpgradeModal(true)
            setUpgradeModalData({
              userType: "registered",
              currentTopicCount: 2,
              maxTopicCount: 2,
            })
          } else if (currentUnitIndex > 0) {
            // Previous topic test not completed with ≥90%
            const previousUnit = units[currentUnitIndex - 1];
            setTopicLockedData({
              currentTopicName: unit.title,
              previousTopicName: previousUnit.title,
            });
            setShowTopicLockedModal(true);
          }
          return;
        }

        // Check if it's a lesson access issue
        if (unit.accessible && !lesson.accessible && !lesson.isTest) {
          const subtopics = unit.lessons.filter(l => !l.isTest).sort((a, b) => a.id - b.id);
          const currentIndex = subtopics.findIndex(l => l.id === lesson.id);
          if (currentIndex > 0) {
            const previousSubtopic = subtopics[currentIndex - 1];
            setSubtopicRequirementData({
              currentSubtopic: lesson.title,
              requiredSubtopic: previousSubtopic.title
            });
            setShowSubtopicRequirementModal(true);
          }
          return;
        }
      }
      // Nếu lesson thường bị khóa và không có modal nào khác, show modal nâng cấp cho guest
      if (!lesson.isTest && userType === 'guest') {
        setShowUpgradeModal(true)
        setUpgradeModalData({
          userType: "guest",
          currentTopicCount: 1,
          maxTopicCount: 2,
        })
      }
      return;
    }
    // Nếu lesson thường mở, mở popup lesson
    if (!lesson.isTest) {
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

  // Thêm useEffect để đóng popup khi click ra ngoài (bỏ handleScroll)
  // Thêm useEffect để đóng popup khi click ra ngoài và khi scroll
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        
        // Kiểm tra chi tiết hơn để không đóng popup khi click vào nút bên trong
        if (!target.closest('[data-lesson-id]') && 
            !target.closest('[data-test-lesson]') && 
            !target.closest('.lesson-popup') && 
            !target.closest('.test-popup') &&
            !target.closest('[role="dialog"]') && // Thêm selector cho modal/dialog
            !target.closest('button') && // Cho phép click vào button
            !target.closest('.popup-content')) { // Thêm class cho popup content
          setSelectedLesson(null);
          setSelectedTest(null);
        }
      };

      const handleScroll = () => {
        // Chỉ đóng popup khi scroll, không cần kiểm tra gì thêm
        setSelectedLesson(null);
        setSelectedTest(null);
        setSelectedSentenceBuilding(null);
      };

      // Sử dụng 'click' thay vì 'mousedown' để tránh conflict
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }, []);
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

  const handleSentenceBuildingClick = (topicId: number) => {
    setSelectedSentenceBuilding(topicId);
  }

  const renderUnit = (unit: Unit, unitNumber: number) => {
    const currentLesson = getCurrentLesson(unit.lessons)
    const isUnitAccessible = unit.accessible !== false

    // Sử dụng trực tiếp accessible từ backend
    // Backend đã tính toán: topic sau chỉ mở khi test của topic trước đạt >=90%

    // Tìm lesson test trong unit (chỉ topic mới có test)
    const testLesson = unit.lessons.find((lesson) => lesson.isTest)
    const hasTest = !!testLesson

    const allLessonsCompleted = unit.lessons.every(l => completedLessons.includes(l.id.toString()));

    const allSubtopicsCompleted = unit.lessons.filter(l => !l.isTest).every(l => l.isCompleted);
    const hasSentenceBuilding = sentenceBuildingInfo[unit.unitId];

    // Tính toán vị trí popup test giống LessonPopup
    let testPopupPosition = undefined;
    let testPopupDirection = "down";
    if (testLesson) {
      const ref = lessonRefs.current[testLesson.id.toString()];
      if (ref && typeof ref.getBoundingClientRect === 'function') {
        const rect = ref.getBoundingClientRect();
        const popupHeight = 190;
        if (rect.bottom + popupHeight > window.innerHeight) {
          testPopupDirection = "up";
          testPopupPosition = {
            x: rect.left + rect.width / 2,
            y: rect.top,
          };
        } else {
          testPopupDirection = "down";
          testPopupPosition = {
            x: rect.left + rect.width / 2,
            y: rect.top,
          };
        }
      }
    }
    // Debug log để kiểm tra popup test
    console.log('DEBUG TestPopup:', {
      selectedTest,
      testLessonId: testLesson?.id,
      testLesson,
      showUpgradeModal,
      showTestRequirementModal,
      showTopicLockedModal
    });
    return (
      <div className="mb-16">
        {/* Unit header */}
        <div className="px-4 mb-8">
          <div
            className={`rounded-xl p-6 mx-auto max-w-md shadow-lg ${!isUnitAccessible ? "bg-gradient-to-r from-gray-200 to-gray-300" : "bg-gradient-to-r from-pink-200 to-purple-200"
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-bold ${!isUnitAccessible ? "text-gray-600" : "text-gray-800"}`}>
                  {unit.title}
                  {!isUnitAccessible && <span className="ml-2">🔒</span>}
                </h2>
                <p className={`text-sm mt-1 ${!isUnitAccessible ? "text-gray-500" : "text-gray-600"}`}>
                  {isUnitAccessible
                    ? `${unit.wordCount || 0} từ vựng`
                    : (currentLesson ? "Hoàn thành bài test của chủ đề trước để mở khóa" : unit.lockReason || "Chủ đề này bị khóa")}
                </p>
              </div>

            </div>
            {/* Bỏ nút GUIDEBOOK */}
            {/* <div className="flex flex-col gap-2">
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
            </div> */}
          </div>
        </div>

        {/* Lessons - Zigzag layout */}
        <div className="px-4">
          <div className="max-w-2xl mx-auto relative">
            {/* Nút test bên phải */}
            {isUnitAccessible && hasTest && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-4 items-end">
                <button
                  ref={(el) => {
                    lessonRefs.current[testLesson.id.toString()] = el
                  }}
                  onClick={(e) => { console.log('CLICK TEST BUTTON', testLesson.id); handleLessonClick(testLesson, e); }}
                  className="relative block cursor-pointer"
                  data-test-lesson={testLesson.id}
                >
                  <div className="relative hover:scale-105 transition-transform">
                    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg
                      ${!allSubtopicsCompleted ? 'border-gray-400 bg-gray-200' : 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50'}
                      ${testLesson.isCompleted ? 'opacity-70' : ''}`}
                    >
                      <div className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center`}>
                        <Image
                          src="/images/test-mascot-final.png"
                          alt="Test"
                          width={64}
                          height={64}
                          className={`object-cover w-full h-full ${!allSubtopicsCompleted ? 'grayscale opacity-50' : ''}`}
                        />
                      </div>
                      {/* Overlay icon khóa nếu bị khóa */}
                      {!allSubtopicsCompleted && (
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Lock className="w-8 h-8 text-gray-500" />
                        </span>
                      )}
                    </div>
                  </div>
                </button>
                {/* Popup test */}
                {String(selectedTest) === String(testLesson.id) && !showUpgradeModal && !showTestRequirementModal && !showTopicLockedModal && (
                    <div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="test-popup popup-content"> {/* Thêm class */}
                        <TestPopup
                          isOpen={true}
                          onClose={() => setSelectedTest(null)}
                          testNumber={testLesson.id}
                          questionCount={testLesson.questionCount || 10}
                          testTitle={testLesson.title || ""}
                          position={undefined}
                          testId={testLesson.id}
                          topicId={unit.unitId}
                          isLocked={testLesson.accessible === false}
                        />
                      </div>
                    </div>
                  )}
              </div>
            )}
            {/* Render các lesson thường */}
            {unit.lessons.map((lesson, index) => {
              // BỎ QUA lesson test, chỉ render lesson thường
              if (lesson.isTest) return null;
              // Sử dụng isCompleted từ backend thay vì tính toán
              const isCompleted = lesson.isCompleted || false;
              const isCurrent = lesson.id.toString() === getCurrentLesson(unit.lessons);
              const canPopup = canShowPopup(lesson);
              const isAvailable = isLessonAvailable(lesson);
              const isLessonAccessible = lesson.accessible !== false;
              // Render lesson thường như cũ
              return (
                <div key={lesson.id} className={`relative mb-12 ${getPositionClass(index)}`}>
                  {/* Lesson circle */}
                  <div
                    className="relative z-10 flex justify-center"
                    style={{ zIndex: selectedLesson === lesson.id.toString() ? 1000 : 10 }}
                  >
                    {!isUnitAccessible || !isLessonAccessible ? (
                      // Topic hoặc lesson không được truy cập - hiển thị locked state
                      <div className="relative">
                        <button
                          onClick={(e) => handleLessonClick(lesson, e)}
                          className="block relative cursor-pointer"
                        >
                          <div className="relative hover:scale-105 transition-transform">
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
                          </div>
                        </button>
                      </div>
                    ) : (
                      // Topic và lesson được truy cập - hiển thị normal state với màu sắc
                      <div className="relative">
                        <button
                          ref={(el) => {
                            lessonRefs.current[lesson.id.toString()] = el
                          }}
                          onClick={(e) => handleLessonClick(lesson, e)}
                          className="block relative cursor-pointer"
                        >
                          <div className="relative hover:scale-105 transition-transform">
                            <div className="relative">
                              <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${isCompleted
                                  ? "border-green-500 bg-green-50"
                                  : isCurrent
                                    ? "border-blue-500 bg-blue-50 animate-pulse"
                                    : "border-gray-400 bg-gray-100"
                                }`}>
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
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                  {/* LESSON POPUP */}
                  {selectedLesson === lesson.id.toString() && canPopup && (
                      <div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-auto"
                        onClick={(e) => e.stopPropagation()} // Ngăn bubble up
                      >
                        <div className="lesson-popup popup-content"> {/* Thêm class để identify */}
                          <LessonPopup
                            isOpen={true}
                            onClose={() => setSelectedLesson(null)}
                            lessonNumber={getLessonInfo(selectedLesson, unit.lessons).lessonNumber}
                            totalLessons={getLessonInfo(selectedLesson, unit.lessons).totalLessons}
                            wordCount={lesson.wordCount || 0}
                            lessonTitle={lesson.title || ""}
                            position={undefined}
                            direction={"down"}
                            lessonId={parseInt(selectedLesson)}
                            subtopicId={lesson.id}
                          />
                        </div>
                      </div>
                    )}
                </div>
              );
            })}
            {/* Nút học ghép câu ở cuối hàng subtopic */}
            {hasSentenceBuilding && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={(e) => {
                    // Check user type restrictions first
                    if (userType === 'guest') {
                      setShowUpgradeModal(true);
                      setUpgradeModalData({
                        userType: "guest",
                        currentTopicCount: 1,
                        maxTopicCount: 2,
                      });
                      return;
                    }

                    if (userType === 'registered' && unitNumber >= 2) {
                      setShowUpgradeModal(true);
                      setUpgradeModalData({
                        userType: "registered",
                        currentTopicCount: 2,
                        maxTopicCount: 2,
                      });
                      return;
                    }

                    // Check if topic is accessible
                    if (!unit.accessible) {
                      if (unitNumber > 0) {
                        // Previous topic test not completed with ≥90%
                        const previousUnit = units[unitNumber - 1];
                        setTopicLockedData({
                          currentTopicName: unit.title,
                          previousTopicName: previousUnit.title,
                        });
                        setShowTopicLockedModal(true);
                      }
                      return;
                    }

                    // Check if all subtopics completed
                    if (allSubtopicsCompleted && hasSentenceBuilding) {
                      setSelectedSentenceBuilding(unit.unitId);
                    } else {
                      setShowSubtopicRequirementModal(true);
                      setSubtopicRequirementData({
                        currentSubtopic: 'Thực hành ghép câu',
                        requiredSubtopic: 'Hoàn thành tất cả các subtopic trước!'
                      });
                    }
                  }}
                  className="relative block cursor-pointer"
                  data-sentence-building={unit.unitId}
                >
                  <div className="relative hover:scale-105 transition-transform">
                    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg
                      ${!allSubtopicsCompleted ? 'border-gray-400 bg-gray-200' : 'border-cyan-400 bg-gradient-to-r from-cyan-50 to-blue-50'}`}
                    >
                      <div className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center`}>
                        <Image
                          src="/images/lesson-button.png"
                          alt="Sentence building"
                          width={64}
                          height={64}
                          className={`object-cover w-full h-full ${!allSubtopicsCompleted ? 'grayscale opacity-50' : ''}`}
                        />
                      </div>
                      {/* Overlay icon khóa nếu bị khóa */}
                      {!allSubtopicsCompleted && (
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Lock className="w-8 h-8 text-gray-500" />
                        </span>
                      )}
                    </div>
                  </div>
                </button>
                {/* Popup học ghép câu luôn ở giữa màn hình */}
                {selectedSentenceBuilding === unit.unitId && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setSelectedSentenceBuilding(null)} />
                    <div
                      className="fixed z-50"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="relative">
                        <div className="bg-cyan-50 rounded-lg px-3 py-3 text-center shadow-lg min-w-[180px] border-2 border-cyan-200">
                          <div className="flex justify-center mb-1">
                            <Image
                              src="/images/study-mascot-new.png"
                              alt="Study mascot"
                              width={45}
                              height={45}
                              className="object-contain"
                            />
                          </div>
                          <h2 className="text-sm font-bold text-cyan-700 mb-1">THỰC HÀNH GHÉP CÂU !!!</h2>
                          <p className="text-cyan-600 text-xs font-semibold mb-1">CHỦ ĐỀ: {unit.title.toUpperCase()}</p>
                          <p className="text-cyan-500 text-xs font-bold mb-2">GHÉP TỪ THÀNH CÂU</p>
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
                )}
              </div>
            )}
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
            alt="Whale character"
            width={180}
            height={180}
            className="object-contain drop-shadow-2xl w-24 h-24 lg:w-36 lg:h-36"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Units */}
        {units.map((unit, unitIdx) => (
          <div className="mb-16" key={unit.unitId}>
            {renderUnit(unit, unitIdx)}
          </div>
        ))}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        userType={upgradeModalData.userType}
        currentTopicCount={upgradeModalData.currentTopicCount}
        maxTopicCount={upgradeModalData.maxTopicCount}
      />

      {/* Test Requirement Modal */}
      <TestRequirementModal
        isOpen={showTestRequirementModal}
        onClose={() => setShowTestRequirementModal(false)}
        topicName={testRequirementData.topicName}
        completedCount={testRequirementData.completedCount}
        totalCount={testRequirementData.totalCount}
      />

      {/* Subtopic Requirement Modal */}
      <SubtopicRequirementModal
        isOpen={showSubtopicRequirementModal}
        onClose={() => setShowSubtopicRequirementModal(false)}
        topicName={subtopicRequirementData.currentSubtopic}
      />

      {/* Topic Locked Modal */}
      <TopicLockedModal
        isOpen={showTopicLockedModal}
        onClose={() => setShowTopicLockedModal(false)}
        currentTopicName={topicLockedData.currentTopicName}
        previousTopicName={topicLockedData.previousTopicName}
      />
    </div>
  )
} 