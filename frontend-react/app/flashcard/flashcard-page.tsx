"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PracticeGroup } from "@/components/flashcard/practice-group"
import { PracticeTransitionModal } from "@/components/flashcard/practice-transition-modal"
import { CompletionPopup } from "@/components/flashcard/completion-popup"
import { useFlashcardLogic } from "@/hooks/useFlashcardLogic"
import { type Flashcard } from "@/app/services/flashcard.service"
import { FlashcardService, type SentenceBuildingQuestion } from "@/app/services/flashcard.service"

export default function FlashcardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [videoError, setVideoError] = useState(false);
  const [sentenceBuildingQuestions, setSentenceBuildingQuestions] = useState<SentenceBuildingQuestion[]>([]);
  const [hasSentenceBuilding, setHasSentenceBuilding] = useState(false);

  const subtopicId = searchParams.get("subtopicId") || "1";

  // Sử dụng custom hook để quản lý logic
  const {
    flashcards,
    isLoading,
    subtopicInfo,
    timeline,
    timelinePos,
    showCompletionPopup,
    showTransitionPopup,
    showPracticeTransitionModal,
    showCompletionModal,
    setShowCompletionPopup,
    setShowTransitionPopup,
    setShowPracticeTransitionModal,
    setShowCompletionModal,
    nextStep,
    prevStep,
    resetTimeline,
    handlePracticeTransitionContinue,
    handlePracticeTransitionReview,
    handlePracticeTransitionClose,
    handleCompletionRetry,
    handleCompletionNext,
    handleCompletionClose,
    isLastFlashcard,
    isLastPractice,
    getCurrentStep,
    getPracticeCards,
    getUpcomingPracticeCards,
    getCurrentGroupSize,
    shouldShowPracticeButton,
    totalCards,
  } = useFlashcardLogic(subtopicId);

  // Tạo key để force re-render khi subtopicId thay đổi
  const componentKey = useMemo(() => `flashcard-${subtopicId}`, [subtopicId]);

  // Reset videoError khi flashcard thay đổi
  useEffect(() => {
    setVideoError(false);
  }, [timelinePos]);

  // Load sentence building questions
  useEffect(() => {
    const loadSentenceBuildingQuestions = async () => {
      try {
        const questions = await FlashcardService.getSentenceBuildingQuestions(subtopicId);
        setSentenceBuildingQuestions(questions);
        setHasSentenceBuilding(questions.length > 0);
        console.log("📝 Loaded sentence building questions:", questions.length);
      } catch (error) {
        console.warn("Failed to load sentence building questions:", error);
        setHasSentenceBuilding(false);
      }
    };

    if (subtopicId) {
      loadSentenceBuildingQuestions();
    }
  }, [subtopicId]);

  // Debug showCompletionPopup changes
  useEffect(() => {
    console.log("🔄 showCompletionPopup state changed to:", showCompletionPopup);
  }, [showCompletionPopup]);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePracticeComplete = () => {
    if (isLastPractice()) {
      setShowCompletionModal(true);
    } else {
      nextStep();
      setIsFlipped(false);
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    console.warn("Video failed to load, showing fallback");
    console.warn("This might be due to expired signed URL or network issues");
  };

  const handleSentenceBuilding = () => {
    // Chuyển sang trang practice với sentence building
    router.push(`/practice?lessonId=${subtopicId}&mode=sentence-building`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 text-lg font-semibold">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (timelinePos < timeline.length) {
    const currentStep = getCurrentStep();

    if (currentStep?.type === "practice") {
      const practiceCards = getPracticeCards();
      const isLastPracticeStep = isLastPractice();
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden flex flex-col">
          {/* Decorative Stars Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-6 h-6 text-yellow-300 animate-pulse">⭐</div>
            <div className="absolute top-32 right-24 w-5 h-5 text-blue-300 animate-bounce">⭐</div>
            <div className="absolute top-40 left-1/4 w-4 h-4 text-green-300 animate-pulse">⭐</div>
            <div className="absolute bottom-40 left-16 w-5 h-5 text-pink-300 animate-pulse">⭐</div>
            <div className="absolute bottom-32 right-20 w-6 h-6 text-yellow-300 animate-bounce">⭐</div>
          </div>
          {/* Header */}
          <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
          {/* Main Content */}
          <div className="flex-1 px-4 pb-4 pt-16 relative z-10 min-h-0 flex flex-col justify-center items-center">
            <PracticeGroup
              practiceCards={practiceCards}
              allCards={flashcards}
              onContinue={handlePracticeComplete}
              subtopicId={subtopicId}
            />
          </div>
          <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

          {/* Practice Transition Modal */}
          <PracticeTransitionModal
            isOpen={showPracticeTransitionModal}
            onClose={handlePracticeTransitionClose}
            onContinue={handlePracticeTransitionContinue}
            onReview={handlePracticeTransitionReview}
            practiceCardCount={getUpcomingPracticeCards().length}
            completedCardCount={flashcards.length}
            currentGroupSize={getCurrentGroupSize()}
          />
        </div>
      );
    }

    if (currentStep?.type === "flashcard") {
      let currentFlashcard: Flashcard | null = null;
      if (currentStep.index !== undefined) {
        currentFlashcard = flashcards[currentStep.index];
      }

      // Debug log để xem dữ liệu
      console.log("🔍 Current flashcard data:", currentFlashcard);
      console.log("  - Front type:", currentFlashcard?.front.type);
      console.log("  - Front content:", currentFlashcard?.front.content);
      console.log("  - Is video type:", currentFlashcard?.front.type === "video");
      console.log("  - Contains .mp4:", currentFlashcard?.front.content?.includes('.mp4'));
      console.log("  - Should show video:", currentFlashcard?.front.type === "video" || currentFlashcard?.front.content?.includes('.mp4'));

  return (
        <div key={componentKey} className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden">
      {/* Decorative Stars Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-8 h-8 text-yellow-300 animate-pulse">⭐</div>
        <div className="absolute top-32 right-24 w-6 h-6 text-blue-300 animate-bounce">⭐</div>
        <div className="absolute top-40 left-1/4 w-5 h-5 text-green-300 animate-pulse">⭐</div>
        <div className="absolute bottom-40 left-16 w-6 h-6 text-pink-300 animate-pulse">⭐</div>
        <div className="absolute bottom-32 right-20 w-8 h-8 text-yellow-300 animate-bounce">⭐</div>
      </div>

      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content Container */}
      <div className="pt-20 pb-28 lg:pb-20 px-4 min-h-screen relative z-10">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-center min-h-[calc(100vh-10rem)]">
          <div className="w-full max-w-6xl mx-auto flex items-center justify-center gap-8">
            {/* Left Arrow */}
            <Button
                  onClick={prevStep}
              className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            {/* Flashcard */}
            <div className="relative w-full max-w-lg aspect-square">
              <div
                className={`relative w-full h-full cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                onClick={toggleFlip}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front Side */}
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

                        {/* Content */}
                        {currentFlashcard?.front.type === "video" || currentFlashcard?.front.content?.includes('.mp4') ? (
                          <div className="w-full h-full flex items-center justify-center">
                            {!videoError ? (
                      <video
                                src={currentFlashcard.front.content}
                                className="w-full h-full object-cover rounded-2xl"
                        autoPlay
                        loop
                        muted
                                playsInline
                                onError={handleVideoError}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center flex-col">
                                <p className="text-gray-500 mb-2">Video không tải được</p>
                                <Button 
                                  onClick={() => {
                                    setVideoError(false);
                                    // Force re-render by changing key
                                    const videoElement = document.querySelector('video');
                                    if (videoElement) {
                                      videoElement.load();
                                    }
                                  }}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                >
                                  Thử lại
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                        <Image
                              src={currentFlashcard?.front.content || ""}
                              alt={currentFlashcard?.front.title || "Flashcard"}
                          width={400}
                          height={400}
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          </div>
                        )}
                      </div>
                </div>

                {/* Back Side */}
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

                    {/* Text content */}
                        <h1 className="text-3xl font-bold text-blue-700 mb-4">{currentFlashcard?.back.word}</h1>
                        <p className="text-base text-gray-700 font-medium">{currentFlashcard?.back.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <Button
                  onClick={nextStep}
              className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] gap-6">
          {/* Flashcard */}
          <div className="relative w-full max-w-sm aspect-square">
            <div
              className={`relative w-full h-full cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              onClick={toggleFlip}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front Side */}
              <div
                className={`absolute inset-0 w-full h-full backface-hidden ${
                  isFlipped ? "opacity-0" : "opacity-100"
                } transition-opacity duration-300`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-3xl border-4 border-blue-400 shadow-2xl p-6 flex items-center justify-center relative overflow-hidden">
                  {/* Decorative border stars */}
                  <div className="absolute top-3 left-3 w-5 h-5 text-yellow-400">⭐</div>
                  <div className="absolute top-3 right-3 w-4 h-4 text-blue-400">⭐</div>
                  <div className="absolute bottom-3 left-3 w-4 h-4 text-green-400">⭐</div>
                  <div className="absolute bottom-3 right-3 w-5 h-5 text-purple-400">⭐</div>

                      {/* Content */}
                      {currentFlashcard?.front.type === "video" || currentFlashcard?.front.content?.includes('.mp4') ? (
                        <div className="w-full h-full flex items-center justify-center">
                          {!videoError ? (
                    <video
                              src={currentFlashcard.front.content}
                              className="w-full h-full object-cover rounded-2xl"
                        autoPlay
                        loop
                        muted
                                playsInline
                                onError={handleVideoError}
                              />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center flex-col">
                              <p className="text-gray-500 mb-2">Video không tải được</p>
                              <Button 
                                onClick={() => {
                                  setVideoError(false);
                                  // Force re-render by changing key
                                  const videoElement = document.querySelector('video');
                                  if (videoElement) {
                                    videoElement.load();
                                  }
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Thử lại
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                      <Image
                            src={currentFlashcard?.front.content || ""}
                            alt={currentFlashcard?.front.title || "Flashcard"}
                        width={300}
                        height={300}
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        </div>
                      )}
                    </div>
              </div>

              {/* Back Side */}
              <div
                className={`absolute inset-0 w-full h-full backface-hidden ${
                  isFlipped ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300`}
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-3xl border-4 border-purple-400 shadow-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Decorative border stars */}
                  <div className="absolute top-3 left-3 w-5 h-5 text-yellow-400">⭐</div>
                  <div className="absolute top-3 right-3 w-4 h-4 text-blue-400">⭐</div>
                  <div className="absolute bottom-3 left-3 w-4 h-4 text-green-400">⭐</div>
                  <div className="absolute bottom-3 right-3 w-5 h-5 text-purple-400">⭐</div>

                  {/* Text content */}
                      <h1 className="text-2xl font-bold text-blue-700 mb-3">{currentFlashcard?.back.word}</h1>
                      <p className="text-sm text-gray-700 font-medium text-center">{currentFlashcard?.back.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
              <div className="flex items-center gap-3 mt-4">
            <Button
                  onClick={prevStep}
              className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
                  onClick={nextStep}
              className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

              {/* Practice Button - Mobile */}
              {shouldShowPracticeButton() && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="text-blue-600 text-xl animate-pulse">👉</div>
                  <Button 
                    onClick={() => {
                      console.log("🎯 Practice button clicked (mobile)!");
                      console.log("  - Current step:", currentStep);
                      console.log("  - Upcoming practice cards:", getUpcomingPracticeCards().length);
                      
                      // Kiểm tra xem có practice cards sắp tới không
                      const upcomingPracticeCards = getUpcomingPracticeCards();
                      if (upcomingPracticeCards.length > 0) {
                        console.log("  - Showing practice transition modal");
                        setShowPracticeTransitionModal(true);
                      } else {
                        console.log("  - No practice cards available, showing alert");
                        alert("Chưa có bài tập practice cho nhóm flashcard này!");
                      }
                    }}
                    className="bg-cyan-400 hover:bg-cyan-500 text-blue-900 font-bold px-4 py-2 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    LUYỆN TẬP
                  </Button>
                </div>
              )}
            </div>

            {/* Card Counter */}
            <div className="absolute top-24 right-4 lg:right-8 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <span className="text-blue-700 font-semibold text-sm lg:text-base">
                {currentStep?.type === "flashcard" && currentStep.index !== undefined ? currentStep.index + 1 : 0} / {flashcards.length}
              </span>
            </div>

            {/* Practice Button - Fixed at bottom */}
            {shouldShowPracticeButton() && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
                <div className="text-blue-600 text-2xl animate-pulse hidden lg:block">👉</div>
                <Button 
                  onClick={() => {
                    console.log("🎯 Practice button clicked!");
                    console.log("  - Current step:", currentStep);
                    console.log("  - Upcoming practice cards:", getUpcomingPracticeCards().length);
                    
                    // Kiểm tra xem có practice cards sắp tới không
                    const upcomingPracticeCards = getUpcomingPracticeCards();
                    if (upcomingPracticeCards.length > 0) {
                      console.log("  - Showing practice transition modal");
                      setShowPracticeTransitionModal(true);
                    } else {
                      console.log("  - No practice cards available, showing alert");
                      alert("Chưa có bài tập practice cho nhóm flashcard này!");
                    }
                  }}
                  className="bg-cyan-400 hover:bg-cyan-500 text-blue-900 font-bold px-6 lg:px-8 py-3 lg:py-4 rounded-2xl text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  LUYỆN TẬP
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

          {/* Practice Transition Modal */}
          <PracticeTransitionModal
            isOpen={showPracticeTransitionModal}
            onClose={handlePracticeTransitionClose}
            onContinue={handlePracticeTransitionContinue}
            onReview={handlePracticeTransitionReview}
            practiceCardCount={getUpcomingPracticeCards().length}
            completedCardCount={flashcards.length}
            currentGroupSize={getCurrentGroupSize()}
          />
        </div>
      );
    }
  }

  // Transition popup for when flashcard is finished
  if (showTransitionPopup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Decorative Stars Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-20 left-20 w-8 h-8 text-yellow-300 animate-pulse">⭐</div>
          <div className="absolute top-32 right-24 w-6 h-6 text-blue-300 animate-bounce">⭐</div>
          <div className="absolute top-40 left-1/4 w-5 h-5 text-green-300 animate-pulse">⭐</div>
          <div className="absolute top-60 right-1/3 w-7 h-7 text-purple-300 animate-bounce">⭐</div>
          <div className="absolute bottom-40 left-16 w-6 h-6 text-pink-300 animate-pulse">⭐</div>
          <div className="absolute bottom-32 right-20 w-8 h-8 text-yellow-300 animate-bounce">⭐</div>
        </div>

        {/* Popup content */}
        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 w-full text-center shadow-2xl border-4 border-blue-300">
            {/* Study mascot */}
            <div className="flex justify-center mb-6">
          <Image
            src="/images/study-mascot-new.png"
            alt="Study mascot"
                width={100}
                height={100}
                className="object-contain animate-bounce"
          />
        </div>

            {/* Message */}
            <h1 className="text-2xl font-bold text-blue-700 mb-4">🎯 BẠN SẼ ĐƯỢC CHUYỂN SANG</h1>
            <p className="text-lg font-semibold text-blue-700 mb-2">Luyện tập những từ vựng vừa học</p>
            <p className="text-base text-blue-600 mb-6">Chọn cách bạn muốn tiếp tục:</p>
            
            {/* Navigation buttons */}
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => {
                  setShowTransitionPopup(false);
                  resetTimeline(); // Quay lại flashcard đầu tiên
                  setIsFlipped(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Học tiếp
              </Button>
              <Button 
                onClick={() => {
                  setShowTransitionPopup(false);
                  handlePracticeTransitionContinue(); // Chuyển sang practice
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        {/* Practice Transition Modal */}
        <PracticeTransitionModal
          isOpen={showPracticeTransitionModal}
          onClose={handlePracticeTransitionClose}
          onContinue={handlePracticeTransitionContinue}
          onReview={handlePracticeTransitionReview}
          practiceCardCount={getUpcomingPracticeCards().length}
          completedCardCount={flashcards.length}
          currentGroupSize={getCurrentGroupSize()}
        />
      </div>
    );
  }

  // Default loading state
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 text-lg font-semibold">Đang tải...</p>
        </div>
      </div>

      {/* Practice Transition Modal */}
      <PracticeTransitionModal
        isOpen={showPracticeTransitionModal}
        onClose={handlePracticeTransitionClose}
        onContinue={handlePracticeTransitionContinue}
        onReview={handlePracticeTransitionReview}
        practiceCardCount={getUpcomingPracticeCards().length}
        completedCardCount={flashcards.length}
        currentGroupSize={getCurrentGroupSize()}
      />

      {/* Completion Popup */}
      <CompletionPopup
        isOpen={showCompletionModal}
        onClose={handleCompletionClose}
        onRetry={handleCompletionRetry}
        onNext={handleCompletionNext}
        onSentenceBuilding={handleSentenceBuilding}
        subtopicName={subtopicInfo?.subTopicName || "Subtopic"}
        hasNextSubtopic={false}
        hasSentenceBuilding={hasSentenceBuilding}
      />
    </>
  );
} 